import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';

/**
 * Class dealing with the /hosted-payments endpoint
 *
 * @export
 * @class HostedPayments
 */
export default class HostedPayments {
    constructor(config) {
        this.config = config;
    }

    /**
     * Create a Hosted Payments Page session.
     *
     * Notable optional fields (swagger HostedPaymentsRequest, 2026-06-08):
     *  - body.authorization_type — e.g. `Estimated`, `Final`.
     *  - body.3ds.challenge_indicator — four values only (default
     *    `no_preference`): `no_preference`, `no_challenge_requested`,
     *    `challenge_requested`, `challenge_requested_mandate`. The exemption
     *    values (`low_value`, `trusted_listing`, `trusted_listing_prompt`,
     *    `transaction_risk_assessment`, `data_share`) are accepted only by
     *    `cko.sessions.request` and are rejected here.
     *  - body.payment_plan — installment / recurring schedule
     *    (`amount`, `name`, `start_date` added 2026-05-08).
     *
     * @memberof HostedPayments
     * @param {Object} body - Hosted Payments Page session request body
     * @return {Promise<Object>} A promise to the Hosted Payment response.
     */
    async create(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/hosted-payments`,
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
     * Get Hosted Payments Page details
     *
     * The response (swagger GetHostedPaymentsResponse) includes a `_links`
     * object with `self` and `redirect` links, plus `payment` and
     * `payment_actions` once a payment is in progress or completed.
     *
     * @memberof HostedPayments
     * @param {string} id - Hosted payment id
     * @return {Promise<Object>} A promise to the Hosted Payment response.
     */
    async get(id) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/hosted-payments/${id}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
