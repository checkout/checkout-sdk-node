import {
    IDENTITY_VERIFICATION_LIVE_URL,
    IDENTITY_VERIFICATION_SANDBOX_URL
} from '../../config.js';
import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';

/**
 * Class dealing with the /aml-screenings endpoint (AML Screening)
 *
 * @export
 * @class AMLScreenings
 */
export default class AMLScreenings {
    constructor(config) {
        this.config = config;
    }

    /**
     * Create an AML screening
     * [BETA]
     * Create an AML screening.
     * @method createAMLVerification
     * @param {Object} body - Request body
     * @returns {Promise<Object>} A promise to the Create an AML screening response
     */
    async createAMLVerification(body) {
        try {
            const url = `${
                this.config.host.includes('sandbox') ? IDENTITY_VERIFICATION_SANDBOX_URL : IDENTITY_VERIFICATION_LIVE_URL
            }/aml-verifications`;
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
     * Get an AML screening
     * Get the detailed result of an AML screening.
     * @method getAMLScreening
     * @param {string} aml_screening_id - The AML screening's unique identifier
     * @returns {Promise<Object>} A promise to the Get an AML screening response
     */
    async getAMLScreening(aml_screening_id) {
        try {
            const url = `${
                this.config.host.includes('sandbox') ? IDENTITY_VERIFICATION_SANDBOX_URL : IDENTITY_VERIFICATION_LIVE_URL
            }/aml-verifications/${aml_screening_id}`;
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
