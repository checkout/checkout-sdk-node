import { determineError } from '../../services/errors.js';
import { post } from '../../services/http.js';

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
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/applepay/certificates`,
                this.config,
                this.config.pk,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Generate a certificate signing request
     *
     * @return {Promise<Object>} A promise to the Apple Pay response.
     */
    async generate() {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/applepay/signing-requests`,
                this.config,
                this.config.pk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Enroll a domain to the Apple Pay Service
     *
     * @param {Object} body Apple Pay enrollment request body.
     * @return {Promise<void>} A promise that resolves when enrollment is successful (204 No Content).
     */
    async enroll(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/applepay/enrollments`,
                this.config,
                this.config.pk,
                body
            );
            // 204 No Content - return undefined
            if (response.status === 204) {
                return undefined;
            }
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
