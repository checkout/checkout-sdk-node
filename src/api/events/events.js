import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import http from '../../services/http';

/**
 * Class dealing with the /events endpoint
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
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'get',
                    url,
                    headers: { Authorization: this.config.sk },
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Retrieves events ordered by the event date in descending order (latest first).
     * Results can be paged by specifying the skip and limit query parameters.
     *
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

            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'get',
                    url,
                    headers: { Authorization: this.config.sk },
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Retrieves the event with the specified identifier string. The event data includes the full event
     * details, the schema of which will vary based on the type.
     *
     * @memberof Events
     * @param {string} eventId Event id.
     * @return {Promise<Object>} A promise to the request event response.
     */
    async retrieveEvent(eventId) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'get',
                    url: `${this.config.host}/events/${eventId}`,
                    headers: { Authorization: this.config.sk },
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Retrieves the attempts for a specific event notification
     *
     * @memberof Events
     * @param {Object} body Event request body.
     * @return {Promise<Object>} A promise to the request event notifications response.
     */
    async retrieveEventNotification(body) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'get',
                    url: `${this.config.host}/events/${body.eventId}/notifications/${body.notificationId}`,
                    headers: { Authorization: this.config.sk },
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Retries a specific webhook notification for the given event
     *
     * @memberof Events
     * @param {Object} body Event request body.
     * @return {Promise<Object>} A promise to the retry event response.
     */
    async retry(body) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'post',
                    url: `${this.config.host}/events/${body.eventId}/webhooks/${body.webhookId}/retry`,
                    headers: { Authorization: this.config.sk },
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Retries all webhook notifications configured for the specified event
     *
     * @memberof Events
     * @param {string} eventId Event id.
     * @return {Promise<Object>} A promise to the retry events response.
     */
    async retryAll(eventId) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'post',
                    url: `${this.config.host}/events/${eventId}/webhooks/retry`,
                    headers: { Authorization: this.config.sk },
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
