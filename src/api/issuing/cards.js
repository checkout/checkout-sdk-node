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
     * `body.scheduled_revocation_date` (string, `YYYY-MM-DD`, optional) schedules
     * the card to be revoked at midnight UTC on that date. Replaces the deprecated
     * `revocation_date` field; if both are provided, `scheduled_revocation_date` wins.
     *
     * The response includes `last_activated_on` (string, date-time, nullable), the
     * time the card was activated, or `null` if it was never activated.
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
     * The response includes `last_activated_on` (string, date-time, nullable), the
     * time the card was activated, or `null` if it was never activated, and
     * `scheduled_revocation_date` (string, `YYYY-MM-DD`), the date the card is
     * scheduled to be revoked at midnight UTC.
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
     * Only the fields you provide values for are updated. Passing `null` for a field **removes**
     * its existing value, so omit a field to leave it untouched rather than sending null.
     *
     * Pass headers to request the card's encrypted credentials in the response. Set
     * `return-encrypted-cvv` to `true` together with an `Encryption-Key`; supplying the flag
     * without the key returns a 422 with error code `encryption_key_required`.
     *
     * The headers travel on a copy of the config rather than on the body, which is how
     * getRequestHeaders picks them up for every verb. Putting them on the body would also send
     * them as JSON fields.
     *
     * `body.status` (string enum, optional, only `active` allowed) reactivates an
     * `inactive` or `suspended` card. Mutually exclusive with
     * `scheduled_activation_date`; the API returns
     * `scheduled_activation_date_conflicts_with_activation` if both are set.
     *
     * `body.scheduled_revocation_date` (string, `YYYY-MM-DD`, optional) schedules
     * the card to be revoked at midnight UTC on that date. Replaces the deprecated
     * `revocation_date` field; if both are provided, `scheduled_revocation_date` wins.
     *
     * The response has the same fields as the get-card response (including
     * `last_activated_on` and `scheduled_revocation_date`), plus a required
     * `last_modified_date`. It no longer includes `encrypted_cvv`. For a virtual card, the
     * response may also include `is_single_use` (boolean), specifying whether the card is set
     * to expire after a single use; physical cards never send it.
     *
     * @memberof Cards
     * @param {string} id Card id.
     * @param {Object} body Card params to update: `status`, `reference`, `metadata`,
     *   `expiry_month`, `expiry_year`, `scheduled_revocation_date`, `revocation_date`
     *   (deprecated, use `scheduled_revocation_date`) and `scheduled_activation_date`.
     * @param {Object} [headers] Deprecated. The API no longer supports these headers; use the
     *   method without headers. Will be removed in the next major version. When set, they are
     *   still sent unchanged.
     * @param {boolean} [headers.return-encrypted-cvv] Deprecated, see `headers`.
     * @param {string} [headers.Encryption-Key] Deprecated, see `headers`.
     * @return {Promise<Object>} A promise to the card update response (update-card-response):
     *   `id`, `client_id`, `entity_id`, `cardholder_id`, `card_product_id`, `user_id`,
     *   `last_four`, `expiry_month`, `expiry_year`, `status`, `display_name`, `type`,
     *   `billing_currency`, `issuing_country`, `reference`, `metadata`,
     *   `scheduled_revocation_date`, `revocation_date` (deprecated, use
     *   `scheduled_revocation_date`), `scheduled_activation_date`, `last_activated_on`,
     *   `root_card_id`, `parent_card_id`, `scheme`, `created_date`, `last_modified_date`, `_links`
     *   and, for virtual cards only (`type` is `virtual`), `is_single_use`.
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
     * The response includes a required `last_activated_on` (string, date-time), the
     * time the card was activated.
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
     * @param {Object} [body] Optional revoke-card request. When omitted, the request is sent
     *   without a body.
     * @param {string} [body.reason] Optional reason: `expired`, `reported_lost` or `reported_stolen`.
     * @return {Promise<Object>} A promise to the revoke-card response, carrying `_links`.
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
     * @param {Object} [body] Optional suspend-card request. When omitted, the request is sent
     *   without a body.
     * @param {string} [body.reason] Optional reason: `suspected_lost` or `suspected_stolen`.
     * @return {Promise<Object>} A promise to the suspend-card response, carrying `_links`.
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
