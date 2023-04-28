/**
 * Class dealing with the Apple Pay api
 *
 * @export
 * @class Apple Pay
 */
export default class ApplePay {
    constructor(config: any);
    config: any;
    /**
     * Request an access token
     *
     * @param {Object} body Apple Pay object body.
     * @return {Promise<Object>} A promise to the Apple Pay response.
     */
    upload(body: any): Promise<any>;
    /**
     * Generate a certificate signing request
     *
     * @return {Promise<Object>} A promise to the Apple Pay response.
     */
    generate(): Promise<any>;
}
//# sourceMappingURL=apple-pay.d.ts.map