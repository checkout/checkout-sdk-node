import axios from 'axios';
import http from 'http';
import nock from 'nock';
import { inspect } from 'util';
import { expect } from 'chai';
import { Checkout } from '../../src/index.js';
import {
    ActionNotAllowed,
    ApiError,
    AuthenticationError,
    ValidationError,
} from '../../src/services/errors.js';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';
const CLIENT = 'ack_test_client';
const CLIENT_CREDENTIAL = 'test_client_credential_value_1234567890';
const CARD_NUMBER = '4242424242424242';
const CARD_CVV = '100';
const CLIENTS = ['axios', 'fetch'];
const STATUSES_3XX = [301, 302, 303, 307, 308];
const TOKEN = { access_token: 'token_value', token_type: 'Bearer', expires_in: 3600 };

// A local HTTP server that records every request it receives and answers with `handler`.
const startServer = async () => {
    const server = {
        requests: [],
        handler: (req, res) => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end('{}');
        },
    };
    server.http = http.createServer((req, res) => {
        const chunks = [];
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', () => {
            server.requests.push({
                method: req.method,
                url: req.url,
                headers: req.headers,
                body: Buffer.concat(chunks).toString(),
            });
            server.handler(req, res);
        });
    });
    await new Promise((resolve) => server.http.listen(0, '127.0.0.1', resolve));
    server.origin = `http://127.0.0.1:${server.http.address().port}`;
    return server;
};

const stopServer = (server) => new Promise((resolve) => server.http.close(resolve));

const respond = (status, headers = {}, body = '') => (req, res) => {
    res.writeHead(status, headers);
    res.end(body);
};

const json = (status, body) => respond(status, { 'Content-Type': 'application/json' }, JSON.stringify(body));

// Every place an error can carry text: message, stack, JSON, body and hidden properties (cause).
const serialize = (err) =>
    `${String(err)} ${err.message} ${err.stack} ${JSON.stringify(err)} ${JSON.stringify(err.body)} ${inspect(err, { depth: 6, showHidden: true })}`;

const expectNoCredentials = (err, ...values) => {
    const text = serialize(err);
    [SK, CLIENT_CREDENTIAL, 'client_secret', CARD_NUMBER, ...values].forEach((value) => {
        expect(text).to.not.include(value);
    });
};

const catchError = async (promise) => {
    try {
        await promise;
    } catch (err) {
        return err;
    }
    throw new Error('expected the request to fail');
};

const withClient = (httpClient) => (httpClient === 'axios' ? { httpClient } : {});

const skClient = (httpClient, api) => {
    const cko = new Checkout(SK, { subdomain: '123456789', ...withClient(httpClient) });
    cko.config.host = api.origin;
    cko.config.forwardUrl = api.origin;
    return cko;
};

const oauthClient = (httpClient, api) => {
    const cko = new Checkout(CLIENT_CREDENTIAL, {
        client: CLIENT,
        scope: ['gateway'],
        environment: 'sandbox',
        subdomain: '123456789',
        ...withClient(httpClient),
    });
    cko.config.host = api.origin;
    cko.config.environmentSubdomain = { getOAuthAuthorizationApi: () => `${api.origin}/connect/token` };
    return cko;
};

// Requests whose response is handled by the SDK, each with the path the API answers on.
const REQUESTS = [
    {
        name: 'payments.request (POST)',
        path: '/payments',
        call: (cko) =>
            cko.payments.request({
                source: { type: 'card', number: CARD_NUMBER, cvv: CARD_CVV, expiry_month: 1, expiry_year: 2030 },
                amount: 100,
                currency: 'USD',
            }),
    },
    { name: 'payments.get (GET)', path: '/payments/pay_123', call: (cko) => cko.payments.get('pay_123') },
    {
        name: 'forward.forwardRequest (POST)',
        path: '/forward',
        call: (cko) =>
            cko.forward.forwardRequest({
                source: { type: 'id', id: 'src_123' },
                destination_request: {
                    url: 'https://example.com/pay',
                    method: 'POST',
                    headers: { raw: { Authorization: 'third_party_value' } },
                    body: '{}',
                },
            }),
        secret: 'third_party_value',
    },
    {
        name: 'forward.createSecret (POST)',
        path: '/secrets',
        call: (cko) => cko.forward.createSecret({ name: 'n', value: 'secret_value_123' }),
        secret: 'secret_value_123',
    },
    {
        name: 'issuing.requestCardholderAccessToken (POST)',
        path: '/issuing/access/connect/token',
        call: (cko) =>
            cko.issuing.requestCardholderAccessToken({
                grant_type: 'client_credentials',
                client_id: 'cli_1',
                client_secret: 'cardholder_value_123',
                cardholder_id: 'crh_1',
            }),
        secret: 'cardholder_value_123',
    },
    {
        name: 'webhooks.registerWebhook (POST)',
        path: '/webhooks',
        call: (cko) =>
            cko.webhooks.registerWebhook({ url: 'https://example.com/hook', headers: { authorization: 'hook_value_123' } }),
        secret: 'hook_value_123',
    },
];

