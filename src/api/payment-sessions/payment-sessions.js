import { determineError } from '../../services/errors.js';
import { post } from '../../services/http.js';
import { validatePayment } from '../../services/validation.js';

/**
 * Class dealing with the /payment-sessions endpoint
 *
 * @export
 * @class PaymentSessions
 */
export default class PaymentSessions {
    constructor(config) {
        this.config = config;
    }

    /**
     * Creates a payment session.
     *
     * @memberof PaymentSessions
     * @param {object} body PaymentSessions Request body.
     * @return {Promise<object>} A promise to payment context response.
     */
    async request(body) {
        try {
            validatePayment(body);

            const response = await post(
                this.config.httpClient,
                `${this.config.host}/payment-sessions`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }

    /**
     * Submit a payment attempt for a payment session.
     *
     * @memberof PaymentSessions
     * @param {string} id The payment session ID.
     * @param {object} body PaymentSessions Request body.
     * @return {Promise<object>} A promise to payment context response.
     */
    async submit(id, body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/payment-sessions/${id}/submit`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }

    /**
     * Request a Payment Session with Payment.
     * Create a payment session and submit a payment attempt for it.
     *
     * @memberof PaymentSessions
     * @param {object} body PaymentSessions Request body.
     * @return {Promise<object>} A promise to payment response (201 processed or 202 action required).
     */
    async complete(body) {
        try {
            validatePayment(body);

            const response = await post(
                this.config.httpClient,
                `${this.config.host}/payment-sessions/complete`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }
}
