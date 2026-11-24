import axios from 'axios';
import { Writable } from 'stream';
import {
    API_VERSION_HEADER,
    ETAG_HEADER,
    LIVE_ACCESS_URL,
    REQUEST_ID_HEADER,
    SANDBOX_ACCESS_URL,
} from '../config.js';
import Environment from '../Environment.js';
import { ApiError, ApiTimeout, AuthenticationError, determineError } from './errors.js';

import pjson from '../../package.json' with { type: 'json' };

function buildResponse(config, response) {
    if (config.csv) {
        return buildCsvResponse(response);
    }

    return buildJsonResponse(response);
}

async function buildCsvResponse(response) {
    const txt = await response.text();

    const csv = Buffer.from(txt);

    return {
        status: response.status,
        csv,
    };
}

function buildJsonResponse(response) {
    return response.text().then((text) => {
        let data = {};
        
        if (text) {
            try {
                data = JSON.parse(text);
            } catch (err) {
                // If parsing fails, return the raw text (likely HTML error page)
                // This preserves the error information for debugging
                data = { _raw: text, _parseError: err.message };
            }
        }
        
        const headers = getResponseHeaders(response);

        return {
            status: response.status,
            json: data,
            headers,
        };
    });
}

function getRequestHeaders(config, request, authHeader, idempotencyKey) {
    let headers = {
        ...config.headers,
        Authorization: authHeader,
        'Cache-Control': 'no-cache',
        pragma: 'no-cache',
        'user-agent': `checkout-sdk-node/${pjson.version}`,
    };

    if (request && request.headers) {
        headers = { ...headers, ...request.headers };
    }

    if (!config.formData) {
        headers['Content-Type'] = config.csv ? 'text/csv' : 'application/json';
    } else if (request && typeof request.getHeaders === 'function') {
        headers = { ...headers, ...request.getHeaders() };
    }

    if (idempotencyKey !== undefined) {
        headers['Cko-Idempotency-Key'] = idempotencyKey;
    }

    return headers;
}

function formDataToBuffer(form) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        const sink = new Writable({
            write(chunk, _encoding, callback) {
                chunks.push(chunk);
                callback();
            },
        });
        sink.on('finish', () => resolve(Buffer.concat(chunks)));
        sink.on('error', reject);
        form.on('error', reject);
        form.pipe(sink);
    });
}

function getResponseHeaders(response) {
    const requestId = response.headers.get(REQUEST_ID_HEADER) || response.headers.get('request-id');
    const version = response.headers.get(API_VERSION_HEADER) || response.headers.get('version');
    const etag = response.headers.get(ETAG_HEADER);
    return {
        'cko-request-id': requestId || '',
        'cko-version': version || '',
        'etag': etag || '',
    };
}

function getResponseAxiosHeaders(response) {
    // Return CKO response headers when available

    if (REQUEST_ID_HEADER in response.headers) {
        const requestId = response.headers[REQUEST_ID_HEADER] || response.headers['request-id'];
        const version = response.headers[API_VERSION_HEADER] || response.headers.version;
        const etag = response.headers[ETAG_HEADER];
        return {
            'cko-request-id': requestId ? requestId[0] : '',
            'cko-version': version ? version[0] : '',
            'etag': etag ? etag[0] : '',
        };
    }

    return {};
}

function buildAxiosResponse(config, response) {
    if (config.csv) {
        return {
            status: response.status,
            csv: Buffer.from(response.data),
        };
    }
    return {
        status: response.status,
        json: response.data,
        headers: getResponseAxiosHeaders(response),
    };
}

// For 'no body' response, replace with empty object
const bodyParser = (rsp) => rsp.text().then((text) => {
    if (!text) return {};
    try {
        return JSON.parse(text);
    } catch (err) {
        // If parsing fails, return the raw text for debugging
        return { _raw: text, _parseError: err.message };
    }
});

// Refresh the access token this long before it expires
const TOKEN_REFRESH_MARGIN_MS = 60 * 1000;

const isTokenExpired = (tokenExpiry, currentTimestamp) =>
    !(tokenExpiry instanceof Date) ||
    Number.isNaN(tokenExpiry.getTime()) ||
    tokenExpiry.getTime() - TOKEN_REFRESH_MARGIN_MS < currentTimestamp;

/**
 * Store an access token response in the config. The access object is updated in place, so
 * every copy of the config made for a single request shares the same token.
 *
 * @param {Object} config SDK configuration.
 * @param {Object} body Access token response: access_token, token_type, scope and
 *   expires_in (lifetime in seconds).
 * @return {void}
 */
export const storeAccessToken = (config, body) => {
    if (!config.access) {
        config.access = {};
    }
    Object.assign(config.access, {
        token: body.access_token,
        type: body.token_type,
        scope: body.scope,
        expires: new Date(Date.now() + body.expires_in * 1000),
    });
};

