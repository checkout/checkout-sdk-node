import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import http from '../../services/http';

/**
 * Class dealing with the /customers endpoint
 *
 * @export
 * @class Customers
 */
export default class Customers {
    constructor(config) {
        this.config = config;
    }

    /**
     * Update details of a customer
     *
     * @memberof Customers
     * @param {string} id Customer id.
     * @param {Object} body Customer object body.
     * @return {Promise<Object>} A promise to the request customer response.
     */
    async update(id, body) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'patch',
                    url: `${this.config.host}/customers/${id}`,
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
