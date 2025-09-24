import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';

/**
 * Class dealing with the /klarna and /klarna-external endpoint
 *
 * @export
 * @class Klarna
 */
export default class Klarna {
    constructor(config) {
        this.config = config;
    }

    /**
     * Create a session
     *
     * @param {Object} body Sessions details.
     * @return {Promise<Object>} A promise to the Klarna response.
     */
    async createSession(body) {
        const url = this.config.host.includes('sandbox')
            ? `${this.config.host}/klarna-external/credit-sessions`
            : `${this.config.host}/klarna/credit-sessions`;
        try {
            const response = await post(
                this.config.httpClient,
                url,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Get a session
     *
     * @param {string} id Session id.
     * @return {Promise<Object>} A promise to the Klarna response.
     */
    async getSession(id) {
        const url = this.config.host.includes('sandbox')
            ? `${this.config.host}/klarna-external/credit-sessions/${id}`
            : `${this.config.host}/klarna/credit-sessions/${id}`;
        try {
            const response = await get(this.config.httpClient, url, this.config, this.config.sk);
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Capture a klarna payment
     *
     * @param {string} id Payment id.
     * @param {Object} body Capture details.
     * @return {Promise<Object>} A promise to the Klarna response.
     */
    async capture(id, body) {
        const url = this.config.host.includes('sandbox')
            ? `${this.config.host}/klarna-external/orders/${id}/captures`
            : `${this.config.host}/klarna/orders/${id}/captures`;
        try {
            const response = await post(
                this.config.httpClient,
                url,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Void a klarna payment
     *
     * @param {string} id Payment id.
     * @param {Object} [body] Void details.
     * @return {Promise<Object>} A promise to the Klarna response.
     */
    async void(id, body) {
        const url = this.config.host.includes('sandbox')
            ? `${this.config.host}/klarna-external/orders/${id}/voids`
            : `${this.config.host}/klarna/orders/${id}/voids`;
        try {
            const response = await post(
                this.config.httpClient,
                url,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
