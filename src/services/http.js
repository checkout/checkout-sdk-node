/* eslint-disable no-throw-literal */

import {
    API_VERSION_HEADER,
    REQUEST_ID_HEADER,
    SANDBOX_ACCESS_URL,
    LIVE_ACCESS_URL,
} from '../config';

const pjson = require('../../package.json');

export const get = async (fetch, path, config, auth) => http(fetch, 'get', path, config, auth);

export const post = async (fetch, path, config, auth, request, idempotencyKey) =>
    http(fetch, 'post', path, config, auth, request, idempotencyKey);

export const patch = async (fetch, path, config, auth, request) =>
    http(fetch, 'patch', path, config, auth, request);

export const put = async (fetch, path, config, auth, request) =>
    http(fetch, 'put', path, config, auth, request);

export const _delete = async (fetch, path, config, auth) =>
    http(fetch, 'delete', path, config, auth);

export const createAccessToken = async (config, fetch, body) => {
    const requestBody = body || {
        grant_type: 'client_credentials',
        client_id: config.client,
        client_secret: config.secret,
        scope: config.scope.join(' '),
    };

    const access = await fetch(
        config.host.includes('sandbox') ? SANDBOX_ACCESS_URL : LIVE_ACCESS_URL,
        {
            method: 'post',
            timeout: config.timeout,
            agent: config.agent,
            body: new URLSearchParams(requestBody),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json',
            },
        }
    );

    if (!access.ok) {
        const json = bodyParser(access);
        throw { status: access.status, json };
    }

    return access.text().then((text) => {
        const data = text ? JSON.parse(text) : {};
        return {
            status: access.status,
            json: data,
        };
    });
};

// eslint-disable-next-line consistent-return,default-param-last
const http = async (fetch, method, path, config, auth, request, idempotencyKey) => {
    let authHeader = null;

    if (auth) {
        authHeader = auth;
    } else if (config.client) {
        // TODO Refactor OAuth credentials request

        // For NAS
        // If an access tokens exists and it's not expired re-use it
        if (config.access && !isTokenExpired(config.access.expires, new Date())) {
            authHeader = `${config.access.type} ${config.access.token}`;
        } else {
            const access = await createAccessToken(config, fetch);
            authHeader = `${access.json.token_type} ${access.json.access_token}`;

            // eslint-disable-next-line no-param-reassign
            config.access = {
                token: access.json.access_token,
                type: access.json.token_type,
                scope: access.json.scope,
                expires: new Date(new Date().getTime() + access.json.expires_in),
            };
        }
    }

    const headers = getRequestHeaders(config, request, authHeader, idempotencyKey);

    const response = await fetch(path, {
        method,
        timeout: config.timeout,
        agent: config.agent,
        body: config.formData ? request : JSON.stringify(request),
        headers,
    });

    if (!response.ok) {
        const json = bodyParser(response);
        throw { status: response.status, json };
    }

    return buildResponse(config, response);
};

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
        const data = text ? JSON.parse(text) : {};
        const headers = getResponseHeaders(response);

        return {
            status: response.status,
            json: data,
            headers,
        };
    });
}

function getRequestHeaders(config, request, authHeader, idempotencyKey) {
    let headers;

    // eslint-disable-next-line prefer-const
    headers = {
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
    }

    if (idempotencyKey !== undefined) {
        headers['Cko-Idempotency-Key'] = idempotencyKey;
    }

    return headers;
}

function getResponseHeaders(response) {
    // Return CKO response headers when available

    if (REQUEST_ID_HEADER in response.headers.raw()) {
        const requestId =
            response.headers.raw()[REQUEST_ID_HEADER] || response.headers.raw()['request-id'];
        const version =
            response.headers.raw()[API_VERSION_HEADER] || response.headers.raw().version;
        return {
            'cko-request-id': requestId ? requestId[0] : '',
            'cko-version': version ? version[0] : '',
        };
    }

    return {};
}

// For 'no body' response, replace with empty object
const bodyParser = (rsp) => rsp.text().then((text) => (text ? JSON.parse(text) : {}));

const isTokenExpired = (tokenExpiry, currentTimestamp) => tokenExpiry < currentTimestamp;

export default createAccessToken;
