import {
    BALANCES_LIVE_URL,
    BALANCES_SANDBOX_URL
} from '../../config.js';
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
     * @memberof Balances
     * @param {string} id The ID of the entity.
     * @param {string} currency The query to apply to limit the currency accounts.
     * @return {Promise<Object>} A promise to the balances response.
     */
    async retrieve(id, currency) {
        try {
            const url = `${
                this.config.host.includes('sandbox') ? BALANCES_SANDBOX_URL : BALANCES_LIVE_URL
            }/${id}${currency ? `?query=currency:${currency}` : ''}`;
            const response = await get(
                this.config.httpClient,
                url,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
