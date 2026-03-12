import { determineError } from '../../services/errors.js';
import { get } from '../../services/http.js';

/**
 * Class dealing with the /payment-methods endpoint
 *
 * @export
 * @class PaymentMethods
 */
export default class PaymentMethods {
    constructor(config) {
        this.config = config;
    }

    /**
     * Get available payment methods
     * [BETA]
     * Get a list of all available payment methods for a specific Processing Channel ID.
     * @memberof PaymentMethods
     * @param {string} processing_channel_id - The processing channel to be used for payment methods retrieval.
     * @returns {Promise<Object>} A promise to the Get available payment methods response
     */
    async getPaymentMethods(processing_channel_id) {
        try {
            const url = `${this.config.host}/payment-methods?processing_channel_id=${processing_channel_id}`;
            const response = await get(
                this.config.httpClient,
                url,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }
}