const isRedirect = (status) => status >= 300 && status < 400;

// Statuses returned as a response: the ones the application's axios default accepts (axios
// accepts every status when it has none), never a 3xx.
const acceptStatus = (status) => {
    if (isRedirect(status)) {
        return false;
    }
    const { validateStatus } = axios.defaults;
    return typeof validateStatus === 'function' ? validateStatus(status) : true;
};

// axios options of every SDK request: redirects are not followed (see acceptStatus).
const AXIOS_RESPONSE_POLICY = {
    maxRedirects: 0,
    validateStatus: acceptStatus,
};

// The OAuth token request and the file request accept a 2xx only: any other status is an error,
// whatever the application's axios default.
const AXIOS_SUCCESS_ONLY_POLICY = {
    ...AXIOS_RESPONSE_POLICY,
    validateStatus: (status) => status >= 200 && status < 300,
};

// Body of the errors of the response policy: the status, and the request id when the API sent one.
const statusOnlyBody = (status, requestId) => (requestId ? { status, request_id: requestId } : { status });

const requestIdOf = (headers) => {
    const get = (name) => (typeof headers?.get === 'function' ? headers.get(name) : headers?.[name]);
    const value = get(REQUEST_ID_HEADER) || get('request-id');
    return Array.isArray(value) ? value[0] : value || undefined;
};

// A 3xx response: an ApiError with the status only.
const redirectStatusError = (status, requestId) => new ApiError(status, statusOnlyBody(status, requestId));

// A 3xx response to the token request: an AuthenticationError with the status only.
const tokenRedirectError = (status) => new AuthenticationError({ status }, 'Unexpected token response status');

// The body of a response that is not used is discarded, so fetch releases the connection.
const discardBody = async (response) => {
    try {
        await response.body?.cancel();
    } catch {
        // nothing to release
    }
};

// The SDK error determineError gives for an error status.
const statusError = (status, json) => determineError({ status, json: json ?? {} });

// The client's error without the request it was sending (axios errors keep the request config,
// body and headers included): name, message and code, and the same for its own cause.
const clientErrorCause = (error, depth = 0) => {
    const cause = new Error(error?.message);
    cause.name = error?.name ?? 'Error';
    // fetch reports the network code on its own cause: it is kept at the top too.
    const code = error?.code ?? error?.cause?.code;
    if (code !== undefined) {
        cause.code = code;
    }
    if (depth < 1 && error?.cause instanceof Error) {
        cause.cause = clientErrorCause(error.cause, depth + 1);
    }
    return cause;
};

// No HTTP response: ApiError without http_code, `body` as its body and the client's error as cause.
const connectionError = (body, error) => {
    const err = new ApiError(undefined, body);
    Object.defineProperty(err, 'cause', {
        value: clientErrorCause(error),
        writable: true,
        configurable: true,
        enumerable: false,
    });
    return err;
};

// The URL of a request without its user information. A URL that is not an http(s) URL the WHATWG
// parser accepts is cut after its last '@', so nothing written before it is repeated.
const withoutUserinfo = (url) => {
    const text = String(url);
    try {
        const parsed = new URL(text);
        if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
            if (!parsed.username && !parsed.password) {
                return text;
            }
            parsed.username = '';
            parsed.password = '';
            return parsed.href;
        }
    } catch {
        // not a URL: handled below
    }
    const at = text.lastIndexOf('@');
    return at === -1 ? text : text.slice(at + 1);
};

const connectionReason = (url, error) => `request to ${withoutUserinfo(url)} failed, reason: ${error.message}`;

// Input validation: when fetch cannot build a request (a header value or URL it rejects) it throws
// a TypeError that names the input; that error is replaced by a fixed one. Its network failures
// ('fetch failed') and any other error keep their message.
const fetchFailure = (error) =>
    error instanceof TypeError && error.message !== 'fetch failed'
        ? new TypeError('the request could not be built')
        : error;

const isTimeout = (error) =>
    error.code === 'ECONNABORTED' || error.name === 'AbortError' || error.message?.includes('timeout');

const isLoopbackHost = (hostname) =>
    hostname === 'localhost' || hostname === '[::1]' || /^127(\.\d{1,3}){3}$/.test(hostname);

// The file location of a report download: https, or http for a loopback host (local tests).
const fileDownloadUrl = (location, base) => {
    let url;
    try {
        url = new URL(location, base);
    } catch {
        return undefined;
    }
    if (url.protocol !== 'https:' && !(url.protocol === 'http:' && isLoopbackHost(url.hostname))) {
        return undefined;
    }
    url.username = '';
    url.password = '';
    return url.href;
};

// Headers never sent to the file location (the HTTP clients also drop the first three when they
// follow a response to another host).
const FILE_DOWNLOAD_DROPPED_HEADERS = ['authorization', 'proxy-authorization', 'cookie', 'referer'];

