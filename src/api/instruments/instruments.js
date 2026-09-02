import { determineError } from '../../services/errors.js';
import { _delete, get, patch, post } from '../../services/http.js';
import { setInstrumentType } from '../../services/validation.js';

/**
 * Class dealing with the /instruments endpoint
 *
 * @export
 * @class Instruments
 */
export default class Instruments {
    constructor(config) {
        this.config = config;
    }

    /**
     * Create a payment instrument - card, bank, ach, sepa or bacs - that can be used at
     * any time to request one or more payments or payouts. For the `token` variant this
     * exchanges a single use Checkout.com token for a durable instrument reference.
     *
     * For the bank variants, which fields are required depends on the account's country
     * and currency; call `getBankAccountFieldFormatting` to discover them.
     *
     * `body.type` selects the variant. When omitted it defaults to `token`
     * (`setInstrumentType`, `src/services/validation.js`), so an explicit
     * `bacs` / `sepa` / `ach` is never overwritten.
     *
     * Bacs Direct Debit variant (swagger StoreBacsInstrumentRequest, 2026-07-30):
     *  - body.type — **required.** `bacs`.
     *  - body.account.processing_channel_id — **required.** The processing channel to
     *    associate with the instrument. Pattern `^(pc)_(\w{26})$`.
     *  - body.instrument_data.account_number — **required.** Exactly 8 characters.
     *  - body.instrument_data.bank_code — **required.** The sort code. Exactly 6 characters.
     *  - body.instrument_data.country — **required.** ISO 3166-1 alpha-2, e.g. `GB`.
     *  - body.instrument_data.currency — **required.** e.g. `GBP`.
     *  - body.instrument_data.payment_type — **required.** `Recurring` or `Regular`
     *    (capitalised — note this differs from the lowercase SEPA values).
     *  - body.instrument_data.allow_partial_match — optional, default `false`. When
     *    `true` the instrument is created even if account validation returns a partial
     *    match; when `false` creation fails on a partial match.
     *  - body.account_holder.first_name / last_name — **required.**
     *  - body.account_holder.billing_address — **required**, with a **required**
     *    `country`; `address_line1`, `address_line2`, `city` and `zip` are optional.
     *  - body.customer — optional, and accepted by all three bank variants (swagger
     *    `StoreCustomerInstrumentRequest`). Every field is optional:
     *     - customer.id — an existing customer to attach the instrument to.
     *       Pattern `^(cus)_(\w{26})$`. Omit it to create a new customer.
     *     - customer.email — max 255 characters, format `email`.
     *     - customer.name — max 255 characters. Only sets the name for **new**
     *       customers; ignored when `customer.id` refers to an existing one.
     *     - customer.phone — `{ country_code, number }` per `PhoneNumber`
     *       (`country_code` 1-7 characters, `number` 6-25). Same new-customers-only
     *       behaviour as `name`.
     *     - customer.default — boolean. When `true` this instrument becomes the
     *       customer's default. An instrument is automatically the default when the
     *       request creates a new customer.
     *
     * SEPA variant (swagger StoreSepaInstrumentRequest):
     *  - body.instrument_data.account_number (IBAN, 15-34), country, currency and
     *    payment_type are **required**; `payment_type` is `recurring` or `regular`
     *    (lowercase).
     *  - body.instrument_data.type — optional mandate type, `Core` or `B2B`.
     *  - body.instrument_data.mandate_id — optional; one is generated when absent.
     *  - body.instrument_data.date_of_signature — optional `yyyy-MM-dd`; required when
     *    `mandate_id` is provided.
     *
     * ACH variant (swagger StoreAchInstrumentRequest):
     *  - body.instrument_data.account_type — **required.** `savings` or `checking`.
     *  - body.instrument_data.account_number (4-17), bank_code (8-9), currency and
     *    country are **required.**
     *  - body.account_holder.type — **required.** `individual` or `corporate`.
     *    `first_name` / `last_name` are required for `individual`, `company_name` for
     *    `corporate`.
     *
     * @memberof Instruments
     * @param {Object} body Instruments request body.
     * @return {Promise<Object>} A promise to the request instruments response.
     */
    async create(body) {
        setInstrumentType(body);
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/instruments`,
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
     * Returns details of an instrument
     *
     * The response shape is selected by `type` (swagger RetrieveBacsInstrumentResponse /
     * RetrieveSepaInstrumentResponse / RetrieveAchInstrumentResponse, 2026-07-30).
     * Common to all: `id`, `type`, `fingerprint`, `created_on`, `vault_id`,
     * `modified_on`, `account.client_id`, `account.processing_channel_id`,
     * `validations` (array of untyped objects) and `customer`.
     *
     * Bacs-only fields under `instrument_data`, in addition to the stored
     * `account_number` / `bank_code` / `country` / `currency` / `payment_type` /
     * `allow_partial_match`:
     *  - status — the validation status of the account, e.g. `INVALID`. Free-form
     *    string, not an enum.
     *  - match_status — the result of matching the account holder name against the
     *    account owner, e.g. `no match`. Free-form string.
     *  - description — a human-readable description of the validation result.
     *  - mandate_id — the identifier of the Bacs Direct Debit mandate.
     *
     * `account_holder` additionally carries `company_name` and `type`
     * (`individual` or `corporate`).
     *
     * `customer` (swagger `RetrieveInstrumentCustomerResponse`) carries a required
     * `id` plus optional `email`, `name` and `default` - the last being `true` when
     * this instrument is the customer's default. Note it has no `phone`, unlike the
     * `customer` object accepted on create.
     *
     * @memberof Instruments
     * @param {string} id Instrument id.
     * @return {Promise<Object>} A promise to the instrument response.
     */
    async get(id) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/instruments/${id}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Update details of an instrument
     *
     * Every field is optional on update; `body.type` selects the variant and is **not**
     * defaulted here (unlike `create`).
     *
     * Bacs Direct Debit variant (swagger UpdateBacsInstrumentRequest, 2026-07-30) —
     * same `instrument_data` fields as the create variant, plus:
     *  - body.account_holder.company_name — the legal name of a registered company
     *    that holds the account. Max 50 characters.
     *  - body.account_holder.type — `individual` or `corporate`.
     *  - body.account_holder.billing_address.city / zip accept max 50 characters here,
     *    against 35 / 16 on create.
     *
     * The Bacs response (swagger UpdateBacsInstrumentResponse) returns `type`, `id` and
     * `fingerprint`, all three required.
     *
     * SEPA and ACH follow UpdateSepaInstrumentRequest / UpdateAchInstrumentRequest.
     * Only the **top-level** fields relax to optional there - the nested requirements do
     * not:
     *  - SEPA: `instrument_data` is optional, but if you send it then
     *    `account_number`, `country`, `currency` and `payment_type` are all required.
     *    `account_holder` is optional, but if you send it then `first_name`,
     *    `last_name` and `billing_address` are required, and that `billing_address`
     *    requires all five of `address_line1`, `address_line2`, `city`, `zip` and
     *    `country`.
     *  - ACH: `account_holder` is optional, but if you send it then `first_name`,
     *    `last_name`, `company_name` and `type` are all required. The ACH update
     *    variant has no `billing_address` at all.
     *
     * @memberof Instruments
     * @param {string} id Instrument id.
     * @param {Object} body Instruments request body.
     * @return {Promise<Object>} A promise to the instrument response.
     */
    async update(id, body) {
        try {
            const response = await patch(
                this.config.httpClient,
                `${this.config.host}/instruments/${id}`,
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
     * Delete a payment instrument.
     *
     * @memberof Instruments
     * @param {string} id Instrument id.
     * @return {Promise<Object>} A promise to the instrument response.
     */
    async delete(id) {
        try {
            const response = await _delete(
                this.config.httpClient,
                `${this.config.host}/instruments/${id}`,
                this.config,
                this.config.sk
            );
            // 204 No Content - return empty object
            if (response.status === 204) {
                return {};
            }
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Revoke a payment instrument. The instrument status is set to INVALID with
     * reason `revoked_by_merchant`. The instrument record is retained for audit
     * purposes.
     *
     * @memberof Instruments
     * @param {string} id Instrument id (pattern: ^(src_)[a-z0-9]{26}$).
     * @return {Promise<Object>} A promise to the revoke response.
     */
    async revoke(id) {
        try {
            const response = await patch(
                this.config.httpClient,
                `${this.config.host}/instruments/${id}/revoke`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Retrieve the bank account field formatting requirements for a country and
     * currency, so you know which fields to send when storing a bank instrument.
     *
     * Both query parameters are optional filters (swagger
     * `GET /validation/bank-accounts/{country}/{currency}`, 2026-07-30). They are sent
     * on the wire as `account-holder-type` and `payment-network`; this method accepts
     * either the camelCase names below or those exact hyphenated names, because a
     * misspelled parameter is silently ignored by the API rather than rejected.
     *
     *  - query.accountHolderType — filters the fields by account holder type.
     *    One of `individual`, `corporate`, `government`.
     *  - query.paymentNetwork — filters the fields by banking network.
     *    One of `local`, `sepa`, `fps`, `ach`, `fedwire`, `swift`.
     *
     * @memberof Instruments
     * @param {string} country Country 2 character ISO.
     * @param {string} currency Currency 3 character ISO.
     * @param {Object} [query] Optional field filters.
     * @param {string} [query.accountHolderType] individual | corporate | government.
     * @param {string} [query.paymentNetwork] local | sepa | fps | ach | fedwire | swift.
     * @return {Promise<Object>} A promise to the bank account field response.
     */
    async getBankAccountFieldFormatting(country, currency, query) {
        try {
            const queryParams = [];

            if (typeof query === 'object' && query !== null) {
                const accountHolderType =
                    query.accountHolderType ?? query['account-holder-type'];
                const paymentNetwork = query.paymentNetwork ?? query['payment-network'];

                if (accountHolderType) {
                    queryParams.push(
                        `account-holder-type=${encodeURIComponent(accountHolderType)}`
                    );
                }
                if (paymentNetwork) {
                    queryParams.push(`payment-network=${encodeURIComponent(paymentNetwork)}`);
                }
            }

            const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

            const response = await get(
                this.config.httpClient,
                `${this.config.host}/validation/bank-accounts/${country}/${currency}${queryString}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
