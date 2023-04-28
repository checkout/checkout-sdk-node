/**
 * Class dealing with the /apms/boleto endpoint
 *
 * @deprecated - Since version 2.1.2 - Should use Payments client instead
 * @export
 * @class Boleto
 */
export default class Boleto {
    constructor(config: any);
    config: any;
    /**
     * Succeed a Boleto payment
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @param {string} id Payment id.
     * @memberof Boleto
     * @return {Promise<Object>} A promise to the Boleto response.
     */
    succeed(id: string): Promise<any>;
    /**
     * Cancel Boleto payment
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @param {string} id Payment id.
     * @memberof Boleto
     * @return {Promise<Object>} A promise to the Boleto response.
     */
    expire(id: string): Promise<any>;
}
//# sourceMappingURL=boleto.d.ts.map