import { determineError } from '../../services/errors';
import { post } from '../../services/http';
import { validatePayment } from '../../services/validation';

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
}
