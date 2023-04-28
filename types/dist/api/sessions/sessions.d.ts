/**
 * Class dealing with the /sessions endpoint
 *
 * @export
 * @class Sessions
 */
export default class Sessions {
    constructor(config: any);
    config: any;
    /**
     * Create a payment session to authenticate a cardholder before requesting a payment.
     *
     * @memberof Sessions
     * @param {Object} body Sessions request body.
     * @return {Promise<Object>} A promise to the sessions response.
     */
    request(body: any): Promise<any>;
    /**
     * Returns the details of the session with the specified identifier string.
     *
     * @memberof Sessions
     * @param {string} id Sessions id.
     * @param {string} channel Type of channnel.
     * @return {Promise<Object>} A promise to the sessions response.
     */
    get(id: string, channel: string): Promise<any>;
    /**
     * Update a session by providing information about the environment.
     *
     * @memberof Sessions
     * @param {string} id Sessions id.
     * @param {Object} body Sessions request body.
     * @return {Promise<Object>} A promise to the sessions response.
     */
    update(id: string, body: any): Promise<any>;
    /**
     * Completes a session by posting the the following request to the callback URL
     * (only relevant for non hosted sessions)
     *
     * @memberof Sessions
     * @param {string} id Sessions id.
     * @return {Promise<Object>} A promise to the sessions response.
     */
    complete(id: string): Promise<any>;
    /**
     * Completes a session by posting the the following request to the callback URL
     * (only relevant for non hosted sessions)
     *
     * @memberof Sessions
     * @param {string} id Sessions id.
     * @param {string} threeDsMethodCompletion 3DS Method completion indicator
     * @return {Promise<Object>} A promise to the sessions response.
     */
    update3DSMethodCompletionIndicator(id: string, threeDsMethodCompletion: string): Promise<any>;
}
//# sourceMappingURL=sessions.d.ts.map