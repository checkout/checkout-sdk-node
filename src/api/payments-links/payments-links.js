import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';

/**
 * Class dealing with the /payment-links endpoint
 *
 * @export
 * @class PaymentLinks
 */
export default class PaymentLinks {
    constructor(config) {
        this.config = config;
    }

    /**
     * Create a Payment Link and pass through all the payment information, like the amount, currency, country and reference.
     *
     * @memberof PaymentLinks
     * @param {Object} body
     * @return {Promise<Object>} A promise to the Payment Link response.
     */
    async create(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/payment-links`,
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
     * Retrieve details about a specific Payment Link using its ID returned when the link was created. In the response, you will see the status of the Payment Link.
     *
     * @memberof PaymentLinks
     * @param {string} id
     * @return {Promise<Object>} A promise to the Payment Link response.
     */
    async get(id) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/payment-links/${id}`,
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
