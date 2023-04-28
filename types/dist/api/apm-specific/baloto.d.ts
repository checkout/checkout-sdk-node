/**
 * Class dealing with the /apms/baloto endpoint
 *
 * @deprecated - Since version 2.1.2 - Should use Payments client instead
 * @export
 * @class Baloto
 */
export default class Baloto {
    constructor(config: any);
    config: any;
    /**
     * Succeed a Baloto payment
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @param {string} id Payment id.
     * @memberof Baloto
     * @return {Promise<Object>} A promise to the Baloto response.
     */
    succeed(id: string): Promise<any>;
    /**
     * Cancel Baloto payment
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @param {string} id Payment id.
     * @memberof Baloto
     * @return {Promise<Object>} A promise to the Baloto response.
     */
    expire(id: string): Promise<any>;
}
//# sourceMappingURL=baloto.d.ts.map