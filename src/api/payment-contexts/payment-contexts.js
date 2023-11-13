import { determineError } from '../../services/errors';
import { get, post } from '../../services/http';
import { validatePayment } from '../../services/validation';

/*
 * Class dealing with the /payment-contexts endpoint
 *
 * @export
 * @class PaymentContexts
 */
export default class PaymentContexts {
    constructor(config) {
        this.config = config;
    }

    /**
     * Sends payment contexts requests.
     *
     * @memberof PaymentContexts
     * @param {object} body PaymentContexts Request body.
     * @param {string} [idempotencyKey] Idempotency Key.
     * @return {Promise<object>} A promise to payment context response.
     */
    async request(body, idempotencyKey) {
        try {
            validatePayment(body);

            const response = await post(
                this.config.httpClient,
                `${this.config.host}/payment-contexts`,
                this.config,
                this.config.sk,
                body,
                idempotencyKey
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }

    /**
     * Returns a payment-context details with the specified identifier string.
     *
     * @memberof PaymentContexts
     * @param {string} id /^(pay|sid)_(\w{26})$/ The payment or payment session identifier.
     * @return {Promise<object>} A promise to the get payment context response.
     */
    async get(id) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/payment-contexts/${id}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }
}
