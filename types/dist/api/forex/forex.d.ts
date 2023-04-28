/**
 * Class dealing with the forex api
 *
 * @export
 * @class Forex
 */
export default class Forex {
    constructor(config: any);
    config: any;
    /**
     * Request an exchange rate between a source and destination currency
     *
     * @param {Object} body Forex object body.
     * @return {Promise<Object>} A promise to the Forex response.
     */
    request(body: any): Promise<any>;
    /**
     * Use the Forex (FX) rates API to get the indicative foreign exchange rates that Checkout.com
     * uses to process payments for card payouts
     *
     * @param {Object} body Forex params.
     * @return {Promise<Object>} A promise to the Forex response.
     */
    getRates(body: any): Promise<any>;
}
//# sourceMappingURL=forex.d.ts.map