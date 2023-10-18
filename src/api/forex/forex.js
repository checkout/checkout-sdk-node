import { determineError } from '../../services/errors';
import { get, post } from '../../services/http';
import { buildQueryParams } from '../../services/utils';

/**
 * Class dealing with the forex api
 *
 * @export
 * @class Forex
 */
export default class Forex {
    constructor(config) {
        this.config = config;
    }

    /**
     * Request an exchange rate between a source and destination currency
     *
     * @param {Object} body Forex object body.
     * @return {Promise<Object>} A promise to the Forex response.
     */
    async request(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/forex/quotes`,
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
     * Use the Forex (FX) rates API to get the indicative foreign exchange rates that Checkout.com
     * uses to process payments for card payouts
     *
     * @param {Object} body Forex params.
     * @return {Promise<Object>} A promise to the Forex response.
     */
    async getRates(body) {
        try {
            const url = buildQueryParams(`${this.config.host}/forex/rates`, body);

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
