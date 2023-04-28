/**
 * Class dealing with the /payments endpoint
 *
 * @export
 * @class Payments
 */
export default class Payments {
    constructor(config: any);
    config: any;
    /**
     * Sends payment or a payout requests.
     *
     * @memberof Payments
     * @param {Object} body Payment Request body.
     * @param {string} [idempotencyKey] Idempotency Key.
     * @return {Promise<Object>} A promise to payment response.
     */
    request(body: any, idempotencyKey?: string): Promise<any>;
    /**
     * Returns a list of your business' payments that match the specified reference.
     *
     * @memberof Payments
     * @param {Object} body /^(pay|sid)_(\w{26})$/ The payment or payment session identifier.
     * @return {Promise<Object>} A promise to the get payment response.
     */
    getPaymentList(body: any): Promise<any>;
    /**
     * Returns the details of the payment with the specified identifier string.
     *
     * @memberof Payments
     * @param {string} id /^(pay|sid)_(\w{26})$/ The payment or payment session identifier.
     * @return {Promise<Object>} A promise to the get payment response.
     */
    get(id: string): Promise<any>;
    /**
     * Returns all the actions associated with a payment ordered by processing date in
     * descending order (latest first).
     *
     * @memberof Payments
     * @param {string} id /^(pay)_(\w{26})$/ The payment identifier.
     * @return {Promise<Object>} A promise to the getActions response.
     */
    getActions(id: string): Promise<any>;
    /**
     * Request an incremental authorization to increase the authorization amount or extend
     * the authorization's validity period.
     *
     * @memberof Payments
     * @param {string} id /^(pay)_(\w{26})$/ The payment identifier.
     * @param {Object} body Payment Request body.
     * @return {Promise<Object>} A promise to the getActions response.
     */
    increment(id: string, body: any, idempotencyKey: any): Promise<any>;
    /**
     * Captures a payment if supported by the payment method.
     *
     * @memberof Payments
     * @param {string} paymentId /^(pay)_(\w{26})$/ The payment or payment session identifier.
     * @param {Object} [body] Capture request body.
     * @param {string} [idempotencyKey] Idempotency Key.
     * @return {Promise<Object>} A promise to the capture response.
     */
    capture(paymentId: string, body?: any, idempotencyKey?: string): Promise<any>;
    /**
     * Refunds a payment if supported by the payment method.
     *
     * @memberof Payments
     * @param {string} id /^(pay)_(\w{26})$/ The payment or payment session identifier.
     * @param {Object} [body] Refund request body.
     * @param {string} [idempotencyKey] Idempotency Key.
     * @return {Promise<Object>} A promise to the refund response.
     */
    refund(paymentId: any, body?: any, idempotencyKey?: string): Promise<any>;
    /**
     * Voids a payment if supported by the payment method.
     *
     * @memberof Payments
     * @param {string} id /^(pay)_(\w{26})$/ The payment or payment session identifier.
     * @param {Object} [body] Void request body.
     * @param {string} [idempotencyKey] Idempotency Key.
     * @return {Promise<Object>} A promise to the void response.
     */
    void(paymentId: any, body?: any, idempotencyKey?: string): Promise<any>;
}
//# sourceMappingURL=payments.d.ts.map