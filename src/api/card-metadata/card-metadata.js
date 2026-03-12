import { determineError } from '../../services/errors.js';
import { post } from '../../services/http.js';

/**
 * Class dealing with the /metadata/card endpoint
 *
 * @export
 * @class CardMetadata
 */
export default class CardMetadata {
    constructor(config) {
        this.config = config;
    }

    /**
     * Returns a single metadata record for the card specified by the Primary Account Number (PAN),
     * Bank Identification Number (BIN), token, or instrument supplied.
     *
     * @memberof CardMetadata
     * @param {Object} body Card Metadata request body.
     * @return {Promise<Object>} A promise to the Card Metadata response.
     */
    async get(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/metadata/card`,
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
