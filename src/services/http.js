/* eslint-disable no-throw-literal */

import {
    API_VERSION_HEADER,
    REQUEST_ID_HEADER,
    SANDBOX_ACCESS_URL,
    LIVE_ACCESS_URL,
} from '../config';

const pjson = require('../../package.json');

const http = async (fetch, config, request) => {
    let authHeader = null;

    // If the endpoint is called with the PK, use it in the auth header
    if (
        request.headers &&
        request.headers.Authorization &&
        request.headers.Authorization.startsWith('pk')
    ) {
        authHeader = request.headers.Authorization;
    } else if (config.client) {
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
    } else {
        // For MBC
        authHeader = request.headers.Authorization;
    }

    const headers = {
        ...config.headers,
        ...request.headers,
        Authorization: authHeader,
        'Content-Type': config.csv ? 'text/csv' : 'application/json',
        'Cache-Control': 'no-cache',
        pragma: 'no-cache',
        'user-agent': `checkout-sdk-node/${pjson.version}`,
    };

    if (config.formData) {
        delete headers['Content-Type'];
    }

    const response = await fetch(request.url, {
        method: request.method,
        timeout: config.timeout,
        agent: config.agent,
        body: config.formData ? request.body : JSON.stringify(request.body),
        headers,
    });

    if (response.ok && config.csv) {
        const txt = await response.text();

        const csv = Buffer.from(txt);

        return {
            status: response.status,
            csv,
        };
    }

    if (!response.ok) {
        const json = bodyParser(response);
        throw { status: response.status, json };
    }

    return response.text().then((text) => {
        const data = text ? JSON.parse(text) : {};

        // Return CKO response headers when available

        if (REQUEST_ID_HEADER in response.headers.raw()) {
            const requestId =
                response.headers.raw()[REQUEST_ID_HEADER] || response.headers.raw()['request-id'];
            const version =
                response.headers.raw()[API_VERSION_HEADER] || response.headers.raw().version;

            return {
                status: response.status,
                json: data,
                headers: {
                    'cko-request-id': requestId[0],
                    'cko-version': version[0],
                },
            };
        }

        return {
            status: response.status,
            json: data,
        };
    });
};

// For 'no body' response, replace with empty object
const bodyParser = (rsp) => rsp.text().then((text) => (text ? JSON.parse(text) : {}));

const isTokenExpired = (tokenExpiry, currentTimestamp) => tokenExpiry < currentTimestamp;

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

export default http;
