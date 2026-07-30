import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';

/**
 * Class dealing with the /address-document-verifications endpoint
 *
 * @export
 * @class AddressDocumentVerifications
 */
export default class AddressDocumentVerifications {
    constructor(config) {
        this.config = config;
    }

    /**
     * Create an address document verification
     * [BETA]
     * Create an address document verification.
     * @method createAddressDocumentVerification
     * @param {Object} body - Request body
     * @returns {Promise<Object>} A promise to the Create an address document verification response
     */
    async createAddressDocumentVerification(body) {
        try {
            const url = `${this.config.identityVerificationUrl}/address-document-verifications`;
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
     * Get an address document verification
     * [BETA]
     * Get the details of an existing address document verification.
     * @method getAddressDocumentVerification
     * @param {string} address_document_verification_id - The address document verification's unique identifier
     * @returns {Promise<Object>} A promise to the Get an address document verification response
     */
    async getAddressDocumentVerification(address_document_verification_id) {
        try {
            const url = `${this.config.identityVerificationUrl}/address-document-verifications/${address_document_verification_id}`;
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
     * Get address document verification attempts
     * [BETA]
     * Get the details of all attempts for a specific address document verification.
     * @method listAttempts
     * @param {string} address_document_verification_id - The address document verification's unique identifier
     * @returns {Promise<Object>} A promise to the Get address document verification attempts response
     */
    async listAttempts(address_document_verification_id) {
        try {
            const url = `${this.config.identityVerificationUrl}/address-document-verifications/${address_document_verification_id}/attempts`;
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
     * Get an address document verification attempt
     * [BETA]
     * Get the details of a specific attempt for an address document verification.
     * @method getAttempt
     * @param {string} address_document_verification_id - The address document verification's unique identifier
     * @param {string} attempt_id - The attempt's unique identifier
     * @returns {Promise<Object>} A promise to the Get an address document verification attempt response
     */
    async getAttempt(address_document_verification_id, attempt_id) {
        try {
            const url = `${this.config.identityVerificationUrl}/address-document-verifications/${address_document_verification_id}/attempts/${attempt_id}`;
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
     * Anonymize an address document verification
     * [BETA]
     * Remove the personal data from an address document verification.
     * @method anonymizeAddressDocumentVerification
     * @param {string} address_document_verification_id - The address document verification's unique identifier
     * @returns {Promise<Object>} A promise to the Anonymize an address document verification response
     */
    async anonymizeAddressDocumentVerification(address_document_verification_id) {
        try {
            const url = `${this.config.identityVerificationUrl}/address-document-verifications/${address_document_verification_id}/anonymize`;
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
     * Create an address document verification attempt
     * [BETA]
     * Create an address document verification attempt.
     * @method createAttempt
     * @param {string} address_document_verification_id - The address document verification's unique identifier
     * @param {Object} body - Request body
     * @returns {Promise<Object>} A promise to the Create an address document verification attempt response
     */
    async createAttempt(address_document_verification_id, body) {
        try {
            const url = `${this.config.identityVerificationUrl}/address-document-verifications/${address_document_verification_id}/attempts`;
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
     * Get address document verification report
     * [BETA]
     * Get the report for an address document verification in PDF format.
     * @method getPDFReport
     * @param {string} address_document_verification_id - The address document verification's unique identifier
     * @returns {Promise<Object>} A promise to the Get address document verification report response
     */
    async getPDFReport(address_document_verification_id) {
        try {
            const url = `${this.config.identityVerificationUrl}/address-document-verifications/${address_document_verification_id}/pdf-report`;
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
