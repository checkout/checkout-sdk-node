import { determineError } from '../../services/errors.js';
import { post } from '../../services/http.js';
import { validatePayment } from '../../services/validation.js';

// Path segments appended to the API base (config.host).
const COMPLETE_PATH = 'complete';
const PAYMENT_SESSIONS_PATH = 'payment-sessions';
const SUBMIT_PATH = 'submit';

/**
 * Class dealing with the /payment-sessions endpoint
 *
 * @export
 * @class PaymentSessions
 */
export default class PaymentSessions {
    constructor(config) {
        this.config = config;
    }

    /**
     * Creates a payment session.
     *
     * Notable optional fields (swagger CreatePaymentSessionsBaseRequest, 2026-06-08):
     *  - body.authorization_type — e.g. `Estimated`, `Final`.
     *  - body.3ds.challenge_indicator — four values only (default
     *    `no_preference`): `no_preference`, `no_challenge_requested`,
     *    `challenge_requested`, `challenge_requested_mandate`. The exemption
     *    values (`low_value`, `trusted_listing`, `trusted_listing_prompt`,
     *    `transaction_risk_assessment`, `data_share`) are accepted only by
     *    `cko.sessions.request` and are rejected here.
     *  - body.payment_plan — installment / recurring schedule. See swagger
     *    `PaymentSessionPaymentPlanRecurring` for the recurring variant
     *    (fields: amount, name, start_date — added 2026-05-08).
     *  - body.processing.airline_data: optional array of
     *    PaymentInterfacesProcessingAirlineData: `ticket`, `passenger` and
     *    `flight_leg_details`. See the `cko.payments.request` JSDoc for the full nested shape.
     *  - body.processing.accommodation_data: optional array of
     *    PaymentInterfacesProcessingAccommodationData: the same eleven fields as
     *    `cko.payments.request` **minus** `property_phone` and `customer_service_phone`. Those
     *    two are declared on `AccommodationData` only, so they are read by `POST /payments` and
     *    payment contexts and ignored here.
     *
     *    **`passenger` accepts either a single object or an array on this endpoint.** Verified
     *    against the sandbox on 2026-09-28: both forms return 201. That makes payment sessions
     *    the exception among the payment-interfaces endpoints. Hosted payments and payment links
     *    resolve to the *same* `PaymentInterfacesProcessing` schema yet reject the array with
     *    422 `processing_airline_data_0_passenger_invalid`, so the shared schema is not a
     *    reliable guide to which form a surface takes and each has to be tested. A single object
     *    is still the safer default, being the one form every surface accepts. Omit the key
     *    entirely when there are no passengers.
     *
     * @memberof PaymentSessions
     * @param {object} body PaymentSessions Request body.
     * @return {Promise<object>} A promise to payment context response.
     */
    async request(body) {
        try {
            validatePayment(body);

            const response = await post(
                this.config.httpClient,
                `${this.config.host}/${PAYMENT_SESSIONS_PATH}`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }

    /**
     * Submit a payment attempt for a payment session.
     *
     * Notable optional fields (swagger SubmitPaymentSessionsRequest, 2026-06-08):
     *  - body.3ds.challenge_indicator — four values only (default
     *    `no_preference`): `no_preference`, `no_challenge_requested`,
     *    `challenge_requested`, `challenge_requested_mandate`. The exemption
     *    values (`low_value`, `trusted_listing`, `trusted_listing_prompt`,
     *    `transaction_risk_assessment`, `data_share`) are accepted only by
     *    `cko.sessions.request` and are rejected here.
     *  - body.amount_allocations — added 2026-08-21. The sub-entities the payment
     *    is being processed on behalf of; min 1, max 50 items. Each entry takes
     *    `id` and `amount` ([Required]), plus optional `reference` (max 50
     *    characters) and `commission` (`{ amount, percentage }`, percentage min 0
     *    max 100). The sum of all split amounts must equal the payment amount.
     *
     * @memberof PaymentSessions
     * @param {string} id The payment session ID.
     * @param {object} body PaymentSessions Request body.
     * @return {Promise<object>} A promise to payment context response.
     */
    async submit(id, body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/${PAYMENT_SESSIONS_PATH}/${id}/${SUBMIT_PATH}`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }

    /**
     * Request a Payment Session with Payment.
     * Create a payment session and submit a payment attempt for it.
     *
     * Notable optional fields (swagger CreateAndSubmitPaymentSessionsRequest, 2026-06-08):
     *  - body.3ds.challenge_indicator — four values only (default
     *    `no_preference`): `no_preference`, `no_challenge_requested`,
     *    `challenge_requested`, `challenge_requested_mandate`. The exemption
     *    values (`low_value`, `trusted_listing`, `trusted_listing_prompt`,
     *    `transaction_risk_assessment`, `data_share`) are accepted only by
     *    `cko.sessions.request` and are rejected here.
     *  - body.processing.airline_data and body.processing.accommodation_data: accepted here too.
     *    The request schema `CreateAndSubmitPaymentSessionsRequest` composes the same
     *    `CreatePaymentSessionsBaseRequest` that `cko.paymentSessions.request` uses, so both
     *    fields and the `PaymentInterfacesProcessing` shape apply unchanged. See the `request`
     *    JSDoc above for the fields and the `passenger` cardinality, and
     *    `cko.payments.request` for the full nested shape. As on `request`, both a single
     *    `passenger` object and an array are accepted on this endpoint.
     *
     * @memberof PaymentSessions
     * @param {object} body PaymentSessions Request body.
     * @return {Promise<object>} A promise to payment response (201 processed or 202 action required).
     */
    async complete(body) {
        try {
            validatePayment(body);

            const response = await post(
                this.config.httpClient,
                `${this.config.host}/${PAYMENT_SESSIONS_PATH}/${COMPLETE_PATH}`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }
}
