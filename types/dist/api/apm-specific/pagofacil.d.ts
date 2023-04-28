/**
 * Class dealing with the /apms/pagofacil endpoint
 *
 * @deprecated - Since version 2.1.2 - Should use Payments client instead
 * @export
 * @class PagoFacil
 */
export default class PagoFacil {
    constructor(config: any);
    config: any;
    /**
     * Succeed a PagoFacil payment
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @param {string} id Payment id.
     * @memberof PagoFacil
     * @return {Promise<Object>} A promise to the PagoFacil response.
     */
    succeed(id: string): Promise<any>;
    /**
     * Cancel PagoFacil payment
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @param {string} id Payment id.
     * @memberof PagoFacil
     * @return {Promise<Object>} A promise to the PagoFacil response.
     */
    expire(id: string): Promise<any>;
}
//# sourceMappingURL=pagofacil.d.ts.map