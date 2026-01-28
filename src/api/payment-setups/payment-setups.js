import { determineError } from '../../services/errors.js';
import { get, post, put } from '../../services/http.js';
import { validatePayment } from '../../services/validation.js';

/**
 * Class dealing with the /payment-setups endpoint
 *
 * @export
 * @class PaymentSetups
 */
export default class PaymentSetups {
    constructor(config) {
        this.config = config;
    }

    /**
     * Create a Payment Setup
     * [BETA]
     * Creates a Payment Setup.
     * To maximize the amount of information the payment setup can use, we recommend that you create a payment setup as early
     * as possible in the customer's journey. For example, the first time they land on the basket page.
     * @method createAPaymentSetup
     * @param {Object} body - Request body
     * @returns {Promise&lt;Object&gt;} A promise to the Create a Payment Setup response
     */
    async createAPaymentSetup(body) {
        try {
            validatePayment(body);
            const url = `${this.config.host}/payments/setups`;
            const response = await post(
                this.config.httpClient,
                url,
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
     * Update a Payment Setup
     * [BETA]
     * Updates a Payment Setup.
     * You should update the payment setup whenever there are significant changes in the data relevant to the customer's
     * transaction. For example, when the customer makes a change that impacts the total payment amount.
     * @method updateAPaymentSetup
     * @param {string} id - The unique identifier of the Payment Setup to update.
     * @param {Object} body - Request body
     * @returns {Promise&lt;Object&gt;} A promise to the Update a Payment Setup response
     */
    async updateAPaymentSetup(id, body) {
        try {
            validatePayment(body);
            const url = `${this.config.host}/payments/setups/${id}`;
            const response = await put(
                this.config.httpClient,
                url,
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
     * Get a Payment Setup
     * [BETA]
     * Retrieves a Payment Setup.
     * @method getAPaymentSetup
     * @param {string} id - The unique identifier of the Payment Setup to retrieve.
     * @returns {Promise&lt;Object&gt;} A promise to the Get a Payment Setup response
     */
    async getAPaymentSetup(id) {
        try {
            const url = `${this.config.host}/payments/setups/${id}`;
            const response = await get(
                this.config.httpClient,
                url,
                this.config,
                this.config.sk,
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }

     /**
     * Confirm a Payment Setup
     * [BETA]
     * Confirm a Payment Setup to begin processing the payment request with your chosen payment method option.
     * @method confirmAPaymentSetup
     * @param {string} id - The unique identifier of the Payment Setup.
     * @param {string} payment_method_option_id - The unique identifier of the payment option to process the payment with.
     * @returns {Promise&lt;Object&gt;} A promise to the Confirm a Payment Setup response
     */
    async confirmAPaymentSetup(id, payment_method_option_id) {
        try {
            const url = `${this.config.host}/payments/setups/${id}/confirm/${payment_method_option_id}`;
            const response = await post(
                this.config.httpClient,
                url,
                this.config,
                this.config.sk,
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }
}
