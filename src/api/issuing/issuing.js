import fetch from 'node-fetch';
import { get, patch, post } from '../../services/http';
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

    /**
     * Creates a physical or virtual card and issues it to the specified cardholder.
     *
     * @memberof Issuing
     * @param {Object} body Card params.
     * @return {Promise<Object>} A promise to the card response.
     */
    async createCard(body) {
        try {
            const response = await post(
                fetch,
                `${this.config.host}/issuing/cards`,
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
     * Retrieves the details for a card you issued previously.
     *
     * @memberof Issuing
     * @param {string} id Card id.
     * @return {Promise<Object>} A promise to the card details response.
     */
    async getCardDetails(id) {
        try {
            const response = await get(
                fetch,
                `${this.config.host}/issuing/cards/${id}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Enrolls a card in 3D Secure (3DS).
     *
     * @memberof Issuing
     * @param {string} id Card id.
     * @param {Object} body 3DS enrollment params.
     * @return {Promise<Object>} A promise to the card response.
     */
    async enrollThreeDS(id, body) {
        try {
            const response = await post(
                fetch,
                `${this.config.host}/issuing/cards/${id}/3ds-enrollment`,
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
     * Updates a card's 3DS enrollment details.
     *
     * @memberof Issuing
     * @param {string} id Card id.
     * @param {Object} body 3DS enrollment params.
     * @return {Promise<Object>} A promise to the card response.
     */
    async updateThreeDS(id, body) {
        try {
            const response = await patch(
                fetch,
                `${this.config.host}/issuing/cards/${id}/3ds-enrollment`,
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
     * Retrieves the details for a card you issued previously.
     *
     * @memberof Issuing
     * @param {string} id Card id.
     * @return {Promise<Object>} A promise to the card response.
     */
    async getThreeDSDetails(id) {
        try {
            const response = await get(
                fetch,
                `${this.config.host}/issuing/cards/${id}/3ds-enrollment`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Activates an inactive or suspended card so that incoming authorizations can be approved.
     *
     * @memberof Issuing
     * @param {string} id Card id.
     * @return {Promise<Object>} A promise to the card response.
     */
    async activateCard(id) {
        try {
            const response = await post(
                fetch,
                `${this.config.host}/issuing/cards/${id}/activate`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Retrieves the credentials for a card you issued previously.
     *
     * @memberof Issuing
     * @param {string} id Card id.
     * @param {Object} body Card params.
     * @return {Promise<Object>} A promise to the card response.
     */
    async getCardCredentials(id, body) {
        try {
            let url = `${this.config.host}/issuing/cards/${id}/credentials`;

            if (body) {
                const queryString = Object.keys(body)
                    .map((key) => `${key}=${body[key]}`)
                    .join('&');
                url += `?${queryString}`;
            }

            const response = await get(fetch, url, this.config, this.config.sk);
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Revokes an inactive, active, or suspended card to permanently decline all incoming authorizations.
     *
     * @memberof Issuing
     * @param {string} id Card id.
     * @param {Object} body Card params.
     * @return {Promise<Object>} A promise to the card response.
     */
    async revokeCard(id, body) {
        try {
            const response = await post(
                fetch,
                `${this.config.host}/issuing/cards/${id}/revoke`,
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
     * Suspends an active or inactive card to temporarily decline all incoming authorizations.
     *
     * @memberof Issuing
     * @param {string} id Card id.
     * @param {Object} body Card params.
     * @return {Promise<Object>} A promise to the card response.
     */
    async suspendCard(id, body) {
        try {
            const response = await post(
                fetch,
                `${this.config.host}/issuing/cards/${id}/suspend`,
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