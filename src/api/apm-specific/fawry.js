import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import http from '../../services/http';

/**
 * Class dealing with the /fawry endpoint
 *
 * @export
 * @class Fawry
 */
export default class Fawry {
    constructor(config) {
        this.config = config;
    }

    /**
     * Approve Fawry payment
     *
     * @param {string} reference Reference.
     * @memberof Fawry
     * @return {Promise<Object>} A promise to the Fawry response.
     */
    async approve(reference) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'put',
                    url: `${this.config.host}/fawry/payments/${reference}/approval`,
                    headers: { Authorization: this.config.sk },
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Cancel Fawry payment
     *
     * @param {string} reference Reference.
     * @memberof Fawry
     * @return {Promise<Object>} A promise to the Fawry response.
     */
    async cancel(reference) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'put',
                    url: `${this.config.host}/fawry/payments/${reference}/cancellation`,
                    headers: { Authorization: this.config.sk },
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
