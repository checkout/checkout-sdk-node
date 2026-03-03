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
     * Upload a payment processing certificate.
     * This will allow you to start processing payments via Apple Pay.
     *
     * @param {Object} body Apple Pay certificate request.
     * @param {string} body.content The payment processing certificate content.
     * @return {Promise<Object>} A promise to the Apple Pay certificate response.
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
     * Generate a certificate signing request.
     * You'll need to upload this to your Apple Developer account to download a payment processing certificate.
     *
     * @param {Object} body Apple Pay signing request (optional).
     * @param {string} [body.protocol_version] The protocol version (ec_v1 or rsa_v1). Default: ec_v1.
     * @return {Promise<Object>} A promise to the Apple Pay signing request response.
     */
    async generate(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/applepay/signing-requests`,
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
     * Enroll a domain to the Apple Pay Service.
     * Requires OAuth authentication with scope: vault:apme-enrollment
     *
     * @param {Object} body Apple Pay enrollment request.
     * @param {string} body.domain The domain to enroll (e.g., 'https://example.com').
     * @return {Promise<void>} A promise that resolves when enrollment is successful (204 No Content).
     */
    async enroll(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/applepay/enrollments`,
                this.config,
                null,
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
