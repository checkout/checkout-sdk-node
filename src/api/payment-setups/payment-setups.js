import { determineError } from '../../services/errors.js';
import { get, post, put } from '../../services/http.js';
import { validatePayment } from '../../services/validation.js';

// Path segments appended to the API base (config.host).
const CONFIRM_PATH = 'confirm';
const PAYMENTS_PATH = 'payments';
const SETUPS_PATH = 'setups';

/**
 * Class dealing with the /payment-setups endpoint
 *
 * @export
 * @class PaymentSetups
 */
export default class PaymentSetups {
    constructor(config) {
        this.config = config;
    }

    /**
     * Create a Payment Setup
     * [BETA]
     * Creates a Payment Setup.
     * To maximize the amount of information the payment setup can use, we recommend that you create a payment setup as early
     * as possible in the customer's journey. For example, the first time they land on the basket page.
     *
     * Request/response (swagger `PaymentSetup`, 2026-05-26) may also include:
     *  - billing_descriptor — optional PaymentSetupBillingDescriptor: name (string, max 25 characters),
     *    city (string, max 13 characters), reference (string, max 50 characters).
     *  - presentment_details — optional PaymentSetupPresentmentDetails: amount (integer, int64),
     *    currency (string).
     *  - terminal — optional PaymentSetupTerminal: id (string, min 8 / max 8 characters),
     *    local_date_time (string, date-time format).
     *  - industry — optional PaymentSetupIndustry: accommodation (array of PaymentSetupAccommodation) and
     *    airline (array of PaymentSetupAirline).
     *    PaymentSetupAccommodation (all fields optional): name (string), booking_reference (string),
     *    check_in_date (string, date format), check_out_date (string, date format),
     *    address (object: address_line1, city, state, country [ISO 3166-1 alpha-2], zip, all optional strings),
     *    number_of_rooms (integer), guests (array of { first_name, last_name, date_of_birth [date] }),
     *    room (array of { rate [number], number_of_nights [integer], type [string] }),
     *    total_number_of_guests (integer, added 2026-09-08), refundable (boolean, added 2026-09-08),
     *    delivery_recipient (string, added 2026-09-08; plain string, not a validated email format),
     *    host (object, added 2026-09-08: registration_date [string, date format], total_reservation_count [integer]).
     *    PaymentSetupAirline (all fields optional): ticket (object: number, issue_date [date],
     *    issuing_carrier_code, travel_package_indicator [free-form string], travel_agency_name, travel_agency_code),
     *    passengers (array of { first_name, last_name, date_of_birth [date], address: { country [ISO 3166-1 alpha-2] } }),
     *    flight_leg_details (array of PaymentSetupFlightLegDetails),
     *    total_number_of_passengers (integer, added 2026-09-08), travel_type (string, added 2026-09-08; free-form,
     *    not a typed enum), trip_type (string, added 2026-09-08; free-form, not a typed enum),
     *    refundable (boolean, added 2026-09-08), delivery_recipient (string, added 2026-09-08; plain string,
     *    not a validated email format), ancillaries (string, added 2026-09-08; singular string per swagger,
     *    not an array despite the plural name), insurance (object, added 2026-09-08: type [string], company [string],
     *    price [{ amount: number, currency: string (3-letter ISO) }]).
     *
     * @memberof PaymentSetups
     * @param {Object} body - Request body
     * @returns {Promise&lt;Object&gt;} A promise to the Create a Payment Setup response
     */
    async createAPaymentSetup(body) {
        try {
            validatePayment(body);
            const url = `${this.config.host}/${PAYMENTS_PATH}/${SETUPS_PATH}`;
            const response = await post(
                this.config.httpClient,
                url,
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
     * Update a Payment Setup
     * [BETA]
     * Updates a Payment Setup.
     * You should update the payment setup whenever there are significant changes in the data relevant to the customer's
     * transaction. For example, when the customer makes a change that impacts the total payment amount.
     *
     * Request/response (swagger `PaymentSetup`, 2026-05-26) may also include:
     *  - billing_descriptor — optional PaymentSetupBillingDescriptor: name (string, max 25 characters),
     *    city (string, max 13 characters), reference (string, max 50 characters).
     *  - presentment_details — optional PaymentSetupPresentmentDetails: amount (integer, int64),
     *    currency (string).
     *  - terminal — optional PaymentSetupTerminal: id (string, min 8 / max 8 characters),
     *    local_date_time (string, date-time format).
     *  - industry — optional PaymentSetupIndustry: accommodation (array of PaymentSetupAccommodation) and
     *    airline (array of PaymentSetupAirline). See `createAPaymentSetup` JSDoc for the full field list,
     *    including the fields added 2026-09-08: PaymentSetupAccommodation.total_number_of_guests,
     *    refundable, delivery_recipient, host; PaymentSetupAirline.ancillaries, delivery_recipient,
     *    insurance, refundable, total_number_of_passengers, travel_type, trip_type.
     *
     * @memberof PaymentSetups
     * @param {string} id - The unique identifier of the Payment Setup to update.
     * @param {Object} body - Request body
     * @returns {Promise&lt;Object&gt;} A promise to the Update a Payment Setup response
     */
    async updateAPaymentSetup(id, body) {
        try {
            validatePayment(body);
            const url = `${this.config.host}/${PAYMENTS_PATH}/${SETUPS_PATH}/${id}`;
            const response = await put(
                this.config.httpClient,
                url,
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
     * Get a Payment Setup
     * [BETA]
     * Retrieves a Payment Setup.
     *
     * Response (swagger `PaymentSetup`, 2026-05-26) may include:
     *  - account_funding_transaction — Account Funding Transaction (AFT) details
     *    when the setup was created with one. See
     *    `PaymentSetupAccountFundingTransaction` in swagger for sender /
     *    recipient / identification shapes.
     *  - billing_descriptor — optional PaymentSetupBillingDescriptor: name (string, max 25 characters),
     *    city (string, max 13 characters), reference (string, max 50 characters).
     *  - presentment_details — optional PaymentSetupPresentmentDetails: amount (integer, int64),
     *    currency (string).
     *  - terminal — optional PaymentSetupTerminal: id (string, min 8 / max 8 characters),
     *    local_date_time (string, date-time format).
     *  - industry — optional PaymentSetupIndustry: accommodation (array of PaymentSetupAccommodation) and
     *    airline (array of PaymentSetupAirline). See `createAPaymentSetup` JSDoc for the full field list,
     *    including the fields added 2026-09-08: PaymentSetupAccommodation.total_number_of_guests,
     *    refundable, delivery_recipient, host; PaymentSetupAirline.ancillaries, delivery_recipient,
     *    insurance, refundable, total_number_of_passengers, travel_type, trip_type.
     *
     * @memberof PaymentSetups
     * @param {string} id - The unique identifier of the Payment Setup to retrieve.
     * @returns {Promise<Object>} A promise to the Get a Payment Setup response
     */
    async getAPaymentSetup(id) {
        try {
            const url = `${this.config.host}/${PAYMENTS_PATH}/${SETUPS_PATH}/${id}`;
            const response = await get(
                this.config.httpClient,
                url,
                this.config,
                this.config.sk,
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }

     /**
     * Confirm a Payment Setup
     * [BETA]
     * Confirm a Payment Setup to begin processing the payment request with your chosen payment method.
     *
     * Response (swagger `PaymentSetup`, 2026-05-26) may include the same `industry` shape as
     * `createAPaymentSetup` (accommodation array of PaymentSetupAccommodation, airline array of
     * PaymentSetupAirline) — see `createAPaymentSetup` JSDoc for the full field list, including the
     * fields added 2026-09-08: PaymentSetupAccommodation.total_number_of_guests, refundable,
     * delivery_recipient, host; PaymentSetupAirline.ancillaries, delivery_recipient, insurance,
     * refundable, total_number_of_passengers, travel_type, trip_type.
     *
     * @memberof PaymentSetups
     * @param {string} id - The unique identifier of the Payment Setup.
     * @param {string} payment_method_name - The name of the payment method to process the payment with (e.g. "tabby", "klarna", "card").
     * @returns {Promise&lt;Object&gt;} A promise to the Confirm a Payment Setup response
     */
    async confirmAPaymentSetup(id, payment_method_name) {
        try {
            const url = `${this.config.host}/${PAYMENTS_PATH}/${SETUPS_PATH}/${id}/${CONFIRM_PATH}/${payment_method_name}`;
            const response = await post(
                this.config.httpClient,
                url,
                this.config,
                this.config.sk,
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }
}
