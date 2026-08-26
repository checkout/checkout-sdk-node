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
     * The response is keyed by currency code. For SaaS sellers (swagger
     * GetScheduleResponseIsv, 2026-08-05) each currency entry's `recurrence`
     * also includes:
     *  - recurrence.balance_minimum - amount, in the minor units of the
     *    schedule's currency, retained in the sub-entity's available balance.
     *  - recurrence.carry_forward_enabled - whether any balance below the
     *    configured minimum is carried forward to the next payout.
     *  - payment_instrument_id - the ID of the platforms payment instrument
     *    used as the payout destination.
     * Each currency entry also contains a `_links` object.
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
     * The body is keyed by the three-letter ISO currency code. Each currency
     * object requires `enabled` and `recurrence`, and accepts `threshold`.
     * For SaaS sellers (swagger UpdateScheduleRequestIsv, 2026-08-05) each
     * currency object also accepts:
     *  - balance_minimum - amount, in the minor units of the schedule's
     *    currency, to retain in the sub-entity's available balance. Defaults
     *    to 0.
     *  - carry_forward_enabled - whether to carry forward any balance below
     *    the configured minimum to the next payout. Defaults to false.
     *  - payment_instrument_id - the ID of the platforms payment instrument
     *    used as the payout destination. Optional; if included it must
     *    reference a verified payment instrument.
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
