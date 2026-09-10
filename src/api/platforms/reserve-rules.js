import { determineError } from '../../services/errors.js';
import { get, post, put } from '../../services/http.js';

// Path segments appended to the API base (config.host).
const ACCOUNTS_PATH = 'accounts';
const ENTITIES_PATH = 'entities';
const RESERVE_RULES_PATH = 'reserve-rules';

/**
 * Reserve rules for sub-entities.
 *
 * @export
 * @class ReserveRules
 */
export default class ReserveRules {
    constructor(config) {
        this.config = config;
    }

    /**
     * Retrieve the details of a specific reserve rule.
     *
     * @param {string} entityId The sub-entity's ID.
     * @param {string} id The reserve rule ID.
     * @return {Promise<Object>} A promise to the Platforms response (includes headers for ETag).
     */
    async getReserveRuleDetails(entityId, id) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/${ACCOUNTS_PATH}/${ENTITIES_PATH}/${entityId}/${RESERVE_RULES_PATH}/${id}`,
                this.config,
                this.config.sk
            );
            return {
                ...await response.json,
                headers: response.headers,
                status: response.status
            };
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Update an upcoming reserve rule (only rules that have never been active).
     *
     * @param {string} entityId The sub-entity's ID.
     * @param {string} id The reserve rule ID.
     * @param {Object} body The body to be sent.
     * @param {string} ifMatch Identifies a specific version of a reserve rule to update (e.g. Y3Y9MCZydj0w).
     * @return {Promise<Object>} A promise to the Platforms response (includes headers for ETag).
     */
    async updateReserveRule(entityId, id, body, ifMatch) {
        try {
            const config = {
                ...this.config,
                headers: {
                    ...(this.config.headers || {}),
                    'If-Match': ifMatch,
                },
            };

            const response = await put(
                this.config.httpClient,
                `${this.config.host}/${ACCOUNTS_PATH}/${ENTITIES_PATH}/${entityId}/${RESERVE_RULES_PATH}/${id}`,
                config,
                this.config.sk,
                body
            );
            return {
                ...await response.json,
                headers: response.headers,
                status: response.status
            };
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Create a sub-entity reserve rule.
     *
     * @param {string} id The sub-entity's ID.
     * @param {Object} body The body of the reserve rule to be added.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async addReserveRule(id, body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/${ACCOUNTS_PATH}/${ENTITIES_PATH}/${id}/${RESERVE_RULES_PATH}`,
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
     * Fetch all reserve rules for a sub-entity.
     *
     * @param {string} id The sub-entity's ID.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async queryReserveRules(id) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/${ACCOUNTS_PATH}/${ENTITIES_PATH}/${id}/${RESERVE_RULES_PATH}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
