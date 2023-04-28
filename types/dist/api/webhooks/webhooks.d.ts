/**
 * Create and manage the webhook notifications you receive to keep up to date with
 * the status of your transactions.
 *
 * @export
 * @class Webhooks
 */
export default class Webhooks {
    constructor(config: any);
    config: any;
    /**
     * Retrieves the webhooks configured for the channel identified by your API key
     *
     * @memberof Webhooks
     * @return {Promise<Object>} A promise to the request webhooks response.
     */
    retrieveWebhooks(): Promise<any>;
    /**
     * Register a new webhook endpoint that Checkout.com will post all or selected events to
     *
     * @memberof Webhooks
     * @return {Promise<Object>} A promise to the register webhook response.
     */
    registerWebhook(body: any): Promise<any>;
    /**
     * Retrieves the webhook with the specified identifier string
     *
     * @memberof Webhooks
     * @return {Promise<Object>} A promise to the retrieve webhook response.
     */
    retrieveWebhook(id: any): Promise<any>;
    /**
     * Updates an existing webhook
     *
     * @memberof Webhooks
     * @return {Promise<Object>} A promise to the update webhook response.
     */
    updateWebhook(id: any, body: any): Promise<any>;
    /**
     * Updates all or some of the registered webhook details
     *
     * @memberof Webhooks
     * @return {Promise<Object>} A promise to the update webhook response.
     */
    partiallyUpdateWebhook(id: any, body: any): Promise<any>;
    /**
     * Removes an existing webhook
     *
     * @memberof Webhooks
     * @return {Promise<Object>} A promise to the remove webhook response.
     */
    removeWebhook(id: any): Promise<any>;
}
//# sourceMappingURL=webhooks.d.ts.map