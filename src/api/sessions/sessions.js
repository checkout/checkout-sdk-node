import { determineError } from '../../services/errors';
import { get, post, put } from '../../services/http';

/**
 * Class dealing with the /sessions endpoint
 *
 * @export
 * @class Sessions
 */
export default class Sessions {
    constructor(config) {
        this.config = config;
    }

    /**
     * Create a payment session to authenticate a cardholder before requesting a payment.
     *
     * @memberof Sessions
     * @param {Object} body Sessions request body.
     * @return {Promise<Object>} A promise to the sessions response.
     */
    async request(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/sessions`,
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
     * Returns the details of the session with the specified identifier string.
     *
     * @memberof Sessions
     * @param {string} id Sessions id.
     * @param {string} channel Type of channnel.
     * @return {Promise<Object>} A promise to the sessions response.
     */
    async get(id, channel) {
        try {
            this.config.headers = { ...this.config.headers, channel };

            const response = await get(
                this.config.httpClient,
                `${this.config.host}/sessions/${id}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Update a session by providing information about the environment.
     *
     * @memberof Sessions
     * @param {string} id Sessions id.
     * @param {Object} body Sessions request body.
     * @return {Promise<Object>} A promise to the sessions response.
     */
    async update(id, body) {
        try {
            const response = await put(
                this.config.httpClient,
                `${this.config.host}/sessions/${id}/collect-data`,
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
     * Completes a session by posting the the following request to the callback URL
     * (only relevant for non hosted sessions)
     *
     * @memberof Sessions
     * @param {string} id Sessions id.
     * @return {Promise<Object>} A promise to the sessions response.
     */
    async complete(id) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/sessions/${id}/complete`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Completes a session by posting the the following request to the callback URL
     * (only relevant for non hosted sessions)
     *
     * @memberof Sessions
     * @param {string} id Sessions id.
     * @param {string} threeDsMethodCompletion 3DS Method completion indicator
     * @return {Promise<Object>} A promise to the sessions response.
     */
    async update3DSMethodCompletionIndicator(id, threeDsMethodCompletion) {
        try {
            const body = {
                three_ds_method_completion: threeDsMethodCompletion,
            };

            const response = await put(
                this.config.httpClient,
                `${this.config.host}/sessions/${id}/issuer-fingerprint`,
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
