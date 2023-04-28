/**
 * Class dealing with the /risk endpoint
 *
 * @export
 * @class Risk
 */
export default class Risk {
    constructor(config: any);
    config: any;
    /**
     * Perform a pre-authentication fraud assessment using your defined risk settings.
     *
     * @memberof Risk
     * @param {Object} body Risk request body.
     * @return {Promise<Object>} A promise to the risk response.
     */
    requestPreAuthentication(body: any): Promise<any>;
    /**
     * Perform a pre-capture fraud assessment using your defined risk settings.
     *
     * @memberof Risk
     * @param {Object} body Risk request body.
     * @return {Promise<Object>} A promise to the risk response.
     */
    requestPreCapture(body: any): Promise<any>;
}
//# sourceMappingURL=risk.d.ts.map