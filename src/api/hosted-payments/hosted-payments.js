import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';

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
     * Create a Hosted Payments Page session
     *
     * @memberof HostedPayments
     * @param {Object} body - Hosted Payments Page session request body
     * @return {Promise<Object>} A promise to the Hosted Payment response.
     */
    async create(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/hosted-payments`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Get Hosted Payments Page details
     *
     * @memberof HostedPayments
     * @param {string} id - Hosted payment id
     * @return {Promise<Object>} A promise to the Hosted Payment response.
     */
    async get(id) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/hosted-payments/${id}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
