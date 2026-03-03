import { get } from '../../services/http.js';
import { determineError } from '../../services/errors.js';

/**
 * DigitalCards class for managing digital card operations
 *
 * @export
 * @class DigitalCards
 */
export default class DigitalCards {
    constructor(config) {
        this.config = config;
    }

    /**
     * Get digital card details.
     * Retrieves the details for a digital card.
     *
     * @memberof DigitalCards
     * @param {string} digitalCardId The digital card ID.
     * @return {Promise<Object>} A promise to the digital card details.
     */
    async getDigitalCard(digitalCardId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/issuing/digital-cards/${digitalCardId}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
