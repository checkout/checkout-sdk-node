import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';

// Path segments appended to the API base (config.identityVerificationUrl).
const ANONYMIZE_PATH = 'anonymize';
const ATTEMPTS_PATH = 'attempts';
const ID_DOCUMENT_VERIFICATIONS_PATH = 'id-document-verifications';
const PDF_REPORT_PATH = 'pdf-report';

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
            const url = `${this.config.identityVerificationUrl}/${ID_DOCUMENT_VERIFICATIONS_PATH}`;
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
            const url = `${this.config.identityVerificationUrl}/${ID_DOCUMENT_VERIFICATIONS_PATH}/${id_document_verification_id}`;
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
            const url = `${this.config.identityVerificationUrl}/${ID_DOCUMENT_VERIFICATIONS_PATH}/${id_document_verification_id}/${ATTEMPTS_PATH}`;
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
            const url = `${this.config.identityVerificationUrl}/${ID_DOCUMENT_VERIFICATIONS_PATH}/${id_document_verification_id}/${ATTEMPTS_PATH}/${attempt_id}`;
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
            const url = `${this.config.identityVerificationUrl}/${ID_DOCUMENT_VERIFICATIONS_PATH}/${id_document_verification_id}/${ANONYMIZE_PATH}`;
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
            const url = `${this.config.identityVerificationUrl}/${ID_DOCUMENT_VERIFICATIONS_PATH}/${id_document_verification_id}/${ATTEMPTS_PATH}`;
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
            const url = `${this.config.identityVerificationUrl}/${ID_DOCUMENT_VERIFICATIONS_PATH}/${id_document_verification_id}/${PDF_REPORT_PATH}`;
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
