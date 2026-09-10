import { get, patch, post } from '../../services/http.js';
import { determineError } from '../../services/errors.js';

// Path segments appended to the API base (config.host).
const CARDHOLDERS_PATH = 'cardholders';
const CARDS_PATH = 'cards';
const ISSUING_PATH = 'issuing';

/**
 * Cardholders class for managing cardholder operations
 *
 * @export
 * @class Cardholders
 */
export default class Cardholders {
    constructor(config) {
        this.config = config;
    }

    /**
     * Create a new cardholder that you can issue a card to at a later point.
     *
     * @memberof Cardholders
     * @param {Object} body Cardholder params.
     * @return {Promise<Object>} A promise to the cardholder response.
     */
    async createCardholder(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/${ISSUING_PATH}/${CARDHOLDERS_PATH}`,
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
     * Retrieve the details for a cardholder you created previously.
     *
     * @memberof Cardholders
     * @param {string} id Cardholder id.
     * @return {Promise<Object>} A promise to the cardholder details response.
     */
    async getCardholder(id) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/${ISSUING_PATH}/${CARDHOLDERS_PATH}/${id}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Updates the details of an existing cardholder.
     *
     * @memberof Cardholders
     * @param {string} id Cardholder id.
     * @param {Object} body Cardholder params to update.
     * @return {Promise<Object>} A promise to the cardholder update response.
     */
    async updateCardholder(id, body) {
        try {
            const response = await patch(
                this.config.httpClient,
                `${this.config.host}/${ISSUING_PATH}/${CARDHOLDERS_PATH}/${id}`,
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
     * Retrieves the cards issued to the specified cardholder.
     *
     * @memberof Cardholders
     * @param {string} id Cardholder id.
     * @return {Promise<Object>} A promise to the cardholder details response.
     */
    async getCardholderCards(id) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/${ISSUING_PATH}/${CARDHOLDERS_PATH}/${id}/${CARDS_PATH}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
