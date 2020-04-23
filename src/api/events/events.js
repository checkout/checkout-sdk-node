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
     * @param {Object} body Events request body.
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
                { timeout: this.config.timeout },
                {
                    method: 'get',
                    url: url,
                    headers: { Authorization: this.config.sk }
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
                var queryString = Object.keys(body)
                    .map(key => key + '=' + body[key])
                    .join('&');
                url += '?' + queryString;
            }

            console.log(url);

            const response = await http(
                fetch,
                { timeout: this.config.timeout },
                {
                    method: 'get',
                    url: url,
                    headers: { Authorization: this.config.sk }
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
