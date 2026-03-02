import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';

/**
 * Class dealing with the /id-document-verifications endpoint
 *
 * @export
 * @class IDDocumentVerifications
 */
export default class IDDocumentVerifications {
    constructor(config) {
        this.config = config;
    }

    /**
     * Create an ID document verification
     * [BETA]
     * Create an ID document verification.
     * @method createIDDocumentVerification
     * @param {Object} body - Request body
     * @returns {Promise<Object>} A promise to the Create an ID document verification response
     */
    async createIDDocumentVerification(body) {
        try {
            const url = `${this.config.identityVerificationUrl}/id-document-verifications`;
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
     * Get an ID document verification
     * [BETA]
     * Get the details of an existing ID document verification.
     * @method getIDDocumentVerification
     * @param {string} id_document_verification_id - The ID document verification's unique identifier
     * @returns {Promise<Object>} A promise to the Get an ID document verification response
     */
    async getIDDocumentVerification(id_document_verification_id) {
        try {
            const url = `${this.config.identityVerificationUrl}/id-document-verifications/${id_document_verification_id}`;
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
     * Get ID document verification attempts
     * [BETA]
     * Get the details of all attempts for a specific ID document verification.
     * @method listAttempts
     * @param {string} id_document_verification_id - The ID document verification's unique identifier
     * @returns {Promise<Object>} A promise to the Get ID document verification attempts response
     */
    async listAttempts(id_document_verification_id) {
        try {
            const url = `${this.config.identityVerificationUrl}/id-document-verifications/${id_document_verification_id}/attempts`;
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
     * Get an ID document verification attempt
     * [BETA]
     * Get the details of a specific attempt for an ID document verification.
     * @method getAttempt
     * @param {string} id_document_verification_id - The ID document verification's unique identifier
     * @param {string} attempt_id - The attempt's unique identifier
     * @returns {Promise<Object>} A promise to the Get an ID document verification attempt response
     */
    async getAttempt(id_document_verification_id, attempt_id) {
        try {
            const url = `${this.config.identityVerificationUrl}/id-document-verifications/${id_document_verification_id}/attempts/${attempt_id}`;
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
     * Anonymize an ID document verification
     * [BETA]
     * Remove the personal data from an ID document verification.
     * @method anonymizeIDDocumentVerification
     * @param {string} id_document_verification_id - The ID document verification's unique identifier
     * @returns {Promise<Object>} A promise to the Anonymize an ID document verification response
     */
    async anonymizeIDDocumentVerification(id_document_verification_id) {
        try {
            const url = `${this.config.identityVerificationUrl}/id-document-verifications/${id_document_verification_id}/anonymize`;
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
     * Create an ID document verification attempt
     * [BETA]
     * Create an ID document verification attempt.
     * Images must not exceed 10MB in size and must be in JPEG, PDF, or PNG format.
     * @method createAttempt
     * @param {string} id_document_verification_id - The ID document verification's unique identifier
     * @param {Object} body - Request body
     * @returns {Promise<Object>} A promise to the Create an ID document verification attempt response
     */
    async createAttempt(id_document_verification_id, body) {
        try {
            const url = `${this.config.identityVerificationUrl}/id-document-verifications/${id_document_verification_id}/attempts`;
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
     * Get ID document verification report
     * [BETA]
     * Get the report for an ID document verification in PDF format.
     * The report is only available when the verification status is approved or declined.
     * @method getPDFReport
     * @param {string} id_document_verification_id - The ID document verification's unique identifier
     * @returns {Promise<Object>} A promise to the Get ID document verification report response
     */
    async getPDFReport(id_document_verification_id) {
        try {
            const url = `${this.config.identityVerificationUrl}/id-document-verifications/${id_document_verification_id}/pdf-report`;
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
}
