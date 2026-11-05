import { get } from '../../services/http.js';
import { determineError } from '../../services/errors.js';
import { encodePathSegment } from '../../services/utils.js';

// Path segments appended to the API base (config.host).
const DIGITAL_CARDS_PATH = 'digital-cards';
const ISSUING_PATH = 'issuing';

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
     * @throws {ValueError} If digitalCardId is undefined, empty, "." or "..".
     */
    async getDigitalCard(digitalCardId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/${ISSUING_PATH}/${DIGITAL_CARDS_PATH}/${encodePathSegment(digitalCardId, 'digitalCardId')}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
