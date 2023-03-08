import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import { post } from '../../services/http';

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
            const response = await post(
                fetch,
                `${this.config.host}/forex/quotes`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
