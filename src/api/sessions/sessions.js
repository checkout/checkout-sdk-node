import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import http from '../../services/http';
/**
 * Class dealing with the /sessions endpoint
 *
 * @export
 * @class Sessions
 */
export default class Sessions {
    constructor(config) {
        this.config = config;
    }

    /**
     * @memberof Sessions
     * @param {Object} body Sessions request body.
     * @return {Promise<Object>} A promise to the sessions response.
     */
    async request(body) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout },
                {
                    method: 'post',
                    url: `${this.config.host}/sessions`,
                    headers: { Authorization: this.config.sk },
                    body
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * @memberof Sessions
     * @param {String} sessionId Session id.
     * @return {Promise<Object>} A promise to the sessions response.
     */
    async get(sessionId) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout },
                {
                    method: 'get',
                    url: `${this.config.host}/sessions/${sessionId}`,
                    headers: { Authorization: this.config.sk }
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * @memberof Sessions
     * @param {String} sessionId Session id.
     * @param {Object} body Sessions request body.
     * @return {Promise<Object>} A promise to the sessions response.
     */
    async submitChannelData(sessionId, body) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout },
                {
                    method: 'put',
                    url: `${this.config.host}/sessions/${sessionId}/channel-data`,
                    headers: { Authorization: this.config.sk },
                    body
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * @memberof Sessions
     * @param {String} sessionId Session id.
     * @return {Promise<Object>} A promise to the sessions response.
     */
    async complete(sessionId) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout },
                {
                    method: 'put',
                    url: `${this.config.host}/sessions/${sessionId}/complete`,
                    headers: { Authorization: this.config.sk }
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
