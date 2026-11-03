import https from 'https';
import { Checkout } from '../../src/index.js';
import { ApiTimeout, AuthenticationError } from '../../src/services/errors.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';
const CLIENT = 'ack_test_client';
const CLIENT_CREDENTIAL = 'test_client_credential_value_1234567890';
const AGENT_KEY = 'test_agent_key_value_1234567890';
const API = 'https://123456789.api.sandbox.checkout.com';
const ACCESS = 'https://123456789.access.sandbox.checkout.com';

const buildOAuthClient = (options = {}) =>
    new Checkout(CLIENT_CREDENTIAL, {
        client: CLIENT,
        scope: ['gateway'],
        environment: 'sandbox',
        subdomain: '123456789',
        ...options,
    });

const mockTokenOnce = () =>
    nock(ACCESS)
        .post('/connect/token')
        .once()
        .reply(200, { access_token: 'token_abc', expires_in: 3600, token_type: 'Bearer', scope: 'gateway' });

const serialize = (err) => `${String(err)} ${err.message} ${JSON.stringify(err)} ${JSON.stringify(err.body)}`;

const expectNoCredentials = (err) => {
    const text = serialize(err);
    expect(text).to.not.include(CLIENT_CREDENTIAL);
    expect(text).to.not.include('client_secret');
    expect(text).to.not.include(AGENT_KEY);
};

const requestWithAxios = async (cko) => {
    try {
        await cko.googlePay.getEnrollmentState('ent_1');
    } catch (err) {
        return err;
    }
    throw new Error('expected the request to fail');
};

