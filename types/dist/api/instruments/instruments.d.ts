/**
 * Class dealing with the /instruments endpoint
 *
 * @export
 * @class Instruments
 */
export default class Instruments {
    constructor(config: any);
    config: any;
    /**
     * Exchange a single use Checkout.com token for a payment instrument reference,
     * that can be used at any time to request one or more payments.
     *
     * @memberof Instruments
     * @param {Object} body Instruments request body.
     * @return {Promise<Object>} A promise to the request instruments response.
     */
    create(body: any): Promise<any>;
    /**
     * Returns details of an instrument
     *
     * @memberof Instruments
     * @param {string} id Instrument id.
     * @return {Promise<Object>} A promise to the instrument response.
     */
    get(id: string): Promise<any>;
    /**
     * Update details of an instrument
     *
     * @memberof Instruments
     * @param {string} id Instrument id.
     * @param {Object} body Instruments request body.
     * @return {Promise<Object>} A promise to the instrument response.
     */
    update(id: string, body: any): Promise<any>;
    /**
     * Delete a payment instrument.
     *
     * @memberof Instruments
     * @param {string} id Instrument id.
     * @return {Promise<Object>} A promise to the instrument response.
     */
    delete(id: string): Promise<any>;
    /**
     * Delete a payment instrument.
     *
     * @memberof Instruments
     * @param {string} country Country 2 character ISO.
     * @param {string} currency Currency 3 character ISO.
     * @return {Promise<Object>} A promise to the instrument response.
     */
    getBankAccountFieldFormatting(country: string, currency: string): Promise<any>;
}
//# sourceMappingURL=instruments.d.ts.map