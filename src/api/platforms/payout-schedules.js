import { determineError } from '../../services/errors.js';
import { get, put } from '../../services/http.js';

/**
 * Payout schedules for sub-entities.
 *
 * @export
 * @class PayoutSchedules
 */
export default class PayoutSchedules {
    constructor(config) {
        this.config = config;
    }

    /**
     * Retrieve information about a sub-entity's payout schedule.
     *
     * @param {string} id The sub-entity's ID.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async retrieveSubEntityPayoutSchedule(id) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/accounts/entities/${id}/payout-schedules`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Update a sub-entity's payout schedule.
     *
     * @param {string} id The sub-entity's ID.
     * @param {Object} body Platforms request body.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async updateSubEntityPayoutSchedule(id, body) {
        try {
            const response = await put(
                this.config.httpClient,
                `${this.config.host}/accounts/entities/${id}/payout-schedules`,
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
