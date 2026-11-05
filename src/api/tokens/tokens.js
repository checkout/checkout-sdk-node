import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';
import { setTokenType } from '../../services/validation.js';
import { encodePathSegment } from '../../services/utils.js';

// Path segments appended to the API base (config.host).
const METADATA_PATH = 'metadata';
const TOKENS_PATH = 'tokens';

/**
 * Class dealing with the /tokens endpoint
 *
 * @export
 * @class Tokens
 */
export default class Tokens {
    constructor(config) {
        this.config = config;
    }

    /**
     * Exchange card details or a digital wallet payment token for a reference token
     * that can be used later to request a card payment.
     *
     * @memberof Tokens
     * @param {Object} body Token request body.
     * @return {Promise<Object>} A promise to the request token response.
     */
    async request(body) {
        setTokenType(body);
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/${TOKENS_PATH}`,
                this.config,
                this.config.pk,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Retrieve metadata for a token (e.g., billing address captured at tokenisation).
     *
     * @memberof Tokens
     * @param {string} tokenId The token id (e.g., "tok_...").
     * @return {Promise<Object>} A promise to the token metadata response.
     * @throws {ValueError} If tokenId is undefined, empty, "." or "..".
     */
    async getTokenMetadata(tokenId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/${TOKENS_PATH}/${encodePathSegment(tokenId, 'tokenId')}/${METADATA_PATH}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
