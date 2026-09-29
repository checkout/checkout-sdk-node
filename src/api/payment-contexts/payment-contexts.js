import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';
import { validatePayment } from '../../services/validation.js';

// Path segments appended to the API base (config.host).
const PAYMENT_CONTEXTS_PATH = 'payment-contexts';

/*
 * Class dealing with the /payment-contexts endpoint
 *
 * @export
 * @class PaymentContexts
 */
export default class PaymentContexts {
    constructor(config) {
        this.config = config;
    }

    /**
     * Request a Payment Context.
     *
     * Notable optional fields (swagger PaymentContext / PaymentContextProcessing):
     *  - body.processing.airline_data: optional array of AirlineData: `ticket`, `passenger` and
     *    `flight_leg_details`. See the `cko.payments.request` JSDoc for the full nested shape.
     *  - body.processing.accommodation_data: optional array of AccommodationData, the full
     *    thirteen-field shape **including** `property_phone` and `customer_service_phone`.
     *    Payment contexts resolves to the same `AccommodationData` schema as `POST /payments`,
     *    unlike hosted payments, payment links and payment sessions, which resolve to the
     *    narrower `PaymentInterfacesProcessingAccommodationData` without the two phone arrays.
     *
     *    **Send `passenger` as a single object here, never an array.** Verified against the
     *    sandbox on 2026-09-28: an array is rejected with 422 `passenger_required`, a different
     *    error code from the `processing_airline_data_0_passenger_invalid` that hosted payments
     *    and payment links return, while a single
     *    `{ first_name, last_name, date_of_birth [date], address: { country } }` object is
     *    accepted. The specification declares this property array-only, so it is exactly
     *    inverted here. Several passengers cannot be expressed on this endpoint.
     *  - body.processing.airline_data[].flight_leg_details[].stop_over_code: **do not send
     *    this on payment contexts.** The endpoint rejects every value for it with 422
     *    `flight_leg_detail_stop_over_code_invalid`, including the specification's own example
     *    `"x"`, while accepting the identical flight leg with the key omitted. Confirmed by
     *    sending the same request twice on 2026-09-28, once with the key and once without: the
     *    code appears only in the first. The other eight flight-leg fields are fine.
     *
     * @memberof PaymentContexts
     * @param {object} body PaymentContexts Request body.
     * @param {string} [idempotencyKey] Idempotency Key.
     * @return {Promise<object>} A promise to payment context response.
     */
    async request(body, idempotencyKey) {
        try {
            validatePayment(body);

            const response = await post(
                this.config.httpClient,
                `${this.config.host}/${PAYMENT_CONTEXTS_PATH}`,
                this.config,
                this.config.sk,
                body,
                idempotencyKey
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }

    /**
     * Get Payment Context details.
     *
     * Response now carries an `id` field on `PaymentContextDetails` (swagger 2026-05-26)
     * — the payment-context identifier echoed back in the response.
     *
     * Response fields available under `payment_request.processing` (pass-through, swagger
     * `PaymentContextDetails`):
     *  - airline_data: array of AirlineData, each entry with `ticket`, `passenger` and
     *    `flight_leg_details`. See the `cko.payments.request` JSDoc for the full nested shape.
     *  - accommodation_data: array of AccommodationData, the full thirteen-field shape including
     *    `property_phone` and `customer_service_phone`.
     *
     *    **Read `passenger` defensively: it may be a single object or an array.** The
     *    specification declares it array-only, but a single passenger is sent and echoed back as
     *    a bare object. This client returns `response.json` untouched, so whichever shape the API
     *    returns is the shape the caller receives.
     *
     * @memberof PaymentContexts
     * @param {string} id /^(pay|sid)_(\w{26})$/ The payment or payment session identifier.
     * @return {Promise<object>} A promise to the get payment context response.
     */
    async get(id) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/${PAYMENT_CONTEXTS_PATH}/${id}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }
}
