import fetch from 'node-fetch';
import { get, post } from '../../services/http';
import { determineError } from '../../services/errors';

export default class Issuing {
    constructor(config) {
        this.config = config;
    }

    /**
     * Create a new cardholder that you can issue a card to at a later point.
     *
     * @memberof Issuing
     * @param {Object} body Cardholder params.
     * @return {Promise<Object>} A promise to the cardholder response.
     */
    async createCardholder(body) {
        try {
            const response = await post(
                fetch,
                `${this.config.host}/issuing/cardholders`,
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
     * @memberof Issuing
     * @param {string} id Cardholder id.
     * @return {Promise<Object>} A promise to the cardholder details response.
     */
    async getCardholder(id) {
        try {
            const response = await get(
                fetch,
                `${this.config.host}/issuing/cardholders/${id}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Retrieves the cards issued to the specified cardholder.
     *
     * @memberof Issuing
     * @param {string} id Cardholder id.
     * @return {Promise<Object>} A promise to the cardholder details response.
     */
    async getCardholderCards(id) {
        try {
            const response = await get(
                fetch,
                `${this.config.host}/issuing/cardholders/${id}/cards`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
