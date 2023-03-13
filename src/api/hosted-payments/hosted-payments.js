import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import { get, post } from '../../services/http';

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
            const response = await post(
                fetch,
                `${this.config.host}/hosted-payments`,
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

    /**
     * Returns details of an instrument
     *
     * @memberof HostedPayments
     * @param {string} id Hosted payment id.
     * @return {Promise<Object>} A promise to the Hosted Payment response.
     */
    async get(id) {
        try {
            const response = await get(
                fetch,
                `${this.config.host}/hosted-payments/${id}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
