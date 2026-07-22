import { determineError } from '../../services/errors.js';
import { get, put } from '../../services/http.js';
import { getConfigWithAcceptHeader } from './accept-header.js';

/**
 * Class dealing with entity-requirement endpoints under /accounts/entities.
 *
 * @export
 * @class EntityRequirements
 */
export default class EntityRequirements {
    constructor(config) {
        this.config = config;
    }

    /**
     * Retrieve the list of pending requirements that a sub-entity must resolve.
     *
     * @memberof EntityRequirements
     * @param {string} entityId The sub-entity id.
     * @param {string} [schemaVersion='3.0'] Schema version to use (1.0, 2.0, or 3.0).
     * @return {Promise<Object>} A promise to the requirements list response.
     */
    async getEntityRequirements(entityId, schemaVersion) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/accounts/entities/${entityId}/requirements`,
                getConfigWithAcceptHeader(this.config, schemaVersion),
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Retrieve detailed information for a single requirement.
     *
     * @memberof EntityRequirements
     * @param {string} entityId The sub-entity id.
     * @param {string} requirementId The requirement id.
     * @return {Promise<Object>} A promise to the requirement details response.
     */
    async getEntityRequirementDetails(entityId, requirementId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/accounts/entities/${entityId}/requirements/${requirementId}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Submit a response to resolve a requirement.
     *
     * @memberof EntityRequirements
     * @param {string} entityId The sub-entity id.
     * @param {string} requirementId The requirement id.
     * @param {Object} body { value: ... } — concrete shape defined by the
     *   requirement's `_schema` returned from {@link getEntityRequirementDetails}.
     * @return {Promise<Object>} A promise to the update response.
     */
    async updateEntityRequirement(entityId, requirementId, body) {
        try {
            const response = await put(
                this.config.httpClient,
                `${this.config.host}/accounts/entities/${entityId}/requirements/${requirementId}`,
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
