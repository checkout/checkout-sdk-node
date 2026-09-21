import { get, patch, post } from '../../services/http.js';
import { determineError } from '../../services/errors.js';
import { buildQueryParams } from '../../services/utils.js';

// Path segments appended to the API base (config.host).
const ACTIVATE_PATH = 'activate';
const CARDS_PATH = 'cards';
const CREDENTIALS_PATH = 'credentials';
const ISSUING_PATH = 'issuing';
const RENEW_PATH = 'renew';
const REVOKE_PATH = 'revoke';
const SUSPEND_PATH = 'suspend';
const THREE_DS_ENROLLMENT_PATH = '3ds-enrollment';

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
                `${this.config.host}/${ISSUING_PATH}/${CARDS_PATH}`,
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
                `${this.config.host}/${ISSUING_PATH}/${CARDS_PATH}/${id}`,
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
     * Pass headers to request the card's encrypted credentials in the response. Set
     * `return-encrypted-cvv` to "true" together with an `Encryption-Key`; supplying the flag
     * without the key returns a 422 with error code `encryption_key_required`.
     *
     * The headers travel on a copy of the config rather than on the body, which is how
     * getRequestHeaders picks them up for every verb. Putting them on the body would also send
     * them as JSON fields.
     *
     * @memberof Cards
     * @param {string} id Card id.
     * @param {Object} body Card params to update.
     * @param {Object} [headers] Optional HTTP headers. Supports `return-encrypted-cvv` and
     *   `Encryption-Key`.
     * @return {Promise<Object>} A promise to the card update response, carrying `encrypted_cvv`
     *   when requested.
     */
    async updateCard(id, body, headers) {
        try {
            const config = headers
                ? { ...this.config, headers: { ...(this.config.headers || {}), ...headers } }
                : this.config;

            const response = await patch(
                this.config.httpClient,
                `${this.config.host}/${ISSUING_PATH}/${CARDS_PATH}/${id}`,
                config,
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
                `${this.config.host}/${ISSUING_PATH}/${CARDS_PATH}/${id}/${THREE_DS_ENROLLMENT_PATH}`,
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
                `${this.config.host}/${ISSUING_PATH}/${CARDS_PATH}/${id}/${THREE_DS_ENROLLMENT_PATH}`,
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
                `${this.config.host}/${ISSUING_PATH}/${CARDS_PATH}/${id}/${THREE_DS_ENROLLMENT_PATH}`,
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
                `${this.config.host}/${ISSUING_PATH}/${CARDS_PATH}/${id}/${ACTIVATE_PATH}`,
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
                `${this.config.host}/${ISSUING_PATH}/${CARDS_PATH}/${id}/${CREDENTIALS_PATH}`,
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
                `${this.config.host}/${ISSUING_PATH}/${CARDS_PATH}/${id}/${RENEW_PATH}`,
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
                `${this.config.host}/${ISSUING_PATH}/${CARDS_PATH}/${id}/${REVOKE_PATH}`,
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
     * @memberof Cards
     * @param {string} id Card id.
     * @param {Object} body Card params.
     * @return {Promise<Object>} A promise to the card response.
     */
    async suspendCard(id, body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/${ISSUING_PATH}/${CARDS_PATH}/${id}/${SUSPEND_PATH}`,
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
