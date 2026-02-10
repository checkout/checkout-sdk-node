import {
    IDENTITY_VERIFICATION_LIVE_URL,
    IDENTITY_VERIFICATION_SANDBOX_URL
} from '../../config.js';
import { determineError } from '../../services/errors.js';
import { get, post, patch } from '../../services/http.js';

/**
 * Class dealing with the /applicants endpoint (Identity Verification)
 *
 * @export
 * @class Applicants
 */
export default class Applicants {
    constructor(config) {
        this.config = config;
    }

    /**
     * Create an applicant
     * Create a profile for an Identities applicant.
     * @method createApplicant
     * @param {Object} body - Request body
     * @returns {Promise<Object>} A promise to the Create an applicant response
     */
    async createApplicant(body) {
        try {
            const url = `${
                this.config.host.includes('sandbox') ? IDENTITY_VERIFICATION_SANDBOX_URL : IDENTITY_VERIFICATION_LIVE_URL
            }/applicants`;
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
     * Get an applicant
     * Get the details of an applicant profile.
     * @method getApplicant
     * @param {string} applicantId - The applicant profile's unique identifier
     * @returns {Promise<Object>} A promise to the Get an applicant response
     */
    async getApplicant(applicantId) {
        try {
            const url = `${
                this.config.host.includes('sandbox') ? IDENTITY_VERIFICATION_SANDBOX_URL : IDENTITY_VERIFICATION_LIVE_URL
            }/applicants/${applicantId}`;
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
     * Update an applicant
     * Update the details of an applicant profile.
     * @method updateApplicant
     * @param {string} applicantId - The applicant profile's unique identifier
     * @param {Object} body - Request body
     * @returns {Promise<Object>} A promise to the Update an applicant response
     */
    async updateApplicant(applicantId, body) {
        try {
            const url = `${
                this.config.host.includes('sandbox') ? IDENTITY_VERIFICATION_SANDBOX_URL : IDENTITY_VERIFICATION_LIVE_URL
            }/applicants/${applicantId}`;
            const response = await patch(
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
     * Anonymize an applicant
     * Remove the personal data in an applicant profile.
     * @method anonymizeApplicant
     * @param {string} applicantId - The applicant profile's unique identifier
     * @returns {Promise<Object>} A promise to the Anonymize an applicant response
     */
    async anonymizeApplicant(applicantId) {
        try {
            const url = `${
                this.config.host.includes('sandbox') ? IDENTITY_VERIFICATION_SANDBOX_URL : IDENTITY_VERIFICATION_LIVE_URL
            }/applicants/${applicantId}/anonymize`;
            const response = await post(
                this.config.httpClient,
                url,
                this.config,
                this.config.sk,
                {}
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }
}
