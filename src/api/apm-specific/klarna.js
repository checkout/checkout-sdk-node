import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';

// Path segments appended to the API base (config.host).
const CAPTURES_PATH = 'captures';
const CREDIT_SESSIONS_PATH = 'credit-sessions';
const KLARNA_EXTERNAL_PATH = 'klarna-external';
const KLARNA_PATH = 'klarna';
const ORDERS_PATH = 'orders';
const VOIDS_PATH = 'voids';

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
            ? `${this.config.host}/${KLARNA_EXTERNAL_PATH}/${CREDIT_SESSIONS_PATH}`
            : `${this.config.host}/${KLARNA_PATH}/${CREDIT_SESSIONS_PATH}`;
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
            throw await determineError(err);
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
            ? `${this.config.host}/${KLARNA_EXTERNAL_PATH}/${CREDIT_SESSIONS_PATH}/${id}`
            : `${this.config.host}/${KLARNA_PATH}/${CREDIT_SESSIONS_PATH}/${id}`;
        try {
            const response = await get(this.config.httpClient, url, this.config, this.config.sk);
            return await response.json;
        } catch (err) {
            throw await determineError(err);
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
            ? `${this.config.host}/${KLARNA_EXTERNAL_PATH}/${ORDERS_PATH}/${id}/${CAPTURES_PATH}`
            : `${this.config.host}/${KLARNA_PATH}/${ORDERS_PATH}/${id}/${CAPTURES_PATH}`;
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
            throw await determineError(err);
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
            ? `${this.config.host}/${KLARNA_EXTERNAL_PATH}/${ORDERS_PATH}/${id}/${VOIDS_PATH}`
            : `${this.config.host}/${KLARNA_PATH}/${ORDERS_PATH}/${id}/${VOIDS_PATH}`;
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
            throw await determineError(err);
        }
    }
}
