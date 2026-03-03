import { _delete, get, post } from '../../services/http.js';
import { determineError } from '../../services/errors.js';
import { buildQueryParams } from '../../services/utils.js';

/**
 * ControlGroups class for managing control group operations
 *
 * @export
 * @class ControlGroups
 */
export default class ControlGroups {
    constructor(config) {
        this.config = config;
    }

    /**
     * Create a control group.
     * Creates a control group and applies it to the specified target.
     *
     * @memberof ControlGroups
     * @param {Object} body Control group request params.
     * @return {Promise<Object>} A promise to the control group response.
     */
    async createControlGroup(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/issuing/controls/control-groups`,
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
     * Get a target's control groups.
     * Retrieves a list of control groups applied to the specified target.
     *
     * @memberof ControlGroups
     * @param {Object} params Query parameters with target_id (required).
     * @return {Promise<Object>} A promise to the control groups list.
     */
    async getControlGroupByTarget(params) {
        try {
            const url = buildQueryParams(`${this.config.host}/issuing/controls/control-groups`, params);
            const response = await get(this.config.httpClient, url, this.config, this.config.sk);
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Get control group details.
     * Retrieves the details of a control group you created previously.
     *
     * @memberof ControlGroups
     * @param {string} controlGroupId The control group ID.
     * @return {Promise<Object>} A promise to the control group details.
     */
    async getControlGroup(controlGroupId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/issuing/controls/control-groups/${controlGroupId}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Remove a control group.
     * Removes the control group and all the controls it contains. If you want to reapply an equivalent control group
     * to the card, you'll need to create a new control group.
     *
     * @memberof ControlGroups
     * @param {string} controlGroupId The control group ID.
     * @return {Promise<Object>} A promise to the deletion response.
     */
    async deleteControlGroup(controlGroupId) {
        try {
            const response = await _delete(
                this.config.httpClient,
                `${this.config.host}/issuing/controls/control-groups/${controlGroupId}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
