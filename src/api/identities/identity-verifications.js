import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';
import { buildQueryParams } from '../../services/utils.js';

// Path segments appended to the API base (config.identityVerificationUrl).
const ANONYMIZE_PATH = 'anonymize';
const ASSETS_PATH = 'assets';
const ATTEMPTS_PATH = 'attempts';
const CREATE_AND_OPEN_IDV_PATH = 'create-and-open-idv';
const IDENTITY_VERIFICATIONS_PATH = 'identity-verifications';
const PDF_REPORT_PATH = 'pdf-report';

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
            const url = `${this.config.identityVerificationUrl}/${CREATE_AND_OPEN_IDV_PATH}`;
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
            const url = `${this.config.identityVerificationUrl}/${IDENTITY_VERIFICATIONS_PATH}`;
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
            const url = `${this.config.identityVerificationUrl}/${IDENTITY_VERIFICATIONS_PATH}/${identity_verification_id}`;
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
            const url = `${this.config.identityVerificationUrl}/${IDENTITY_VERIFICATIONS_PATH}/${identity_verification_id}/${ANONYMIZE_PATH}`;
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
            const url = `${this.config.identityVerificationUrl}/${IDENTITY_VERIFICATIONS_PATH}/${identity_verification_id}/${ATTEMPTS_PATH}`;
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
            const url = `${this.config.identityVerificationUrl}/${IDENTITY_VERIFICATIONS_PATH}/${identity_verification_id}/${ATTEMPTS_PATH}`;
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
            const url = `${this.config.identityVerificationUrl}/${IDENTITY_VERIFICATIONS_PATH}/${identity_verification_id}/${ATTEMPTS_PATH}/${attempt_id}`;
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
     * Get identity verification attempt assets
     * [BETA]
     * Get the assets (face images, videos, and document images) captured during an
     * identity verification attempt.
     * @method getAttemptAssets
     * @param {string} identity_verification_id - The identity verification's unique identifier
     * @param {string} attempt_id - The attempt's unique identifier
     * @param {Object} [params] - Optional pagination query parameters (skip and limit)
     * @returns {Promise<Object>} A promise to the Get identity verification attempt assets response
     */
    async getAttemptAssets(identity_verification_id, attempt_id, params) {
        try {
            const url = buildQueryParams(
                `${this.config.identityVerificationUrl}/${IDENTITY_VERIFICATIONS_PATH}/${identity_verification_id}/${ATTEMPTS_PATH}/${attempt_id}/${ASSETS_PATH}`,
                params
            );

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
            const url = `${this.config.identityVerificationUrl}/${IDENTITY_VERIFICATIONS_PATH}/${identity_verification_id}/${PDF_REPORT_PATH}`;
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
