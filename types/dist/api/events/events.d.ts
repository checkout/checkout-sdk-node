/**
 * Class dealing with the /events endpoint
 *
 * @export
 * @class Events
 */
export default class Events {
    constructor(config: any);
    config: any;
    /**
     * Retrieve a list of event types grouped by their respective version that you can
     * configure on your webhooks.
     *
     * @memberof Events
     * @param {string} version Events Version.
     * @return {Promise<Object>} A promise to the request events response.
     */
    retrieveEventTypes(version: string): Promise<any>;
    /**
     * Retrieves events ordered by the event date in descending order (latest first).
     * Results can be paged by specifying the skip and limit query parameters.
     *
     * @memberof Events
     * @param {Object} body Events request body.
     * @return {Promise<Object>} A promise to the request events response.
     */
    retrieveEvents(body: any): Promise<any>;
    /**
     * Retrieves the event with the specified identifier string. The event data includes the full event
     * details, the schema of which will vary based on the type.
     *
     * @memberof Events
     * @param {string} eventId Event id.
     * @return {Promise<Object>} A promise to the request event response.
     */
    retrieveEvent(eventId: string): Promise<any>;
    /**
     * Retrieves the attempts for a specific event notification
     *
     * @memberof Events
     * @param {Object} body Event request body.
     * @return {Promise<Object>} A promise to the request event notifications response.
     */
    retrieveEventNotification(body: any): Promise<any>;
    /**
     * Retries a specific webhook notification for the given event
     *
     * @memberof Events
     * @param {Object} body Event request body.
     * @return {Promise<Object>} A promise to the retry event response.
     */
    retry(body: any): Promise<any>;
    /**
     * Retries all webhook notifications configured for the specified event
     *
     * @memberof Events
     * @param {string} eventId Event id.
     * @return {Promise<Object>} A promise to the retry events response.
     */
    retryAll(eventId: string): Promise<any>;
}
//# sourceMappingURL=events.d.ts.map