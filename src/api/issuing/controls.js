import { _delete, get, post, put } from '../../services/http.js';
import { determineError } from '../../services/errors.js';
import { buildQueryParams } from '../../services/utils.js';

/**
 * Controls class for managing card control operations
 *
 * @export
 * @class Controls
 */
export default class Controls {
    constructor(config) {
        this.config = config;
    }

    /**
     * Creates a card control and applies it to the specified card.
     *
     * @memberof Controls
     * @param {Object} body Card control params.
     * @return {Promise<Object>} A promise to the card response.
     */
    async createCardControl(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/issuing/controls`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Retrieves a list of spending controls applied to the specified card.
     *
     * @memberof Controls
     * @param {Object} params Card control params.
     * @return {Promise<Object>} A promise to the card response.
     */
    async getCardControls(params) {
        try {
            const url = buildQueryParams(`${this.config.host}/issuing/controls`, params);

            const response = await get(this.config.httpClient, url, this.config, this.config.sk);
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Retrieves the details of a card control you created previously.
     *
     * @memberof Controls
     * @param {string} id Card control id.
     * @return {Promise<Object>} A promise to the card response.
     */
    async getCardControlDetails(id) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/issuing/controls/${id}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Updates an existing card control.
     *
     * @memberof Controls
     * @param {string} id Card control id.
     * @param {Object} body Card control params.
     * @return {Promise<Object>} A promise to the card response.
     */
    async updateCardControl(id, body) {
        try {
            const response = await put(
                this.config.httpClient,
                `${this.config.host}/issuing/controls/${id}`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Removes an existing card control from the card it was applied to.
     *
     * @memberof Controls
     * @param {string} id Card control id.
     * @return {Promise<Object>} A promise to the card response.
     */
    async deleteCardControl(id) {
        try {
            const response = await _delete(
                this.config.httpClient,
                `${this.config.host}/issuing/controls/${id}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
