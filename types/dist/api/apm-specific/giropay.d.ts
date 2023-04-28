/**
 * Class dealing with the /giropay endpoint
 *
 * @deprecated - Since version 2.1.2 - Should use Payments client instead
 * @export
 * @class Giropay
 */
export default class Giropay {
    constructor(config: any);
    config: any;
    /**
     * Get Giropay EPS banks
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @memberof Giropay
     * @return {Promise<Object>} A promise to the banks response.
     */
    getEpsBanks(): Promise<any>;
    /**
     * Get Giropay banks
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @memberof Giropay
     * @return {Promise<Object>} A promise to the banks response.
     */
    getBanks(): Promise<any>;
}
//# sourceMappingURL=giropay.d.ts.map