import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import http from '../../services/http';

/**
 * Class dealing with the forex api
 *
 * @export
 * @class Forex
 */
export default class Forex {
    constructor(config) {
        this.config = config;
    }

    /**
     * Request an exchange rate between a source and destination currency
     *
     * @param {Object} body Forex object body.
     * @return {Promise<Object>} A promise to the Forex response.
     */
    async request(body) {
        try {
            const response = await http(fetch, this.config, {
                method: 'post',
                url: `${this.config.host}/forex/quotes`,
                body,
                headers: { Authorization: this.config.sk },
            });
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
