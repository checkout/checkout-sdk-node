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
     *     - balancesAt: ISO-8601 timestamp to retrieve historical balances at that point in time.
     * @return {Promise<Object>} A promise to the balances response.
     */
    async retrieve(id, options) {
        try {
            let queryParams = [];

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
                    queryParams.push(`balances_at=${encodeURIComponent(options.balancesAt)}`);
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
}
