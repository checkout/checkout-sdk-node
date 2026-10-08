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
     *  - billing_descriptor: optional PaymentSetupBillingDescriptor: name (string, max 25 characters),
     *    city (string, max 13 characters), reference (string, max 50 characters).
     *  - presentment_details: optional PaymentSetupPresentmentDetails: amount (integer, int64),
     *    currency (string).
     *  - terminal: optional PaymentSetupTerminal: id (string, min 8 / max 8 characters),
     *    local_date_time (string, date-time format).
     *  - industry: optional PaymentSetupIndustry: accommodation (array of PaymentSetupAccommodation) and
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
     *    flight_leg_details (array of PaymentSetupFlightLegDetails: flight_number [string,
     *    e.g. "BA1483", not a number], carrier_code [IATA 2-letter accounting code],
     *    class_of_travelling [one-letter travel class, e.g. "W"], departure_airport [IATA
     *    3-letter], departure_date [date format], departure_time [e.g. "18:30"],
     *    arrival_airport [IATA 3-letter], stop_over_code [one letter, e.g. "X"],
     *    fare_basis_code [e.g. "WUP14B"]. Note class_of_travelling with two l's and
     *    stop_over_code as three words: six SDKs previously shipped service_class,
     *    class_of_traveling or stopover_code here and the values never reached the API),
     *    total_number_of_passengers (integer, added 2026-09-08), travel_type (string, added 2026-09-08; free-form,
     *    not a typed enum), trip_type (string, added 2026-09-08; free-form, not a typed enum),
     *    refundable (boolean, added 2026-09-08), delivery_recipient (string, added 2026-09-08; plain string,
     *    not a validated email format), ancillaries (string, added 2026-09-08; singular string per swagger,
     *    not an array despite the plural name), insurance (object, added 2026-09-08: type [string], company [string],
     *    price [{ amount: number, currency: string (3-letter ISO) }]).
     *
     * Cash App Pay and customer (per the `PaymentSetup` specs):
     *  - payment_methods.cashapp: optional CashApp, the Cash App payment method's details and configuration.
     *    The key is `cashapp`, one lowercase word (not `cash_app`, not `cashApp`). Fields you send:
     *    - initialization: The initialization state of the payment method. When you create a Payment Setup,
     *      this defaults to disabled. [Optional]. Enum: "disabled" "enabled". Default "disabled".
     *    - customer_profile_sharing: Indicates whether the customer consents to share their Cash App customer
     *      profile with Checkout.com. [Optional]. boolean.
     *    Fields the response returns (readOnly, do not send them):
     *    - status: The payment method status. [Optional]. readOnly.
     *      Enum: "unavailable" "action_required" "ready" "initialization_required" "invalid".
     *    - flags: The list of error codes or indicators that highlight missing or invalid information.
     *      [Optional]. readOnly. Array of string.
     *    - reference: A reference for the Cash App Pay transaction, returned by the provider. [Optional].
     *      readOnly. max 80 characters.
     *    - action: The next available action for the payment method. [Optional]. readOnly. Object:
     *      - type: The type of action. [Optional]. Enum: "redirect".
     *      - redirect_url: The URL to redirect the customer to so they can authorize the payment with
     *        Cash App. [Optional]. Format: uri.
     *    - customer_profile: The customer's Cash App profile that they consented to share. Included in the
     *      response when customer_profile_sharing is enabled. Cash App releases this profile only once. It's
     *      present in the first successful response when you get the Payment Setup after the customer
     *      authorizes the payment. Every subsequent response omits it, so store it when you first read it.
     *      [Optional]. readOnly. See `getAPaymentSetup` for its 13 fields and the 8 address fields.
     *  - customer: optional, the customer's details. Every field is optional:
     *    - id: The unique identifier of the customer. [Optional].
     *    - country: The two-letter ISO country code of the customer for this payment. [Optional].
     *      min 2 characters, max 2 characters.
     *    - email: Details of the customer's email. [Optional]. Object: address (string, the customer's
     *      email address), verified (boolean, specifies whether the customer's email address is verified).
     *    - name: The customer's full name. [Optional]. max 100 characters.
     *    - tax_number: The customer's tax identification number. [Optional].
     *    - phone: The customer's phone number. [Optional]. PaymentSetupPhone: country_code (string, the
     *      international country calling code, min 1 character, max 7 characters), number (string,
     *      the phone number, min 6 characters, max 25 characters).
     *    - device: Details of the customer's device. [Optional]. Object:
     *      - locale: The locale of the device. [Optional].
     *      - fingerprint: A unique identifier for the customer's device. [Optional].
     *      - ipv4: The customer's device IPv4 address, used by some payment methods for risk and
     *        eligibility checks. [Optional].
     *      - ipv6: The customer's device IPv6 address, used by some payment methods for risk and
     *        eligibility checks. [Optional].
     *      - client: The type of client the customer uses to initiate the payment. [Optional].
     *        Required when using Cash App Pay. Enum: "web" "mobile_web" "app".
     *      - os: The operating system of the customer's device. [Optional]. Enum: "android" "ios".
     *    - merchant_account: Details of the account the customer holds with the merchant. [Optional].
     *      PaymentSetupMerchantAccount, every field optional:
     *      - id: The merchant's unique identifier for the customer's account. [Optional].
     *      - registration_date: The date the customer registered their account with the merchant.
     *        [Optional]. Format: date.
     *      - last_modified: The date the customer's account with the merchant was last modified.
     *        [Optional]. Format: date.
     *      - returning_customer: Specifies if the customer is a returning customer. [Optional]. boolean.
     *      - first_transaction_date: The date of the customer's first transaction. [Optional].
     *        Format: date.
     *      - last_transaction_date: The date of the customer's most recent transaction. [Optional].
     *        Format: date.
     *      - total_order_count: The total number of orders made by the customer. [Optional]. integer.
     *      - last_payment_amount: The payment amount of the customer's most recent transaction.
     *        [Optional]. number.
     *
     * @memberof PaymentSetups
     * @param {Object} body - Request body
     * @returns {Promise<Object>} A promise to the Create a Payment Setup response
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
     *  - billing_descriptor: optional PaymentSetupBillingDescriptor: name (string, max 25 characters),
     *    city (string, max 13 characters), reference (string, max 50 characters).
     *  - presentment_details: optional PaymentSetupPresentmentDetails: amount (integer, int64),
     *    currency (string).
     *  - terminal: optional PaymentSetupTerminal: id (string, min 8 / max 8 characters),
     *    local_date_time (string, date-time format).
     *  - industry: optional PaymentSetupIndustry: accommodation (array of PaymentSetupAccommodation) and
     *    airline (array of PaymentSetupAirline). See `createAPaymentSetup` JSDoc for the full field list,
     *    including the fields added 2026-09-08: PaymentSetupAccommodation.total_number_of_guests,
     *    refundable, delivery_recipient, host; PaymentSetupAirline.ancillaries, delivery_recipient,
     *    insurance, refundable, total_number_of_passengers, travel_type, trip_type.
     *
     * Cash App Pay and customer (per the `PaymentSetup` specs):
     *  - payment_methods.cashapp: optional CashApp, the Cash App payment method's details and configuration.
     *    The key is `cashapp`, one lowercase word (not `cash_app`, not `cashApp`). Fields you send:
     *    - initialization: The initialization state of the payment method. When you create a Payment Setup,
     *      this defaults to disabled. [Optional]. Enum: "disabled" "enabled". Default "disabled".
     *    - customer_profile_sharing: Indicates whether the customer consents to share their Cash App customer
     *      profile with Checkout.com. [Optional]. boolean.
     *    The response also returns the readOnly status, flags, reference (max 80 characters),
     *    action (type "redirect", redirect_url in uri format) and the once-only customer_profile. See
     *    `createAPaymentSetup` and `getAPaymentSetup` for their full description.
     *  - customer: optional, the customer's details. Every field is optional:
     *    - id: The unique identifier of the customer. [Optional].
     *    - country: The two-letter ISO country code of the customer for this payment. [Optional].
     *      min 2 characters, max 2 characters.
     *    - email: Details of the customer's email. [Optional]. Object: address (string), verified (boolean).
     *    - name: The customer's full name. [Optional]. max 100 characters.
     *    - tax_number: The customer's tax identification number. [Optional].
     *    - phone: The customer's phone number. [Optional]. PaymentSetupPhone: country_code (string,
     *      min 1 character, max 7 characters), number (string, min 6 characters, max 25 characters).
     *    - device: Details of the customer's device. [Optional]. Object:
     *      - locale: The locale of the device. [Optional].
     *      - fingerprint: A unique identifier for the customer's device. [Optional].
     *      - ipv4: The customer's device IPv4 address, used by some payment methods for risk and
     *        eligibility checks. [Optional].
     *      - ipv6: The customer's device IPv6 address, used by some payment methods for risk and
     *        eligibility checks. [Optional].
     *      - client: The type of client the customer uses to initiate the payment. [Optional].
     *        Required when using Cash App Pay. Enum: "web" "mobile_web" "app".
     *      - os: The operating system of the customer's device. [Optional]. Enum: "android" "ios".
     *    - merchant_account: Details of the account the customer holds with the merchant. [Optional].
     *      PaymentSetupMerchantAccount, see `createAPaymentSetup` for its fields.
     *
     * @memberof PaymentSetups
     * @param {string} id - The unique identifier of the Payment Setup to update.
     * @param {Object} body - Request body
     * @returns {Promise<Object>} A promise to the Update a Payment Setup response
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
     *  - account_funding_transaction: Account Funding Transaction (AFT) details
     *    when the setup was created with one. See
     *    `PaymentSetupAccountFundingTransaction` in swagger for sender /
     *    recipient / identification shapes.
     *  - billing_descriptor: optional PaymentSetupBillingDescriptor: name (string, max 25 characters),
     *    city (string, max 13 characters), reference (string, max 50 characters).
     *  - presentment_details: optional PaymentSetupPresentmentDetails: amount (integer, int64),
     *    currency (string).
     *  - terminal: optional PaymentSetupTerminal: id (string, min 8 / max 8 characters),
     *    local_date_time (string, date-time format).
     *  - industry: optional PaymentSetupIndustry: accommodation (array of PaymentSetupAccommodation) and
     *    airline (array of PaymentSetupAirline). See `createAPaymentSetup` JSDoc for the full field list,
     *    including the fields added 2026-09-08: PaymentSetupAccommodation.total_number_of_guests,
     *    refundable, delivery_recipient, host; PaymentSetupAirline.ancillaries, delivery_recipient,
     *    insurance, refundable, total_number_of_passengers, travel_type, trip_type.
     *
     * Cash App Pay (per the `PaymentSetup` specs), under payment_methods.cashapp (key `cashapp`):
     *  - status: The payment method status. [Optional]. readOnly.
     *    Enum: "unavailable" "action_required" "ready" "initialization_required" "invalid".
     *  - flags: The list of error codes or indicators that highlight missing or invalid information.
     *    [Optional]. readOnly. Array of string.
     *  - initialization: The initialization state of the payment method. [Optional].
     *    Enum: "disabled" "enabled". Default "disabled".
     *  - customer_profile_sharing: Indicates whether the customer consents to share their Cash App customer
     *    profile with Checkout.com. [Optional]. boolean.
     *  - reference: A reference for the Cash App Pay transaction, returned by the provider. [Optional].
     *    readOnly. max 80 characters.
     *  - action: The next available action for the payment method. [Optional]. readOnly. Object:
     *    - type: The type of action. [Optional]. Enum: "redirect".
     *    - redirect_url: The URL to redirect the customer to so they can authorize the payment with
     *      Cash App. [Optional]. Format: uri.
     *  - customer_profile: The customer's Cash App profile that they consented to share. Included in the
     *    response when customer_profile_sharing is enabled. Cash App releases this profile only once. It's
     *    present in the first successful response when you get the Payment Setup after the customer
     *    authorizes the payment. Every subsequent response omits it, so store it when you first read it.
     *    [Optional]. readOnly. Object:
     *    - customer_id: Cash App's identifier for the customer. This is not a Checkout.com customer
     *      identifier. [Optional].
     *    - cashtag: The customer's $Cashtag. [Optional].
     *    - reference_id: Cash App's reference for the customer profile. [Optional].
     *    - full_name: The customer's full name. [Optional].
     *    - given_name: The customer's given name. [Optional].
     *    - middle_name: The customer's middle name. [Optional].
     *    - family_name: The customer's family name. [Optional].
     *    - suffix: The suffix of the customer's name. [Optional].
     *    - birth_date: The customer's date of birth. [Optional]. Format: date. Returned as a string; the
     *      provider's format varies (the spec example is a date-time, 1990-01-01T00:00:00.0000000).
     *    - address: The customer's address. [Optional]. Cash App's key names, not the Checkout.com
     *      address (address_line_1 has an underscore before the digit). Object:
     *      - address_line_1: The first line of the address. [Optional].
     *      - address_line_2: The second line of the address. [Optional].
     *      - address_line_3: The third line of the address. [Optional].
     *      - locality: The address locality, such as the city or town. [Optional].
     *      - sublocality: The address sublocality, such as the district or neighborhood. [Optional].
     *      - administrative_district_level_1: The address's top-level administrative district, such as
     *        the state or province. [Optional].
     *      - postal_code: The postal or zip code. [Optional].
     *      - country: The address country, in ISO 3166-1 alpha-2 format. [Optional]. max 2 characters.
     *    - phone_number: The customer's phone number. [Optional].
     *    - email_address: The customer's email address. [Optional].
     *    - customer_since: The date and time the customer's Cash App account was created. [Optional].
     *      Format: date-time. Returned as a string; the provider's format varies.
     *
     * The response's customer carries id, country (min 2 characters, max 2 characters), email, name,
     * tax_number, phone, device (locale, fingerprint, ipv4, ipv6, client, os) and merchant_account,
     * as described on `createAPaymentSetup`.
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
     * PaymentSetupAirline). See `createAPaymentSetup` JSDoc for the full field list, including the
     * fields added 2026-09-08: PaymentSetupAccommodation.total_number_of_guests, refundable,
     * delivery_recipient, host; PaymentSetupAirline.ancillaries, delivery_recipient, insurance,
     * refundable, total_number_of_passengers, travel_type, trip_type.
     *
     * Cash App Pay (per the `PaymentSetup` specs): confirm with payment_method_name "cashapp".
     * The response's payment_methods.cashapp may carry:
     *  - action: The next available action for the payment method. [Optional]. readOnly. Object:
     *    type (Enum: "redirect") and redirect_url (The URL to redirect the customer to so they can
     *    authorize the payment with Cash App. Format: uri).
     *  - reference: A reference for the Cash App Pay transaction, returned by the provider. [Optional].
     *    readOnly. max 80 characters.
     *  - customer_profile: The customer's Cash App profile that they consented to share. [Optional].
     *    readOnly. Cash App releases this profile only once: it is present in the first successful
     *    response when you get the Payment Setup after the customer authorizes the payment, and every
     *    subsequent response omits it. See `getAPaymentSetup` for its 13 fields and the 8 address fields.
     *  - status, flags, initialization and customer_profile_sharing, as described on `getAPaymentSetup`.
     *
     * The response's customer carries id, country (min 2 characters, max 2 characters), email, name,
     * tax_number, phone, device (locale, fingerprint, ipv4, ipv6, client, os) and merchant_account,
     * as described on `createAPaymentSetup`.
     *
     * @memberof PaymentSetups
     * @param {string} id - The unique identifier of the Payment Setup.
     * @param {string} payment_method_name - The name of the payment method to process the payment with (e.g. "tabby", "klarna", "card", "cashapp").
     * @returns {Promise<Object>} A promise to the Confirm a Payment Setup response
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
