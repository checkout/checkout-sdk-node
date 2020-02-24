/* eslint-disable no-throw-literal */
import { API_VERSION_HEADER, REQUEST_ID_HEADER } from '../config';

const pjson = require('../../package.json');

const http = async (fetch, config, request) => {
    const response = await fetch(request.url, {
        method: request.method,
        timeout: config.timeout,
        body: JSON.stringify(request.body),
        headers: {
            ...request.headers,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            pragma: 'no-cache',
            'user-agent': `checkout-sdk-node/${pjson.version}`
        }
    });

    // For 'no body' response, replace with empty object
    const bodyParser = rsp => {
        return rsp.text().then(text => {
            return text ? JSON.parse(text) : {};
        });
    };

    if (!response.ok) {
        const json = bodyParser(response);
        throw { status: response.status, json };
    }

    return response.json().then(data => {
        // Return CKO response headers when available
        if (REQUEST_ID_HEADER in response.headers.raw()) {
            return {
                status: response.status,
                json: data,
                headers: {
                    'cko-request-id': response.headers.raw()[REQUEST_ID_HEADER][0],
                    'cko-version': response.headers.raw()[API_VERSION_HEADER][0]
                }
            };
        }
        return {
            status: response.status,
            json: data
        };
    });
};
export default http;