// Headers of the file request: the API request headers without the ones above and the SDK's Cko-
// headers.
const isDroppedFileHeader = (name) => {
    const lower = name.toLowerCase();
    return FILE_DOWNLOAD_DROPPED_HEADERS.includes(lower) || lower.startsWith('cko-');
};

const fileDownloadHeaders = (headers) =>
    Object.fromEntries(Object.entries(headers).filter(([name, value]) => value != null && !isDroppedFileHeader(name)));

// axios adds the application's default headers and auth after the request headers are set: the
// same headers are removed from the merged headers of the file request, and auth is not used.
const dropFileHeaderDefaults = (data, headers) => {
    Object.keys(headers.toJSON()).filter(isDroppedFileHeader).forEach((name) => headers.delete(name));
    return data;
};

const followsFileDownload = (config, method, status) => config.fileDownload === true && method === 'GET' && status === 302;

// The only redirect followed: one 302 of a report file download, as a GET without a body (see
// fileDownloadUrl and fileDownloadHeaders). Its own 3xx is not followed; an error status keeps
// the SDK error type with the status only. Errors name the API request, not the file location.
const downloadFile = async (httpClient, config, path, location, headers, requestId) => {
    const url = location ? fileDownloadUrl(location, path) : undefined;
    if (!url) {
        throw redirectStatusError(302, requestId);
    }
    const fileHeaders = fileDownloadHeaders(headers);

    if (httpClient === 'axios') {
        let response;
        try {
            response = await axios({
                url,
                method: 'GET',
                headers: fileHeaders,
                auth: null,
                transformRequest: [dropFileHeaderDefaults],
                timeout: config.timeout,
                httpsAgent: config.agent,
                ...AXIOS_SUCCESS_ONLY_POLICY,
            });
        } catch (error) {
            if (isTimeout(error)) {
                throw new ApiTimeout();
            }
            if (error.response) {
                const { status } = error.response;
                throw isRedirect(status)
                    ? redirectStatusError(status, requestId)
                    : await statusError(status, statusOnlyBody(status, requestId));
            }
            throw connectionError(connectionReason(path, error), error);
        }
        return buildAxiosResponse(config, response);
    }

    const fetchOptions = { method: 'GET', headers: fileHeaders, redirect: 'manual' };
    if (typeof config.agent !== 'undefined') {
        fetchOptions.agent = config.agent;
    }
    let response;
    try {
        response = await fetch(url, fetchOptions);
    } catch (error) {
        if (isTimeout(error)) {
            throw new ApiTimeout();
        }
        const failure = fetchFailure(error);
        throw connectionError(connectionReason(path, failure), failure);
    }
    if (isRedirect(response.status)) {
        await discardBody(response);
        throw redirectStatusError(response.status, requestId);
    }
    if (!response.ok) {
        await discardBody(response);
        throw await statusError(response.status, statusOnlyBody(response.status, requestId));
    }
    return buildResponse(config, response);
};

/**
 * Request an OAuth access token, with the SDK's response policy.
 *
 * @param {Object} config SDK configuration.
 * @param {string} httpClient 'axios', or anything else for fetch.
 * @param {Object} [body] Token request body; client credentials from the config by default.
 * @return {Promise<Object>} status and json of the token response.
 * @throws {AuthenticationError} On an unexpected response status (body `{ status }`), a 401 or a
 *   400 OAuth error.
 * @throws {ApiTimeout} When the axios client times out.
 * @throws {Error} On any other error status, the SDK error of that status (as determineError);
 *   without a response, an ApiError without http_code and with the client's error as cause.
 */
