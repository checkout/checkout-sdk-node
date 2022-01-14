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
            const response = await http(fetch, this.config, {
                method: 'post',
                url: `${this.config.host}/hosted-payments`,
                headers: { Authorization: this.config.sk },
                body,
            });
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Retrieve details about a specific Hosted Payment session using its ID returned when the link was created. In the response, you will see the status of the Hosted Payment session.
     *
     * @memberof HostedPayments
     * @param {string} id
     * @return {Promise<Object>} A promise to the Hosted Payment response.
     */
    async get(id) {
        try {
            const response = await http(fetch, this.config, {
                method: 'get',
                url: `${this.config.host}/hosted-payments/${id}`,
                headers: { Authorization: this.config.sk },
            });
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
