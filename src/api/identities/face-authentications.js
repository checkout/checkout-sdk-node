import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';

/**
 * Class dealing with the /face-authentications endpoint
 *
 * @export
 * @class FaceAuthentications
 */
export default class FaceAuthentications {
    constructor(config) {
        this.config = config;
    }

    /**
     * Create a face authentication
     * [BETA]
     * Create a face authentication.
     * @method createFaceAuthentication
     * @param {Object} body - Request body
     * @returns {Promise<Object>} A promise to the Create a face authentication response
     */
    async createFaceAuthentication(body) {
        try {
            const url = `${this.config.identityVerificationUrl}/face-authentications`;
            const response = await post(
                this.config.httpClient,
                url,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }

    /**
     * Get a face authentication
     * [BETA]
     * Get the details of a face authentication.
     * @method getFaceAuthentication
     * @param {string} face_authentication_id - The face authentication's unique identifier
     * @returns {Promise<Object>} A promise to the Get a face authentication response
     */
    async getFaceAuthentication(face_authentication_id) {
        try {
            const url = `${this.config.identityVerificationUrl}/face-authentications/${face_authentication_id}`;
            const response = await get(
                this.config.httpClient,
                url,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }

    /**
     * Get face authentication attempts
     * [BETA]
     * Get the details of all attempts for a specific face authentication.
     * @method listAttempts
     * @param {string} face_authentication_id - The face authentication's unique identifier
     * @returns {Promise<Object>} A promise to the Get face authentication attempts response
     */
    async listAttempts(face_authentication_id) {
        try {
            const url = `${this.config.identityVerificationUrl}/face-authentications/${face_authentication_id}/attempts`;
            const response = await get(
                this.config.httpClient,
                url,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }

    /**
     * Get a face authentication attempt
     * [BETA]
     * Get the details of a specific attempt for a face authentication.
     * @method getAttempt
     * @param {string} face_authentication_id - The face authentication's unique identifier
     * @param {string} attempt_id - The attempt's unique identifier
     * @returns {Promise<Object>} A promise to the Get a face authentication attempt response
     */
    async getAttempt(face_authentication_id, attempt_id) {
        try {
            const url = `${this.config.identityVerificationUrl}/face-authentications/${face_authentication_id}/attempts/${attempt_id}`;
            const response = await get(
                this.config.httpClient,
                url,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }

    /**
     * Create a face authentication attempt
     * [BETA]
     * Create an attempt for a face authentication.
     * @method createAttempt
     * @param {string} face_authentication_id - The face authentication's unique identifier
     * @param {Object} body - Request body
     * @returns {Promise<Object>} A promise to the Create a face authentication attempt response
     */
    async createAttempt(face_authentication_id, body) {
        try {
            const url = `${this.config.identityVerificationUrl}/face-authentications/${face_authentication_id}/attempts`;
            const response = await post(
                this.config.httpClient,
                url,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }

    /**
     * Anonymize a face authentication
     * [BETA]
     * Remove the personal data in a face authentication.
     * @method anonymizeFaceAuthentication
     * @param {string} face_authentication_id - The face authentication's unique identifier
     * @returns {Promise<Object>} A promise to the Anonymize a face authentication response
     */
    async anonymizeFaceAuthentication(face_authentication_id) {
        try {
            const url = `${this.config.identityVerificationUrl}/face-authentications/${face_authentication_id}/anonymize`;
            const response = await post(
                this.config.httpClient,
                url,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }
}
