import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';

/**
 * Class dealing with the /transfers endpoint
 *
 * @export
 * @class Transfers
 */
export default class Transfers {
    constructor(config) {
        this.config = config;
    }

    /**
     * Initiate a transfer of funds from source entity to destination entity.
     *
     * @memberof Transfers
     * @param {Object} body Transfers request body.
     * @param {string} [idempotencyKey] Idempotency Key.
     * @return {Promise<Object>} A promise to the request transfers response.
     */
    async initiate(body, idempotencyKey) {
        try {
            const url = this.config.transfersUrl;

            const response = await post(
                this.config.httpClient,
                url,
                this.config,
                this.config.sk,
                body,
                idempotencyKey
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Retrieve transfer details using the transfer identifier.
     *
     * @memberof Transfers
     * @param {string} id tra_XXX The transfer identifier.
     * @return {Promise<Object>} A promise to the transfer response.
     */
    async retrieve(id) {
        try {
            const url = `${this.config.transfersUrl}/${id}`;

            const response = await get(
                this.config.httpClient,
                url,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
