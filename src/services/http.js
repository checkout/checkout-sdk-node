/* eslint-disable no-throw-literal */
import { API_VERSION_HEADER, REQUEST_ID_HEADER } from '../config';

const pjson = require('../../package.json');

const http = async (fetch, config, request) => {
    const headers = {
        ...request.headers,
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

    // For 'no body' response, replace with empty object
    const bodyParser = (rsp) => {
        return rsp.text().then((text) => {
            return text ? JSON.parse(text) : {};
        });
    };

    if (!response.ok) {
        const json = bodyParser(response);
        throw { status: response.status, json };
    }

    return response.text().then((text) => {
        const data = text ? JSON.parse(text) : {};
        // Return CKO response headers when available
        if (REQUEST_ID_HEADER in response.headers.raw()) {
            return {
                status: response.status,
                json: data,
                headers: {
                    'cko-request-id': response.headers.raw()[REQUEST_ID_HEADER][0],
                    'cko-version': response.headers.raw()[API_VERSION_HEADER][0],
                },
            };
        }
        return {
            status: response.status,
            json: data,
        };
    });
};
export default http;
