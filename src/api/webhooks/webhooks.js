import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import http from '../../services/http';

/**
 * Create and manage the webhook notifications you receive to keep up to date with
 * the status of your transactions.
 *
 * @export
 * @class Webhooks
 */
export default class Webhooks {
    constructor(config) {
        this.config = config;
    }

    /**
     * Retrieves the webhooks configured for the channel identified by your API key
     *
     * @memberof Webhooks
     * @return {Promise<Object>} A promise to the request webhooks response.
     */
    async retrieveWebhooks() {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'get',
                    url: `${this.config.host}/webhooks`,
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
     * Register a new webhook endpoint that Checkout.com will post all or selected events to
     *
     * @memberof Webhooks
     * @return {Promise<Object>} A promise to the register webhook response.
     */
    async registerWebhook(body) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'post',
                    url: `${this.config.host}/webhooks`,
                    headers: { Authorization: this.config.sk },
                    body,
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Retrieves the webhook with the specified identifier string
     *
     * @memberof Webhooks
     * @return {Promise<Object>} A promise to the retrieve webhook response.
     */
    async retrieveWebhook(id) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'get',
                    url: `${this.config.host}/webhooks/${id}`,
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
     * Updates an existing webhook
     *
     * @memberof Webhooks
     * @return {Promise<Object>} A promise to the update webhook response.
     */
    async updateWebhook(id, body) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'put',
                    url: `${this.config.host}/webhooks/${id}`,
                    headers: { Authorization: this.config.sk },
                    body,
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Updates all or some of the registered webhook details
     *
     * @memberof Webhooks
     * @return {Promise<Object>} A promise to the update webhook response.
     */
    async partiallyUpdateWebhook(id, body) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'patch',
                    url: `${this.config.host}/webhooks/${id}`,
                    headers: { Authorization: this.config.sk },
                    body,
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Removes an existing webhook
     *
     * @memberof Webhooks
     * @return {Promise<Object>} A promise to the remove webhook response.
     */
    async removeWebhook(id) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'delete',
                    url: `${this.config.host}/webhooks/${id}`,
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
