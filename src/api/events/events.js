import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';

/**
 * Class dealing with the /events endpoint
 * @deprecated v2.x.x - Use Workflows API instead
 * @see Workflows
 *
 * @export
 * @class Events
 */
export default class Events {
    constructor(config) {
        this.config = config;
    }

    /**
     * Retrieve a list of event types grouped by their respective version that you can
     * configure on your webhooks.
     *
     * @deprecated v2.x.x - Use Workflows API instead
     * @memberof Events
     * @param {string} version Events Version.
     * @return {Promise<Object>} A promise to the request events response.
     */
    async retrieveEventTypes(version) {
        try {
            let url = `${this.config.host}/event-types`;
            if (version) {
                url += `?version=${version}`;
            }
            const response = await get(this.config.httpClient, url, this.config, this.config.sk);
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Retrieves events ordered by the event date in descending order (latest first).
     * Results can be paged by specifying the skip and limit query parameters.
     *
     * @deprecated v2.x.x - Use Workflows API instead
     * @memberof Events
     * @param {Object} body Events request body.
     * @return {Promise<Object>} A promise to the request events response.
     */
    async retrieveEvents(body) {
        try {
            let url = `${this.config.host}/events`;

            if (body) {
                const queryString = Object.keys(body)
                    .map((key) => `${key}=${body[key]}`)
                    .join('&');
                url += `?${queryString}`;
            }

            const response = await get(this.config.httpClient, url, this.config, this.config.sk);
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Retrieves the event with the specified identifier string. The event data includes the full event
     * details, the schema of which will vary based on the type.
     *
     * @deprecated v2.x.x - Use Workflows API instead
     * @memberof Events
     * @param {string} eventId Event id.
     * @return {Promise<Object>} A promise to the request event response.
     */
    async retrieveEvent(eventId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/events/${eventId}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Retrieves the attempts for a specific event notification
     *
     * @deprecated v2.x.x - Use Workflows API instead
     * @memberof Events
     * @param {Object} body Event request body.
     * @return {Promise<Object>} A promise to the request event notifications response.
     */
    async retrieveEventNotification(body) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/events/${body.eventId}/notifications/${body.notificationId}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Retries a specific webhook notification for the given event
     *
     * @deprecated v2.x.x - Use Workflows API instead
     * @memberof Events
     * @param {Object} body Event request body.
     * @return {Promise<Object>} A promise to the retry event response.
     */
    async retry(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/events/${body.eventId}/webhooks/${body.webhookId}/retry`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Retries all webhook notifications configured for the specified event
     *
     * @deprecated v2.x.x - Use Workflows API instead
     * @memberof Events
     * @param {string} eventId Event id.
     * @return {Promise<Object>} A promise to the retry events response.
     */
    async retryAll(eventId) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/events/${eventId}/webhooks/retry`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
