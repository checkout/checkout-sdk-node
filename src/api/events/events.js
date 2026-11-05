import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';
import { buildQueryParams, encodePathSegment } from '../../services/utils.js';

// Path segments appended to the API base (config.host).
const EVENTS_PATH = 'events';
const EVENT_TYPES_PATH = 'event-types';
const NOTIFICATIONS_PATH = 'notifications';
const RETRY_PATH = 'retry';
const WEBHOOKS_PATH = 'webhooks';

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
            const url = buildQueryParams(
                `${this.config.host}/${EVENT_TYPES_PATH}`,
                version ? { version } : undefined
            );
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
            const url = buildQueryParams(`${this.config.host}/${EVENTS_PATH}`, body);

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
     * @throws {ValueError} If eventId is undefined, empty, "." or "..".
     */
    async retrieveEvent(eventId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/${EVENTS_PATH}/${encodePathSegment(eventId, 'eventId')}`,
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
     * @throws {ValueError} If body.eventId or body.notificationId is undefined, empty, "." or "..".
     */
    async retrieveEventNotification(body) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/${EVENTS_PATH}/${encodePathSegment(body.eventId, 'eventId')}/${NOTIFICATIONS_PATH}/${encodePathSegment(body.notificationId, 'notificationId')}`,
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
     * @throws {ValueError} If body.eventId or body.webhookId is undefined, empty, "." or "..".
     */
    async retry(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/${EVENTS_PATH}/${encodePathSegment(body.eventId, 'eventId')}/${WEBHOOKS_PATH}/${encodePathSegment(body.webhookId, 'webhookId')}/${RETRY_PATH}`,
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
     * @throws {ValueError} If eventId is undefined, empty, "." or "..".
     */
    async retryAll(eventId) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/${EVENTS_PATH}/${encodePathSegment(eventId, 'eventId')}/${WEBHOOKS_PATH}/${RETRY_PATH}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
