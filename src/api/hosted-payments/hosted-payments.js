import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';

// Path segments appended to the API base (config.host).
const HOSTED_PAYMENTS_PATH = 'hosted-payments';

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
     *  - body.processing.airline_data: optional array of
     *    PaymentInterfacesProcessingAirlineData: `ticket`, `passenger` and
     *    `flight_leg_details`. See the `cko.payments.request` JSDoc for the full nested shape.
     *  - body.processing.accommodation_data: optional array of
     *    PaymentInterfacesProcessingAccommodationData: the same eleven fields as
     *    `cko.payments.request` **minus** `property_phone` and `customer_service_phone`. Those
     *    two are declared on `AccommodationData` only, so they are read by `POST /payments` and
     *    payment contexts and ignored here.
     *
     *    **Send `passenger` as a single object here, never an array.** Verified against the
     *    sandbox on 2026-09-28: an array is rejected with 422
     *    `processing_airline_data_0_passenger_invalid` on this endpoint, while a single
     *    `{ first_name, last_name, date_of_birth [date], address: { country } }` object is
     *    accepted. This inverts the specification, which declares the property array-only on
     *    `AirlineData` and `oneOf[array, object]` here. Only `POST /payments` and
     *    `POST /payment-sessions` accept the array form, so several passengers cannot be
     *    expressed on this endpoint at all. Omit the key entirely when there are no passengers:
     *    an empty array and an explicit `null` are both rejected too.
     *
     * @memberof HostedPayments
     * @param {Object} body - Hosted Payments Page session request body
     * @return {Promise<Object>} A promise to the Hosted Payment response.
     */
    async create(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/${HOSTED_PAYMENTS_PATH}`,
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
                `${this.config.host}/${HOSTED_PAYMENTS_PATH}/${id}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
