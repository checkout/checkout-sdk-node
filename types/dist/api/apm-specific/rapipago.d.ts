/**
 * Class dealing with the /apms/rapipago endpoint
 *
 * @deprecated - Since version 2.1.2 - Should use Payments client instead
 * @export
 * @class Rapipago
 */
export default class Rapipago {
    constructor(config: any);
    config: any;
    /**
     * Succeed a Rapipago payment
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @param {string} id Payment id.
     * @memberof Rapipago
     * @return {Promise<Object>} A promise to the Rapipago response.
     */
    succeed(id: string): Promise<any>;
    /**
     * Cancel Rapipago payment
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @param {string} id Payment id.
     * @memberof Rapipago
     * @return {Promise<Object>} A promise to the Rapipago response.
     */
    expire(id: string): Promise<any>;
}
//# sourceMappingURL=rapipago.d.ts.map