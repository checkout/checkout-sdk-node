/**
 * Class dealing with the /apms/oxxo endpoint
 *
 * @deprecated - Since version 2.1.2 - Should use Payments client instead
 * @export
 * @class Oxxo
 */
export default class Oxxo {
    constructor(config: any);
    config: any;
    /**
     * Succeed a Oxxo payment
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @param {string} id Payment id.
     * @memberof Oxxo
     * @return {Promise<Object>} A promise to the Oxxo response.
     */
    succeed(id: string): Promise<any>;
    /**
     * Cancel Oxxo payment
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @param {string} id Payment id.
     * @memberof Oxxo
     * @return {Promise<Object>} A promise to the Oxxo response.
     */
    expire(id: string): Promise<any>;
}
//# sourceMappingURL=oxxo.d.ts.map