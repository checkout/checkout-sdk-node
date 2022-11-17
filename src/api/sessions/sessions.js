import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import http from '../../services/http';

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
            const response = await http(fetch, this.config, {
                method: 'post',
                url: `${this.config.host}/sessions`,
                body,
                headers: { Authorization: this.config.sk },
            });

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
            const response = await http(fetch, this.config, {
                method: 'get',
                url: `${this.config.host}/sessions/${id}`,
                headers: { channel },
            });

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
            const response = await http(fetch, this.config, {
                method: 'put',
                url: `${this.config.host}/sessions/${id}/collect-data`,
                body,
            });

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
            const response = await http(fetch, this.config, {
                method: 'post',
                url: `${this.config.host}/sessions/${id}/complete`,
                headers: { Authorization: this.config.sk },
            });

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
            const response = await http(fetch, this.config, {
                method: 'put',
                url: `${this.config.host}/sessions/${id}/issuer-fingerprint`,
                body: {
                    three_ds_method_completion: threeDsMethodCompletion,
                },
            });

            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
