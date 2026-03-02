import { determineError } from '../../services/errors.js';
import { get, post, put } from '../../services/http.js';

/**
 * Config with Accept header required for /accounts/entities endpoints.
 * @private
 */
function getConfigWithAcceptHeader(config, schemaVersion = '3.0') {
    return {
        ...config,
        headers: {
            ...(config.headers || {}),
            Accept: `application/json;schema_version=${schemaVersion}`
        }
    };
}

/**
 * Sub-entity (accounts/entities) operations for the Platforms API.
 *
 * @export
 * @class Subentity
 */
export default class Subentity {
    constructor(config) {
        this.config = config;
    }

    /**
     * Onboard a sub-entity so they can start receiving payments.
     *
     * @param {Object} body Platforms request body.
     * @param {string} [schemaVersion='3.0'] Schema version to use (1.0, 2.0, or 3.0).
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async onboardSubEntity(body, schemaVersion) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/accounts/entities`,
                getConfigWithAcceptHeader(this.config, schemaVersion),
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Use this endpoint to retrieve a sub-entity and its full details.
     *
     * @param {string} id Sub-entity id.
     * @param {string} [schemaVersion='3.0'] Schema version to use (1.0, 2.0, or 3.0).
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async getSubEntityDetails(id, schemaVersion) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/accounts/entities/${id}`,
                getConfigWithAcceptHeader(this.config, schemaVersion),
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Update sub-entity details (contact, profile, company, identification).
     *
     * @param {string} id Sub-entity id.
     * @param {Object} body Platforms request body.
     * @param {string} [schemaVersion='3.0'] Schema version to use (1.0, 2.0, or 3.0).
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async updateSubEntityDetails(id, body, schemaVersion) {
        try {
            const response = await put(
                this.config.httpClient,
                `${this.config.host}/accounts/entities/${id}`,
                getConfigWithAcceptHeader(this.config, schemaVersion),
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Retrieve information on all users of a sub-entity invited through Hosted Onboarding.
     *
     * @param {string} entityId Sub-entity id.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async getSubEntityMembers(entityId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/accounts/entities/${entityId}/members`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Resend an invitation to the user of a sub-entity (Hosted Onboarding).
     *
     * @param {string} entityId The ID of the sub-entity.
     * @param {string} userId The ID of the invited user.
     * @param {Object} body The body (Reinvite sub-entity member).
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async reinviteSubEntityMember(entityId, userId, body) {
        try {
            const response = await put(
                this.config.httpClient,
                `${this.config.host}/accounts/entities/${entityId}/members/${userId}`,
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