describe('HTTP response policy', () => {
    let api;
    let other;

    before(async () => {
        nock.restore();
        nock.enableNetConnect();
        api = await startServer();
        other = await startServer();
    });

    after(async () => {
        await stopServer(api);
        await stopServer(other);
        nock.activate();
    });

    beforeEach(() => {
        api.requests = [];
        other.requests = [];
        other.handler = json(200, TOKEN);
    });

    const targets = () => [
        { name: 'same host', location: `${api.origin}/moved` },
        { name: 'other host', location: `${other.origin}/moved` },
    ];

    describe('does not follow redirects', () => {
        CLIENTS.forEach((httpClient) => {
            REQUESTS.forEach((request) => {
                STATUSES_3XX.forEach((status) => {
                    ['same host', 'other host'].forEach((targetName) => {
                        it(`${httpClient}: ${request.name} ${status} to the ${targetName} gives ApiError with the status only`, async () => {
                            const target = targets().find((t) => t.name === targetName);
                            api.handler = (req, res) =>
                                req.url === request.path
                                    ? respond(status, { Location: target.location }, `moved to ${target.location}`)(req, res)
                                    : json(200, TOKEN)(req, res);

                            const err = await catchError(request.call(skClient(httpClient, api)));

                            expect(err).to.be.instanceOf(ApiError);
                            expect(err.http_code).to.equal(status);
                            expect(err.body).to.deep.equal({ status });
                            expect(api.requests.map((r) => r.url)).to.deep.equal([request.path]);
                            expect(other.requests).to.deep.equal([]);
                            expectNoCredentials(err, target.location, ...(request.secret ? [request.secret] : []));
                        });
                    });
                });
            });
        });
    });

    describe('status-only errors', () => {
        CLIENTS.forEach((httpClient) => {
            [300, 304].forEach((status) => {
                it(`${httpClient}: a ${status} gives ApiError with the status only`, async () => {
                    api.handler = respond(status);

                    const err = await catchError(skClient(httpClient, api).payments.get('pay_123'));

                    expect(err).to.be.instanceOf(ApiError);
                    expect(err.http_code).to.equal(status);
                    expect(err.body).to.deep.equal({ status });
                });
            });

            it(`${httpClient}: the error keeps the request id of the response`, async () => {
                api.handler = respond(307, { Location: `${other.origin}/moved`, 'Cko-Request-Id': 'req_123' });

                const err = await catchError(skClient(httpClient, api).payments.get('pay_123'));

                expect(err.body).to.deep.equal({ status: 307, request_id: 'req_123' });
                expect(other.requests).to.deep.equal([]);
            });
        });
    });

    describe('OAuth token request', () => {
        CLIENTS.forEach((httpClient) => {
            STATUSES_3XX.forEach((status) => {
                ['same host', 'other host'].forEach((targetName) => {
                    it(`${httpClient}: ${status} to the ${targetName} gives AuthenticationError with the status only`, async () => {
                        const target = targets().find((t) => t.name === targetName);
                        api.handler = respond(status, { Location: target.location });
                        const cko = oauthClient(httpClient, api);

                        const err = await catchError(cko.payments.get('pay_123'));

                        expect(err).to.be.instanceOf(AuthenticationError);
                        expect(err.body).to.deep.equal({ status });
                        expect(api.requests.map((r) => r.url)).to.deep.equal(['/connect/token']);
                        expect(other.requests).to.deep.equal([]);
                        expect(cko.config.access.token).to.equal(undefined);
                        expectNoCredentials(err, target.location);
                    });
                });
            });

            it(`${httpClient}: access.request 307 gives AuthenticationError with the status only`, async () => {
                api.handler = respond(307, { Location: `${other.origin}/moved` });
                const cko = oauthClient(httpClient, api);

                const err = await catchError(
                    cko.access.request({
                        grant_type: 'client_credentials',
                        client_id: CLIENT,
                        client_secret: CLIENT_CREDENTIAL,
                        scope: 'gateway',
                    })
                );

                expect(err).to.be.instanceOf(AuthenticationError);
                expect(err.body).to.deep.equal({ status: 307 });
                expect(other.requests).to.deep.equal([]);
                expectNoCredentials(err);
            });
        });
    });

    describe('report file download', () => {
        const FILE_PATH = '/reports/rpt_1/files/file_1';
        const getFile = (cko) => cko.reports.getReportFile('rpt_1', 'file_1');

        CLIENTS.forEach((httpClient) => {
            it(`${httpClient}: follows one 302 as a GET without Authorization, Cko- headers, Referer or body`, async () => {
                api.handler = respond(302, { Location: `${other.origin}/file.csv?X-Signature=abc` });
                other.handler = respond(200, { 'Content-Type': 'text/csv' }, 'a,b\n1,2\n');

                const csv = await getFile(skClient(httpClient, api));

                expect(csv.toString()).to.equal('a,b\n1,2\n');
                expect(other.requests).to.have.length(1);
                const [download] = other.requests;
                expect(download.method).to.equal('GET');
                expect(download.url).to.equal('/file.csv?X-Signature=abc');
                expect(download.body).to.equal('');
                expect(download.headers).to.not.have.property('authorization');
                expect(download.headers).to.not.have.property('referer');
                expect(Object.keys(download.headers).filter((name) => name.startsWith('cko-'))).to.deep.equal([]);
                expect(api.requests[0].headers.authorization).to.equal(SK);
            });

            it(`${httpClient}: the file request has no Cookie or Proxy-Authorization, other configured headers are kept`, async () => {
                api.handler = respond(302, { Location: `${other.origin}/file.csv` });
                other.handler = respond(200, { 'Content-Type': 'text/csv' }, 'a\n');
                const cko = new Checkout(SK, {
                    subdomain: '123456789',
                    headers: { Cookie: 'session=1', 'Proxy-Authorization': 'Basic abc', 'X-Merchant': 'kept' },
                    ...withClient(httpClient),
                });
                cko.config.host = api.origin;

                await getFile(cko);

                const [download] = other.requests;
                expect(download.headers).to.not.have.property('cookie');
                expect(download.headers).to.not.have.property('proxy-authorization');
                expect(download.headers['x-merchant']).to.equal('kept');
                expect(api.requests[0].headers.cookie).to.equal('session=1');
            });

            [301, 303, 307, 308].forEach((status) => {
                it(`${httpClient}: a ${status} on the file request is not followed`, async () => {
                    api.handler = respond(status, { Location: `${other.origin}/file.csv` });

                    const err = await catchError(getFile(skClient(httpClient, api)));

                    expect(err).to.be.instanceOf(ApiError);
                    expect(err.http_code).to.equal(status);
                    expect(err.body).to.deep.equal({ status });
                    expect(other.requests).to.deep.equal([]);
                });
            });

            [
                'http://example.invalid/file.csv',
                'http://localhost.example/file.csv',
                'http://127.0.0.1.nip.io/file.csv',
                'http://0.0.0.0/file.csv',
                'ftp://127.0.0.1/file.csv',
                'ws://127.0.0.1/file.csv',
                'file:///etc/hosts',
                'https://exa%00mple.com/file.csv',
                '//example.invalid/file.csv',
            ].forEach((location) => {
                it(`${httpClient}: a 302 to ${location} is not followed`, async () => {
                    api.handler = respond(302, { Location: location });

                    const err = await catchError(getFile(skClient(httpClient, api)));

                    expect(err).to.be.instanceOf(ApiError);
                    expect(err.http_code).to.equal(302);
                    expect(err.body).to.deep.equal({ status: 302 });
                    expectNoCredentials(err, location);
                });
            });

            it(`${httpClient}: a 302 without Location is not followed`, async () => {
                api.handler = respond(302);

                const err = await catchError(getFile(skClient(httpClient, api)));

                expect(err).to.be.instanceOf(ApiError);
                expect(err.http_code).to.equal(302);
                expect(err.body).to.deep.equal({ status: 302 });
                expect(api.requests).to.have.length(1);
                expect(other.requests).to.deep.equal([]);
            });

            it(`${httpClient}: configured Cko- and Referer headers are not sent to the file location`, async () => {
                api.handler = respond(302, { Location: `${other.origin}/file.csv` });
                other.handler = respond(200, { 'Content-Type': 'text/csv' }, 'a\n');
                const cko = new Checkout(SK, {
                    subdomain: '123456789',
                    headers: { 'Cko-Custom': 'api-only', Referer: 'https://merchant.example/page' },
                    ...withClient(httpClient),
                });
                cko.config.host = api.origin;

                await getFile(cko);

                const [download] = other.requests;
                expect(download.headers).to.not.have.property('cko-custom');
                expect(download.headers).to.not.have.property('referer');
                expect(api.requests[0].headers['cko-custom']).to.equal('api-only');
            });

            it(`${httpClient}: a 302 to the same host is followed without Authorization`, async () => {
                api.handler = (req, res) =>
                    req.url === FILE_PATH
                        ? respond(302, { Location: '/file.csv' })(req, res)
                        : respond(200, { 'Content-Type': 'text/csv' }, 'same\n')(req, res);

                const csv = await getFile(skClient(httpClient, api));

                expect(csv.toString()).to.equal('same\n');
                expect(api.requests.map((r) => r.url)).to.deep.equal([FILE_PATH, '/file.csv']);
                expect(api.requests[1].headers).to.not.have.property('authorization');
            });

            it(`${httpClient}: user information in the file location is not sent`, async () => {
                const location = other.origin.replace('http://', 'http://user:location_password_123@');
                api.handler = respond(302, { Location: `${location}/file.csv` });
                other.handler = respond(200, { 'Content-Type': 'text/csv' }, 'a\n');

                await getFile(skClient(httpClient, api));

                const [download] = other.requests;
                expect(download.headers).to.not.have.property('authorization');
                expect(download.url).to.equal('/file.csv');
            });

            it(`${httpClient}: an error of the file location keeps the request id of the API response`, async () => {
                api.handler = respond(302, { Location: `${other.origin}/file.csv`, 'Cko-Request-Id': 'req_file_1' });
                other.handler = respond(404, {}, 'missing');

                const err = await catchError(getFile(skClient(httpClient, api)));

                expect(err.http_code).to.equal(404);
                expect(err.body).to.deep.equal({ status: 404, request_id: 'req_file_1' });
            });

            it(`${httpClient}: a second 302 from the file location is not followed`, async () => {
                api.handler = (req, res) =>
                    req.url === FILE_PATH
                        ? respond(302, { Location: `${other.origin}/file.csv` })(req, res)
                        : respond(200, {}, 'again')(req, res);
                other.handler = respond(302, { Location: `${api.origin}/again` });

                const err = await catchError(getFile(skClient(httpClient, api)));

                expect(err).to.be.instanceOf(ApiError);
                expect(err.http_code).to.equal(302);
                expect(err.body).to.deep.equal({ status: 302 });
                expect(api.requests.map((r) => r.url)).to.deep.equal([FILE_PATH]);
                expect(other.requests).to.have.length(1);
            });

            it(`${httpClient}: an error status of the file location keeps the SDK error type with the status only`, async () => {
                api.handler = respond(302, { Location: `${other.origin}/file.csv?X-Signature=abc` });
                other.handler = respond(403, { 'Content-Type': 'application/xml' }, '<Error>X-Signature=abc</Error>');

                const err = await catchError(getFile(skClient(httpClient, api)));

                expect(err).to.be.instanceOf(ActionNotAllowed);
                expect(err.body).to.deep.equal({ status: 403 });
                expectNoCredentials(err, 'X-Signature', 'abc');
            });

            it(`${httpClient}: other CSV downloads do not follow a 302`, async () => {
                api.handler = respond(302, { Location: `${other.origin}/file.csv` });

                const err = await catchError(skClient(httpClient, api).reconciliation.getStatementCsv('stm_1'));

                expect(err).to.be.instanceOf(ApiError);
                expect(err.http_code).to.equal(302);
                expect(other.requests).to.deep.equal([]);
            });
        });
    });

    describe('axios client, response processing', () => {
        it('a CSV response the SDK cannot read keeps the request URL in the error body, as before', async () => {
            api.handler = json(200, 5);

            const err = await catchError(skClient('axios', api).reconciliation.getStatementCsv('stm_1'));

            expect(err).to.be.instanceOf(ApiError);
            expect(err.body).to.match(
                /^request to http:\/\/127\.0\.0\.1:\d+\/reporting\/statements\/stm_1\/payments\/download failed, reason: /
            );
        });
    });

    describe('axios client with a permissive validateStatus default', () => {
        let saved;

        beforeEach(() => {
            saved = axios.defaults.validateStatus;
            axios.defaults.validateStatus = () => true;
        });

        afterEach(() => {
            axios.defaults.validateStatus = saved;
        });

        it('an error status is returned as the response, as without the response policy', async () => {
            api.handler = json(422, { error_codes: ['url_invalid'] });

            const body = await skClient('axios', api).webhooks.registerWebhook({ url: 'https://example.com/hook' });

            expect(body).to.deep.equal({ error_codes: ['url_invalid'] });
        });

        it('a 307 on an API request is still an error and is not followed', async () => {
            api.handler = respond(307, { Location: `${other.origin}/moved` });

            const err = await catchError(REQUESTS[0].call(skClient('axios', api)));

            expect(err).to.be.instanceOf(ApiError);
            expect(err.http_code).to.equal(307);
            expect(other.requests).to.deep.equal([]);
        });

        it('a 307 on the OAuth token request is still an error, no token is stored', async () => {
            api.handler = respond(307, { Location: `${other.origin}/moved` });
            const cko = oauthClient('axios', api);

            const err = await catchError(cko.payments.get('pay_123'));

            expect(err).to.be.instanceOf(AuthenticationError);
            expect(err.body).to.deep.equal({ status: 307 });
            expect(api.requests.map((r) => r.url)).to.deep.equal(['/connect/token']);
            expect(cko.config.access.token).to.equal(undefined);
        });

        it('an error status on the OAuth token request is still an error, no API request is sent', async () => {
            api.handler = json(401, { error: 'invalid_client' });
            const cko = oauthClient('axios', api);

            const err = await catchError(cko.payments.get('pay_123'));

            expect(err).to.be.instanceOf(AuthenticationError);
            expect(err.body).to.deep.equal({ error: 'invalid_client' });
            expectNoCredentials(err);
            expect(api.requests.map((r) => r.url)).to.deep.equal(['/connect/token']);
            expect(cko.config.access.token).to.equal(undefined);
        });

        it('an error status of the file location is still an error, without the body of that response', async () => {
            api.handler = respond(302, { Location: `${other.origin}/file.csv`, 'Cko-Request-Id': 'req_1' });
            other.handler = respond(403, { 'Content-Type': 'text/csv' }, 'file location error body');

            const err = await catchError(skClient('axios', api).reports.getReportFile('rpt_1', 'file_1'));

            expect(err).to.be.instanceOf(ActionNotAllowed);
            expect(err.body).to.deep.equal({ status: 403, request_id: 'req_1' });
            expect(JSON.stringify(err)).to.not.include('file location error body');
        });
    });

    describe('axios client with application default headers', () => {
        let saved;

        beforeEach(() => {
            saved = { common: { ...axios.defaults.headers.common }, get: { ...axios.defaults.headers.get }, auth: axios.defaults.auth };
            axios.defaults.headers.common.Authorization = 'Bearer application';
            axios.defaults.headers.common.Cookie = 'application=1';
            axios.defaults.headers.common['Proxy-Authorization'] = 'Basic application';
            axios.defaults.headers.common['Cko-Application'] = 'application';
            axios.defaults.headers.get.Referer = 'https://application.example/';
            axios.defaults.headers.common['X-Application'] = 'kept';
            axios.defaults.auth = { username: 'application', password: 'application' };
        });

        afterEach(() => {
            axios.defaults.headers.common = saved.common;
            axios.defaults.headers.get = saved.get;
            axios.defaults.auth = saved.auth;
        });

        it('the file request has none of the headers the file location never receives', async () => {
            api.handler = respond(302, { Location: `${other.origin}/file.csv` });
            other.handler = respond(200, { 'Content-Type': 'text/csv' }, 'a\n');

            await skClient('axios', api).reports.getReportFile('rpt_1', 'file_1');

            const [download] = other.requests;
            expect(download.headers).to.not.have.property('authorization');
            expect(download.headers).to.not.have.property('cookie');
            expect(download.headers).to.not.have.property('proxy-authorization');
            expect(download.headers).to.not.have.property('cko-application');
            expect(download.headers).to.not.have.property('referer');
            expect(download.headers['x-application']).to.equal('kept');
        });
    });

    describe('axios client with other application defaults', () => {
        let saved;

        beforeEach(() => {
            saved = { maxRedirects: axios.defaults.maxRedirects, adapter: axios.defaults.adapter };
        });

        afterEach(() => {
            axios.defaults.maxRedirects = saved.maxRedirects;
            axios.defaults.adapter = saved.adapter;
        });

        it('a maxRedirects default does not make a 307 followed', async () => {
            axios.defaults.maxRedirects = 5;
            api.handler = respond(307, { Location: `${other.origin}/moved` });

            const err = await catchError(REQUESTS[0].call(skClient('axios', api)));

            expect(err).to.be.instanceOf(ApiError);
            expect(err.http_code).to.equal(307);
            expect(other.requests).to.deep.equal([]);
        });

        it('the fetch adapter as default does not make a 307 followed', async () => {
            axios.defaults.adapter = 'fetch';
            api.handler = respond(307, { Location: `${other.origin}/moved` });

            const err = await catchError(REQUESTS[0].call(skClient('axios', api)));

            expect(err).to.be.instanceOf(ApiError);
            expect(err.http_code).to.equal(307);
            expect(other.requests).to.deep.equal([]);
        });
    });

    describe('without the axios validateStatus default', () => {
        let saved;

        beforeEach(() => {
            saved = axios.defaults.validateStatus;
            axios.defaults.validateStatus = null;
        });

        afterEach(() => {
            axios.defaults.validateStatus = saved;
        });

        it('a 422 is returned as the response, as axios does without validateStatus', async () => {
            api.handler = json(422, { error_codes: ['url_invalid'] });

            const body = await skClient('axios', api).webhooks.registerWebhook({ url: 'https://example.com/hook' });

            expect(body).to.deep.equal({ error_codes: ['url_invalid'] });
        });
    });

    describe('error statuses keep their SDK error type', () => {
        CLIENTS.forEach((httpClient) => {
            it(`${httpClient}: 422 gives ValidationError`, async () => {
                api.handler = json(422, { error_codes: ['url_invalid'] });

                const err = await catchError(skClient(httpClient, api).webhooks.registerWebhook({ url: 'https://example.com/hook' }));

                expect(err).to.be.instanceOf(ValidationError);
                expect(err.body).to.deep.equal({ error_codes: ['url_invalid'] });
            });

            it(`${httpClient}: OAuth token 401 gives AuthenticationError with the response body`, async () => {
                api.handler = json(401, { error: 'invalid_client' });

                const err = await catchError(oauthClient(httpClient, api).payments.get('pay_123'));

                expect(err).to.be.instanceOf(AuthenticationError);
                expect(err.body).to.deep.equal({ error: 'invalid_client' });
                expectNoCredentials(err);
            });

            it(`${httpClient}: OAuth token 500 with a JSON null body gives ApiError 500`, async () => {
                api.handler = respond(500, { 'Content-Type': 'application/json' }, 'null');

                const err = await catchError(oauthClient(httpClient, api).payments.get('pay_123'));

                expect(err).to.be.instanceOf(ApiError);
                expect(err.http_code).to.equal(500);
                expectNoCredentials(err);
            });
        });
    });

    describe('connection errors', () => {
        let closedOrigin;

        before(async () => {
            const server = await startServer();
            closedOrigin = server.origin;
            await stopServer(server);
        });

        const closedApi = () => ({ origin: closedOrigin });

        CLIENTS.forEach((httpClient) => {
            it(`${httpClient}: an API request gives ApiError without http_code, with the client error as cause`, async () => {
                const url = `${closedOrigin}/payments`;

                const err = await catchError(REQUESTS[0].call(skClient(httpClient, closedApi())));

                expect(err).to.be.instanceOf(ApiError);
                expect(err.http_code).to.equal(undefined);
                expect(err.cause).to.be.instanceOf(Error);
                expect(err.body).to.equal(`request to ${url} failed, reason: ${err.cause.message}`);
                expect(err.cause.code).to.equal('ECONNREFUSED');
                expect(Object.keys(err)).to.not.include('cause');
                expectNoCredentials(err, '"cvv"');
            });

            it(`${httpClient}: the OAuth token request gives ApiError without http_code, with the client error as cause`, async () => {
                const url = `${closedOrigin}/connect/token`;

                const err = await catchError(oauthClient(httpClient, closedApi()).payments.get('pay_123'));

                expect(err).to.be.instanceOf(ApiError);
                expect(err.http_code).to.equal(undefined);
                expect(err.cause).to.be.instanceOf(Error);
                expect(err.body).to.equal(
                    httpClient === 'axios' ? `request to ${url} failed, reason: ${err.cause.message}` : err.cause.message
                );
                expect(err.cause.code).to.equal('ECONNREFUSED');
                expectNoCredentials(err);
            });

            it(`${httpClient}: input validation: a configured value the client rejects`, async () => {
                const cko = new Checkout(`${SK}\r\nX-Extra: 1`, { subdomain: '123456789', ...withClient(httpClient) });
                cko.config.host = closedOrigin;

                const err = await catchError(cko.payments.get('pay_123'));

                expect(err).to.be.instanceOf(ApiError);
                expect(err.http_code).to.equal(undefined);
                expectNoCredentials(err, 'X-Extra');
            });

            it(`${httpClient}: input validation: a configured header value the client rejects`, async () => {
                const cko = new Checkout(SK, {
                    subdomain: '123456789',
                    headers: { 'X-Merchant-Key': 'merchant_value_123\u0000' },
                    ...withClient(httpClient),
                });
                cko.config.host = closedOrigin;

                const err = await catchError(cko.payments.get('pay_123'));

                expect(err).to.be.instanceOf(ApiError);
                expectNoCredentials(err, 'merchant_value_123');
            });

            it(`${httpClient}: input validation: a host with user information`, async () => {
                const cko = skClient(httpClient, { origin: closedOrigin.replace('http://', 'http://user:host_password_123@') });

                const err = await catchError(cko.payments.get('pay_123'));

                expect(err).to.be.instanceOf(ApiError);
                expect(err.body).to.match(/^request to http:\/\/127\.0\.0\.1:\d+\/payments\/pay_123 failed, reason: /);
                expectNoCredentials(err, 'host_password_123');
            });

            [
                'http://user:host_password_123@127.0.0.1:99999',
                'http://user:host_password_123@exa mple.com',
                'user:host_password_123@127.0.0.1:1',
                '//user:host_password_123@127.0.0.1:1',
                '\thttp://user:host_password_123@127.0.0.1:99999',
                'http:\\\\user:host_password_123@127.0.0.1:99999',
                'ht tp://user:host_password_123@127.0.0.1:1',
                'http://user:host/pass?word#123_host_password_123@127.0.0.1:99999',
            ].forEach((origin) => {
                it(`${httpClient}: input validation: a host with user information that is not a valid URL (${JSON.stringify(origin)})`, async () => {
                    const cko = skClient(httpClient, { origin });

                    const err = await catchError(cko.payments.get('pay_123'));

                    expect(err).to.be.instanceOf(Error);
                    expectNoCredentials(err, 'host_password_123', 'pass?word');
                });
            });
        });
    });
});
