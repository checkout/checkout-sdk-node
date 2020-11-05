import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import http from '../../services/http';

/**
 * Class dealing with the /hosted-payments endpoint
 *
 * @export
 * @class HostedPayments
 */
export default class HostedPayments {
    constructor(config) {
        this.config = config;
    }

    /**
     * Update details of a customer
     *
     * @memberof HostedPayments
     * @param {Object} body
     * @return {Promise<Object>} A promise to the Hosted Payment response.
     */
    async create(body) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'post',
                    url: `${this.config.host}/hosted-payments`,
                    headers: { Authorization: this.config.sk },
                    body,
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
