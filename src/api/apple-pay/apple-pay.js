import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import http from '../../services/http';

/**
 * Class dealing with the Apple Pay api
 *
 * @export
 * @class Apple Pay
 */
export default class ApplePay {
    constructor(config) {
        this.config = config;
    }

    /**
     * Request an access token
     *
     * @param {Object} body Apple Pay object body.
     * @return {Promise<Object>} A promise to the Apple Pay response.
     */
    async upload(body) {
        try {
            const response = await http(fetch, this.config, {
                method: 'post',
                url: `${this.config.host}/applepay/certificates`,
                headers: { Authorization: this.config.pk },
                body,
            });
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Generate a certificate signing request
     *
     * @return {Promise<Object>} A promise to the Apple Pay response.
     */
    async generate() {
        try {
            const response = await http(fetch, this.config, {
                method: 'post',
                url: `${this.config.host}/applepay/signing-requests`,
                headers: { Authorization: this.config.pk },
            });
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