export const createAccessToken = async (config, httpClient, body) => {
    const requestBody = body || {
        grant_type: 'client_credentials',
        client_id: config.client,
        client_secret: config.secret,
        scope: config.scope.join(' '),
    };

    // Use environmentSubdomain if exists, otherwise use environment
    let accessUrl;
    if (config.environmentSubdomain) {
        accessUrl = config.environmentSubdomain.getOAuthAuthorizationApi();
    } else {
        accessUrl = config.environment.getOAuthAuthorizationApi();
    }

    let access;

    switch (httpClient) {
        case 'axios':
            try {
                access = await axios({
                    url: accessUrl,
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Accept: 'application/json',
                    },
                    data: new URLSearchParams(requestBody),
                    timeout: config.timeout,
                    httpsAgent: config.agent,
                    ...AXIOS_SUCCESS_ONLY_POLICY,
                });
            } catch (error) {
                if (isTimeout(error)) {
                    throw new ApiTimeout();
                }
                if (error.response) {
                    const { status, data } = error.response;
                    throw isRedirect(status) ? tokenRedirectError(status) : await statusError(status, data);
                }
                throw connectionError(connectionReason(accessUrl, error), error);
            }
            return {
                status: access.status,
                json: access.data,
            };

        default:
            try {
                access = await fetch(
                    accessUrl,
                    {
                        method: 'POST',
                        timeout: config.timeout,
                        agent: config.agent,
                        redirect: 'manual',
                        body: new URLSearchParams(requestBody),
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                            Accept: 'application/json',
                        },
                    }
                );
            } catch (error) {
                if (isTimeout(error)) {
                    throw new ApiTimeout();
                }
                // Same body as before for this client: the client's message.
                const failure = fetchFailure(error);
                throw connectionError(failure.message, failure);
            }
            if (isRedirect(access.status)) {
                await discardBody(access);
                throw tokenRedirectError(access.status);
            }
            if (!access.ok) {
                const json = await bodyParser(access);
                throw await statusError(access.status, json);
            }

            return access.text().then((text) => {
                const data = text ? JSON.parse(text) : {};
                return {
                    status: access.status,
                    json: data,
                };
            });
    }
};

 
const httpRequest = async (httpClient, verb, path, config, auth, request, idempotencyKey) => {
    // fetch only normalises the case of DELETE, GET, HEAD, OPTIONS, POST and PUT, so a
    // lowercase "patch" goes out as-is and the API answers 400. Send every verb uppercase.
    const method = String(verb).toUpperCase();
    let authHeader = null;

    if (auth) {
        authHeader = auth;
    } else if (config.client) {
        // TODO Refactor OAuth credentials request

        // For NAS
        // If an access tokens exists, and it's not expired re-use it
        if (config.access?.token && !isTokenExpired(config.access.expires, Date.now())) {
            authHeader = `${config.access.type} ${config.access.token}`;
        } else {
            const access = await createAccessToken(config, httpClient);
            authHeader = `${access.json.token_type} ${access.json.access_token}`;

            storeAccessToken(config, access.json);
        }
    }

    const headers = getRequestHeaders(config, request, authHeader, idempotencyKey);

    let response;

    switch (httpClient) {
        case 'axios':
            try {
                response = await axios({
                    url: path,
                    method,
                    headers,
                    data: config.formData ? request : JSON.stringify(request),
                    timeout: config.timeout,
                    httpsAgent: config.agent,
                    ...AXIOS_RESPONSE_POLICY,
                });
                return buildAxiosResponse(config, response);
            } catch (error) {
                if (isTimeout(error)) {
                    throw new ApiTimeout();
                }
                if (error.response) {
                    const { status, headers: responseHeaders } = error.response;
                    if (isRedirect(status)) {
                        const requestId = requestIdOf(responseHeaders);
                        if (followsFileDownload(config, method, status)) {
                            return downloadFile(httpClient, config, path, responseHeaders?.location, headers, requestId);
                        }
                        throw redirectStatusError(status, requestId);
                    }
                    throw {
                        status,
                        json: error.response.data,
                    };
                }
                throw connectionError(connectionReason(path, error), error);
            }

        default:
            let body;
            if (config.formData && request && typeof request.getHeaders === 'function') {
                body = await formDataToBuffer(request);
            } else {
                body = config.formData ? request : JSON.stringify(request);
            }
            const fetchOptions = {
                method,
                body,
                headers,
                redirect: 'manual',
            };
            if (typeof config.agent !== 'undefined') {
                fetchOptions.agent = config.agent;
            }
            try {
                response = await fetch(path, fetchOptions);
            } catch (error) {
                if (isTimeout(error)) {
                    throw new ApiTimeout();
                }
                const failure = fetchFailure(error);
                throw connectionError(connectionReason(path, failure), failure);
            }

            if (isRedirect(response.status)) {
                const requestId = requestIdOf(response.headers);
                const location = response.headers.get('location');
                await discardBody(response);
                if (followsFileDownload(config, method, response.status)) {
                    return downloadFile(httpClient, config, path, location, headers, requestId);
                }
                throw redirectStatusError(response.status, requestId);
            }
            if (!response.ok) {
                const json = await bodyParser(response);
                throw { status: response.status, json };
            }

            return buildResponse(config, response);
    }
};

export const get = async (httpClient, path, config, auth) =>
    httpRequest(httpClient, 'get', path, config, auth);

export const post = async (httpClient, path, config, auth, request, idempotencyKey) =>
    httpRequest(httpClient, 'post', path, config, auth, request, idempotencyKey);

export const patch = async (httpClient, path, config, auth, request) =>
    httpRequest(httpClient, 'patch', path, config, auth, request);

export const put = async (httpClient, path, config, auth, request) =>
    httpRequest(httpClient, 'put', path, config, auth, request);

export const _delete = async (httpClient, path, config, auth) =>
    httpRequest(httpClient, 'delete', path, config, auth);

export default createAccessToken;
