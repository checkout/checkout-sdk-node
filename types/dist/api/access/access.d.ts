/**
 * Class dealing with the access api
 *
 * @export
 * @class Access
 */
export default class Access {
    constructor(config: any);
    config: any;
    /**
     * Request an access token
     *
     * @param {Object} body Access object body.
     * @return {Promise<Object>} A promise to the Access response.
     */
    request(body: any): Promise<any>;
    /**
     * Update the access details in the config.
     *
     * @param {Object} body Access response body.
     * @return {Promise<Object>} A promise to the Access response.
     */
    updateAccessToken(body: any): Promise<any>;
}
//# sourceMappingURL=access.d.ts.map