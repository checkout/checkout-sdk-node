import { _delete, get, patch, post } from '../../services/http.js';
import { determineError } from '../../services/errors.js';
import { buildQueryParams } from '../../services/utils.js';

/**
 * Cards class for managing card operations
 *
 * @export
 * @class Cards
 */
export default class Cards {
    constructor(config) {
        this.config = config;
    }

    /**
     * Creates a physical or virtual card and issues it to the specified cardholder.
     *
     * @memberof Cards
     * @param {Object} body Card params.
     * @param {string} [idempotencyKey] Idempotency Key.
     * @return {Promise<Object>} A promise to the card response.
     */
    async createCard(body, idempotencyKey) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/issuing/cards`,
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
     * Retrieves the details for a card you issued previously.
     *
     * @memberof Cards
     * @param {string} id Card id.
     * @return {Promise<Object>} A promise to the card details response.
     */
    async getCardDetails(id) {
        try {
            const response = await get(
                this.config.httpClient,
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
     * Updates a card you issued previously.
     *
     * @memberof Cards
     * @param {string} id Card id.
     * @param {Object} body Card params to update.
     * @return {Promise<Object>} A promise to the card update response.
     */
    async updateCard(id, body) {
        try {
            const response = await patch(
                this.config.httpClient,
                `${this.config.host}/issuing/cards/${id}`,
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
     * Enrolls a card in 3D Secure (3DS).
     *
     * @memberof Cards
     * @param {string} id Card id.
     * @param {Object} body 3DS enrollment params.
     * @return {Promise<Object>} A promise to the card response.
     */
    async enrollThreeDS(id, body) {
        try {
            const response = await post(
                this.config.httpClient,
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
     * @memberof Cards
     * @param {string} id Card id.
     * @param {Object} body 3DS enrollment params.
     * @return {Promise<Object>} A promise to the card response.
     */
    async updateThreeDS(id, body) {
        try {
            const response = await patch(
                this.config.httpClient,
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
     * @memberof Cards
     * @param {string} id Card id.
     * @return {Promise<Object>} A promise to the card response.
     */
    async getThreeDSDetails(id) {
        try {
            const response = await get(
                this.config.httpClient,
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
     * @memberof Cards
     * @param {string} id Card id.
     * @return {Promise<Object>} A promise to the card response.
     */
    async activateCard(id) {
        try {
            const response = await post(
                this.config.httpClient,
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
     * @memberof Cards
     * @param {string} id Card id.
     * @param {Object} body Card params.
     * @return {Promise<Object>} A promise to the card response.
     */
    async getCardCredentials(id, body) {
        try {
            const url = buildQueryParams(
                `${this.config.host}/issuing/cards/${id}/credentials`,
                body
            );

            const response = await get(this.config.httpClient, url, this.config, this.config.sk);
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Renews a physical or virtual card.
     *
     * @memberof Cards
     * @param {string} id Card id.
     * @param {Object} body Card renewal params.
     * @return {Promise<Object>} A promise to the card renewal response.
     */
    async renewCard(id, body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/issuing/cards/${id}/renew`,
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
     * Revokes an inactive, active, or suspended card to permanently decline all incoming authorizations.
     *
     * @memberof Cards
     * @param {string} id Card id.
     * @param {Object} body Card params.
     * @return {Promise<Object>} A promise to the card response.
     */
    async revokeCard(id, body) {
        try {
            const response = await post(
                this.config.httpClient,
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
     * Schedules the revocation of a card at a specified future date and time.
     *
     * @memberof Cards
     * @param {string} id Card id.
     * @param {Object} body Card revocation schedule params.
     * @return {Promise<Object>} A promise to the card revocation schedule response.
     */
    async scheduleCardRevocation(id, body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/issuing/cards/${id}/schedule-revocation`,
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
     * Cancels a scheduled card revocation.
     *
     * @memberof Cards
     * @param {string} id Card id.
     * @return {Promise<Object>} A promise to the cancellation response.
     */
    async cancelScheduledCardRevocation(id) {
        try {
            const response = await _delete(
                this.config.httpClient,
                `${this.config.host}/issuing/cards/${id}/schedule-revocation`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Suspends an active or inactive card to temporarily decline all incoming authorizations.
     *
     * @memberof Cards
     * @param {string} id Card id.
     * @param {Object} body Card params.
     * @return {Promise<Object>} A promise to the card response.
     */
    async suspendCard(id, body) {
        try {
            const response = await post(
                this.config.httpClient,
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
