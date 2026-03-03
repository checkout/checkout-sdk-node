import { _delete, get, patch, post } from '../../services/http.js';
import { determineError } from '../../services/errors.js';
import { buildQueryParams } from '../../services/utils.js';

/**
 * ControlProfiles class for managing control profile operations
 *
 * @export
 * @class ControlProfiles
 */
export default class ControlProfiles {
    constructor(config) {
        this.config = config;
    }

    /**
     * Create a control profile.
     * Creates a control profile.
     *
     * @memberof ControlProfiles
     * @param {Object} body Control profile request params.
     * @return {Promise<Object>} A promise to the control profile response.
     */
    async createControlProfile(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/issuing/controls/control-profiles`,
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
     * Get all control profiles.
     * Retrieves a list of control profiles for the currently authenticated client, or for a specific card if a card ID is provided.
     *
     * @memberof ControlProfiles
     * @param {Object} params Query parameters with target_id (optional card ID).
     * @return {Promise<Object>} A promise to the control profiles list.
     */
    async getControlProfilesByTarget(params) {
        try {
            const url = buildQueryParams(`${this.config.host}/issuing/controls/control-profiles`, params);
            const response = await get(this.config.httpClient, url, this.config, this.config.sk);
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Get control profile details.
     * Retrieves the details of an existing control profile.
     *
     * @memberof ControlProfiles
     * @param {string} controlProfileId The control profile ID.
     * @return {Promise<Object>} A promise to the control profile details.
     */
    async getControlProfile(controlProfileId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/issuing/controls/control-profiles/${controlProfileId}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Update a control profile.
     * Update the control profile.
     *
     * @memberof ControlProfiles
     * @param {string} controlProfileId The control profile ID.
     * @param {Object} body Control profile update params.
     * @return {Promise<Object>} A promise to the control profile response.
     */
    async updateControlProfile(controlProfileId, body) {
        try {
            const response = await patch(
                this.config.httpClient,
                `${this.config.host}/issuing/controls/control-profiles/${controlProfileId}`,
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
     * Remove a control profile.
     * Removes the control profile. A control profile cannot be removed if it is used by a control.
     *
     * @memberof ControlProfiles
     * @param {string} controlProfileId The control profile ID.
     * @return {Promise<Object>} A promise to the deletion response.
     */
    async deleteControlProfile(controlProfileId) {
        try {
            const response = await _delete(
                this.config.httpClient,
                `${this.config.host}/issuing/controls/control-profiles/${controlProfileId}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Add target to control profile.
     * Adds a target to an existing control profile.
     *
     * @memberof ControlProfiles
     * @param {string} controlProfileId The control profile ID.
     * @param {string} targetId The target ID to add to control profile.
     * @return {Promise<Object>} A promise to the response.
     */
    async addTargetToControlProfile(controlProfileId, targetId) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/issuing/controls/control-profiles/${controlProfileId}/add/${targetId}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Remove target from control profile.
     * Removes a target from an existing control profile.
     *
     * @memberof ControlProfiles
     * @param {string} controlProfileId The control profile ID.
     * @param {string} targetId The target ID to remove from control profile.
     * @return {Promise<Object>} A promise to the response.
     */
    async removeTargetFromControlProfile(controlProfileId, targetId) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/issuing/controls/control-profiles/${controlProfileId}/remove/${targetId}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
