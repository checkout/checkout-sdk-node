import {
    IDENTITY_VERIFICATION_LIVE_URL,
    IDENTITY_VERIFICATION_SANDBOX_URL
} from '../../config.js';
import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';

/**
 * Class dealing with the /identity-verifications endpoint
 *
 * @export
 * @class IdentityVerifications
 */
export default class IdentityVerifications {
    constructor(config) {
        this.config = config;
    }

    /**
     * Create an identity verification and attempt
     * [BETA]
     * Create an identity verification and an initial attempt.
     * @method createAndStartIdentityVerification
     * @param {Object} body - Request body
     * @returns {Promise<Object>} A promise to the Create an identity verification and attempt response
     */
    async createAndStartIdentityVerification(body) {
        try {
            const url = `${
                this.config.host.includes('sandbox') ? IDENTITY_VERIFICATION_SANDBOX_URL : IDENTITY_VERIFICATION_LIVE_URL
            }/create-and-open-idv`;
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
     * Create an identity verification
     * [BETA]
     * Create an identity verification linked to an applicant.
     * @method createIdentityVerification
     * @param {Object} body - Request body
     * @returns {Promise<Object>} A promise to the Create an identity verification response
     */
    async createIdentityVerification(body) {
        try {
            const url = `${
                this.config.host.includes('sandbox') ? IDENTITY_VERIFICATION_SANDBOX_URL : IDENTITY_VERIFICATION_LIVE_URL
            }/identity-verifications`;
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
     * Get an identity verification
     * [BETA]
     * Get the details of an existing identity verification.
     * @method getIdentityVerification
     * @param {string} identity_verification_id - The identity verification's unique identifier
     * @returns {Promise<Object>} A promise to the Get an identity verification response
     */
    async getIdentityVerification(identity_verification_id) {
        try {
            const url = `${
                this.config.host.includes('sandbox') ? IDENTITY_VERIFICATION_SANDBOX_URL : IDENTITY_VERIFICATION_LIVE_URL
            }/identity-verifications/${identity_verification_id}`;
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
     * Anonymize an identity verification
     * [BETA]
     * Remove the personal data in an identity verification.
     * @method anonymizeIdentityVerification
     * @param {string} identity_verification_id - The identity verification's unique identifier
     * @returns {Promise<Object>} A promise to the Anonymize an identity verification response
     */
    async anonymizeIdentityVerification(identity_verification_id) {
        try {
            const url = `${
                this.config.host.includes('sandbox') ? IDENTITY_VERIFICATION_SANDBOX_URL : IDENTITY_VERIFICATION_LIVE_URL
            }/identity-verifications/${identity_verification_id}/anonymize`;
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

    /**
     * Create an identity verification attempt
     * [BETA]
     * Create a new attempt for an identity verification.
     * @method createAttempt
     * @param {string} identity_verification_id - The identity verification's unique identifier
     * @param {Object} body - Request body
     * @returns {Promise<Object>} A promise to the Create an identity verification attempt response
     */
    async createAttempt(identity_verification_id, body) {
        try {
            const url = `${
                this.config.host.includes('sandbox') ? IDENTITY_VERIFICATION_SANDBOX_URL : IDENTITY_VERIFICATION_LIVE_URL
            }/identity-verifications/${identity_verification_id}/attempts`;
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
     * Get identity verification attempts
     * [BETA]
     * Get all the attempts for a specific identity verification.
     * @method listAttempts
     * @param {string} identity_verification_id - The identity verification's unique identifier
     * @returns {Promise<Object>} A promise to the Get identity verification attempts response
     */
    async listAttempts(identity_verification_id) {
        try {
            const url = `${
                this.config.host.includes('sandbox') ? IDENTITY_VERIFICATION_SANDBOX_URL : IDENTITY_VERIFICATION_LIVE_URL
            }/identity-verifications/${identity_verification_id}/attempts`;
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
     * Get an identity verification attempt
     * [BETA]
     * Get the details of a specific attempt for an identity verification.
     * @method getAttempt
     * @param {string} identity_verification_id - The identity verification's unique identifier
     * @param {string} attempt_id - The attempt's unique identifier
     * @returns {Promise<Object>} A promise to the Get an identity verification attempt response
     */
    async getAttempt(identity_verification_id, attempt_id) {
        try {
            const url = `${
                this.config.host.includes('sandbox') ? IDENTITY_VERIFICATION_SANDBOX_URL : IDENTITY_VERIFICATION_LIVE_URL
            }/identity-verifications/${identity_verification_id}/attempts/${attempt_id}`;
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
     * Get identity verification report
     * [BETA]
     * Get the report with the full details of an identity verification in PDF format.
     * The report is only available when the verification status is approved or declined.
     * @method getPDFReport
     * @param {string} identity_verification_id - The identity verification's unique identifier
     * @returns {Promise<Buffer>} A promise to the PDF report as a Buffer
     */
    async getPDFReport(identity_verification_id) {
        try {
            const url = `${
                this.config.host.includes('sandbox') ? IDENTITY_VERIFICATION_SANDBOX_URL : IDENTITY_VERIFICATION_LIVE_URL
            }/identity-verifications/${identity_verification_id}/pdf-report`;
            const response = await get(
                this.config.httpClient,
                url,
                { ...this.config, csv: true },
                this.config.sk
            );
            return await response.csv;
        } catch (error) {
            throw await determineError(error);
        }
    }
}
