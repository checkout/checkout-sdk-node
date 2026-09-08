import { determineError } from '../../services/errors.js';
import { get } from '../../services/http.js';

/**
 * Class dealing with the /balances endpoint
 *
 * @export
 * @class Balances
 */
export default class Balances {
    constructor(config) {
        this.config = config;
    }

    /**
     * Use this endpoint to retrieve balances for each currency account belonging to an entity.
     *
     * Response fields added in 2026-05-08:
     *  - `Balance.collateral_breakdown` — collateral split by reserve rule.
     *  - `CurrencyAccountBalance.balances_as_of` — ISO-8601 timestamp the
     *    balance was computed against (server-populated).
     *  - `CurrencyAccountBalance.currency_account_id` — the id of the currency
     *    account, when `withCurrencyAccountId` is set on the query.
     *
     * @memberof Balances
     * @param {string} id The ID of the entity.
     * @param {string|Object} [options] Filter options. Can be:
     *   - string: currency code (e.g., 'EUR') - backward compatible
     *   - object: { query: 'currency:EUR', withCurrencyAccountId: true, balancesAt: 'ISO-8601' }
     *     - balancesAt: ISO-8601 timestamp to retrieve historical balances at
     *       that point in time. Forwarded verbatim as the `balancesAt` (camelCase)
     *       query parameter, as defined in swagger.
     * @return {Promise<Object>} A promise to the balances response.
     */
    async retrieve(id, options) {
        try {
            const queryParams = [];

            // Backward compatibility: if options is a string, treat it as currency
            if (typeof options === 'string') {
                queryParams.push(`query=currency:${options}`);
            } else if (typeof options === 'object' && options !== null) {
                // New object-based API
                if (options.query) {
                    queryParams.push(`query=${options.query}`);
                }
                if (options.withCurrencyAccountId !== undefined) {
                    queryParams.push(`withCurrencyAccountId=${options.withCurrencyAccountId}`);
                }
                if (options.balancesAt) {
                    // Swagger defines the query parameter as `balancesAt` (camelCase),
                    // not snake_case. Keep this exact name or the API silently ignores it.
                    queryParams.push(`balancesAt=${encodeURIComponent(options.balancesAt)}`);
                }
            }

            const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
            const url = `${this.config.balancesUrl}/${id}${queryString}`;
            
            const response = await get(
                this.config.httpClient,
                url,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
    /**
     * Retrieves the bank details required to top up a sub-account, along with the payment
     * reference that attributes an incoming payment to that sub-account.
     *
     * Note: The sub-account is referred to as `currency account` in the API.
     *
     * Uses `config.balancesHostUrl`, not `config.balancesUrl`: the latter already ends in
     * `/balances`, and this endpoint's path starts with `/entities`. Reusing it would produce
     * `.../balances/entities/...` and 404.
     *
     * The resolved response has this shape (keys are the wire names):
     *  - `currency_account_id` (string, [Required]) the sub-account the instructions apply to.
     *  - `currency` (string, [Required]) the currency funds must be sent in, as a three-letter
     *    ISO 4217 code. This is the sub-account's holding currency, returned as
     *    `holding_currency` by `cko.balances.retrieve`.
     *  - `payment_reference` (string, [Required]) the reference that must be quoted on the
     *    payment; it is how an incoming payment is attributed to the sub-account.
     *  - `bank_details` (object, [Required]) with optional `domestic` and `international`
     *    entries. **Both rails are optional** and availability depends on the sub-account's
     *    holding currency, jurisdiction and banking partner. Do not assume both are present;
     *    `bank_details` may contain neither.
     *
     * Each rail, when present, carries `beneficiary_account_name` and `bank_name` ([Required]),
     * plus any of `beneficiary_address`, `bank_address`, `account_number`, `sort_code`
     * (United Kingdom domestic), `routing_number` (United States domestic), `iban` and
     * `swift_code` (international), which are omitted when they do not apply.
     *
     * @memberof Balances
     * @param {string} entityId The ID of the entity that owns the sub-account, or of an entity
     *   above it in your hierarchy. A platform can use its own entity ID to reach the
     *   sub-accounts of any entity beneath it.
     * @param {string} currencyAccountId The ID of the sub-account to retrieve top-up
     *   instructions for.
     * @return {Promise<Object>} A promise to the top-up instructions response.
     */
    async retrieveTopUpInstructions(entityId, currencyAccountId) {
        try {
            const url = `${this.config.balancesHostUrl}/entities/${entityId}/currency-accounts/${currencyAccountId}/top-up-instructions`;

            const response = await get(this.config.httpClient, url, this.config, this.config.sk);
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
