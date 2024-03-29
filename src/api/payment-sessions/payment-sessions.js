import { determineError } from '../../services/errors';
import { post } from '../../services/http';
import { validatePayment } from '../../services/validation';

/*
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
     * Sends payment sessions requests.
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
}
