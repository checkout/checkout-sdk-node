/**
 * Class dealing with the /klarna and /klarna-external endpoint
 *
 * @export
 * @class Klarna
 */
export default class Klarna {
    constructor(config: any);
    config: any;
    /**
     * Create a session
     *
     * @param {Object} body Sessions details.
     * @return {Promise<Object>} A promise to the Klarna response.
     */
    createSession(body: any): Promise<any>;
    /**
     * Get a session
     *
     * @param {string} id Session id.
     * @return {Promise<Object>} A promise to the Klarna response.
     */
    getSession(id: string): Promise<any>;
    /**
     * Capture a klarna payment
     *
     * @param {string} id Payment id.
     * @param {Object} body Capture details.
     * @return {Promise<Object>} A promise to the Klarna response.
     */
    capture(id: string, body: any): Promise<any>;
    /**
     * Void a klarna payment
     *
     * @param {string} id Payment id.
     * @param {Object} [body] Void details.
     * @return {Promise<Object>} A promise to the Klarna response.
     */
    void(id: string, body?: any): Promise<any>;
}
//# sourceMappingURL=klarna.d.ts.map