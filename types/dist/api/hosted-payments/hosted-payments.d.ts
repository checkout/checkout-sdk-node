/**
 * Class dealing with the /hosted-payments endpoint
 *
 * @export
 * @class HostedPayments
 */
export default class HostedPayments {
    constructor(config: any);
    config: any;
    /**
     * Update details of a customer
     *
     * @memberof HostedPayments
     * @param {Object} body
     * @return {Promise<Object>} A promise to the Hosted Payment response.
     */
    create(body: any): Promise<any>;
    /**
     * Returns details of an instrument
     *
     * @memberof HostedPayments
     * @param {string} id Hosted payment id.
     * @return {Promise<Object>} A promise to the Hosted Payment response.
     */
    get(id: string): Promise<any>;
}
//# sourceMappingURL=hosted-payments.d.ts.map