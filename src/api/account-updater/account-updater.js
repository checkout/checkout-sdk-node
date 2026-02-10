import { post } from '../../services/http.js';
import { determineError } from '../../services/errors.js';

/**
 * Class dealing with the /account-updater API
 *
 * @export
 * @class AccountUpdater
 */
export default class AccountUpdater {
    constructor(config) {
        this.config = config;
    }

    /**
     * Get updated card credentials.
     * Retrieve updated card credentials. The following card schemes are supported: Mastercard, Visa, American Express.
     * The response may include status: CARD_UPDATED, CARD_CLOSED, CARD_EXPIRY_UPDATED, or UPDATE_FAILED.
     *
     * @memberof AccountUpdater
     * @param {Object} body Account updater request params (source_options with card details or instrument ID).
     * @return {Promise<Object>} A promise to the updated card details response.
     */
    async retrieveUpdatedCardDetails(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/account-updater/cards`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