describe('HTTP token handling', () => {
    afterEach(() => nock.cleanAll());

    describe('error from the token endpoint with the axios client', () => {
        it('400 invalid_client maps to AuthenticationError and the error omits credentials', async () => {
            nock(ACCESS)
                .post('/connect/token')
                .reply(400, { error: 'invalid_client' });

            const cko = buildOAuthClient({
                httpClient: 'axios',
                agent: new https.Agent({ key: AGENT_KEY }),
            });
            const err = await requestWithAxios(cko);

            expect(err).to.be.instanceOf(AuthenticationError);
            expect(err.body).to.deep.equal({ error: 'invalid_client' });
            expectNoCredentials(err);
        });

        it('401 maps to AuthenticationError and the error omits credentials', async () => {
            nock(ACCESS)
                .post('/connect/token')
                .reply(401, { error: 'unauthorized' });

            const cko = buildOAuthClient({ httpClient: 'axios' });
            const err = await requestWithAxios(cko);

            expect(err).to.be.instanceOf(AuthenticationError);
            expectNoCredentials(err);
        });

        it('network failure error omits credentials', async () => {
            nock(ACCESS)
                .post('/connect/token')
                .replyWithError('socket hang up');

            const cko = buildOAuthClient({
                httpClient: 'axios',
                agent: new https.Agent({ key: AGENT_KEY }),
            });
            const err = await requestWithAxios(cko);

            expect(err.body).to.include('socket hang up');
            expectNoCredentials(err);
        });

        it('timeout maps to ApiTimeout', async () => {
            nock(ACCESS)
                .post('/connect/token')
                .delay(200)
                .reply(200, { access_token: 'token_abc', expires_in: 3600, token_type: 'Bearer' });

            const cko = buildOAuthClient({ httpClient: 'axios', timeout: 50 });
            const err = await requestWithAxios(cko);

            expect(err).to.be.instanceOf(ApiTimeout);
        });
    });

    describe('token reuse', () => {
        ['fetch', 'axios'].forEach((httpClient) => {
            it(`reuses the token on the second call with the ${httpClient} client`, async () => {
                mockTokenOnce();
                const authHeaders = [];
                nock(API)
                    .get('/googlepay/enrollments/ent_1/state')
                    .twice()
                    .reply(function () {
                        authHeaders.push(this.req.headers.authorization);
                        return [200, { state: 'active' }];
                    });

                const cko = buildOAuthClient(httpClient === 'axios' ? { httpClient } : {});
                await cko.googlePay.getEnrollmentState('ent_1');
                await cko.googlePay.getEnrollmentState('ent_1');

                expect(authHeaders).to.deep.equal(['Bearer token_abc', 'Bearer token_abc']);
                expect(nock.isDone()).to.equal(true);
            });
        });

        it('stores the token expiry in milliseconds', async () => {
            mockTokenOnce();
            nock(API).get('/googlepay/enrollments/ent_1/state').reply(200, { state: 'active' });

            const cko = buildOAuthClient();
            const before = Date.now();
            await cko.googlePay.getEnrollmentState('ent_1');
            const after = Date.now();

            const expires = cko.config.access.expires.getTime();
            expect(expires).to.be.at.least(before + 3600 * 1000);
            expect(expires).to.be.at.most(after + 3600 * 1000);
        });

        it('access.updateAccessToken stores the token expiry in milliseconds', () => {
            const cko = buildOAuthClient();
            const before = Date.now();
            cko.access.updateAccessToken({
                access_token: 'token_abc',
                token_type: 'Bearer',
                scope: 'gateway',
                expires_in: 3600,
            });
            const after = Date.now();

            const expires = cko.config.access.expires.getTime();
            expect(expires).to.be.at.least(before + 3600 * 1000);
            expect(expires).to.be.at.most(after + 3600 * 1000);
        });
    });

    describe('Authorization header after the first token request', () => {
        const cases = [
            {
                name: 'googlePay.enroll',
                mock: () => nock(API).post('/googlepay/enrollments'),
                call: (cko) => cko.googlePay.enroll({ entity_id: 'ent_1' }),
            },
            {
                name: 'googlePay.registerDomain',
                mock: () => nock(API).post('/googlepay/enrollments/ent_1/domain'),
                call: (cko) => cko.googlePay.registerDomain('ent_1', { web_domain: 'example.com' }),
            },
            {
                name: 'googlePay.getRegisteredDomains',
                mock: () => nock(API).get('/googlepay/enrollments/ent_1/domains'),
                call: (cko) => cko.googlePay.getRegisteredDomains('ent_1'),
            },
            {
                name: 'googlePay.getEnrollmentState',
                mock: () => nock(API).get('/googlepay/enrollments/ent_1/state'),
                call: (cko) => cko.googlePay.getEnrollmentState('ent_1'),
            },
            {
                name: 'onboardingSimulator.getAvailableRequirements',
                mock: () => nock(API).get('/simulate/requirements-due'),
                call: (cko) => cko.onboardingSimulator.getAvailableRequirements(),
            },
            {
                name: 'onboardingSimulator.getAvailableScenarios',
                mock: () => nock(API).get('/simulate/scenarios'),
                call: (cko) => cko.onboardingSimulator.getAvailableScenarios(),
            },
            {
                name: 'onboardingSimulator.setRequirementsDue',
                mock: () => nock(API).post('/simulate/entities/ent_1/requirements-due'),
                call: (cko) => cko.onboardingSimulator.setRequirementsDue('ent_1', { fields: [] }),
            },
            {
                name: 'onboardingSimulator.runScenario',
                mock: () => nock(API).post('/simulate/entities/ent_1/scenarios/scn_1'),
                call: (cko) => cko.onboardingSimulator.runScenario('ent_1', 'scn_1'),
            },
            {
                name: 'onboardingSimulator.setEntityStatus',
                mock: () => nock(API).post('/simulate/entities/ent_1/status'),
                call: (cko) => cko.onboardingSimulator.setEntityStatus('ent_1', { status: 'active' }),
            },
            {
                name: 'tokens.getTokenMetadata',
                mock: () => nock(API).get('/tokens/tok_abc/metadata'),
                call: (cko) => cko.tokens.getTokenMetadata('tok_abc'),
            },
        ];

        cases.forEach(({ name, mock, call }) => {
            it(`${name} sends the bearer token`, async () => {
                mockTokenOnce();
                nock(API).get('/googlepay/enrollments/ent_1/state').reply(200, { state: 'active' });
                let authHeader;
                mock().reply(function () {
                    authHeader = this.req.headers.authorization;
                    return [200, {}];
                });

                const cko = buildOAuthClient();
                await cko.googlePay.getEnrollmentState('ent_1');
                await call(cko);

                expect(authHeader).to.equal('Bearer token_abc');
            });
        });
    });

    describe('per-request headers', () => {
        it('sessions.get sends channel only on that request', async () => {
            const channels = [];
            nock(API)
                .get('/sessions/sid_1')
                .reply(function () {
                    channels.push(this.req.headers.channel);
                    return [200, { id: 'sid_1' }];
                });
            nock(API)
                .get('/payments/pay_1')
                .reply(function () {
                    channels.push(this.req.headers.channel);
                    return [200, { id: 'pay_1' }];
                });

            const cko = new Checkout(SK, { subdomain: '123456789' });
            await cko.sessions.get('sid_1', 'browser');
            await cko.payments.get('pay_1');

            expect(channels).to.deep.equal(['browser', undefined]);
            expect(cko.config.headers).to.not.have.property('channel');
        });

        it('sessions.get without channel sends no channel header', async () => {
            let headers;
            nock(API)
                .get('/sessions/sid_1')
                .reply(function () {
                    headers = this.req.headers;
                    return [200, { id: 'sid_1' }];
                });

            const cko = new Checkout(SK, { subdomain: '123456789' });
            await cko.sessions.get('sid_1');

            expect(headers).to.not.have.property('channel');
            expect(cko.config.headers).to.not.have.property('channel');
        });
    });
});
