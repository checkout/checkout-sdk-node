import { determineError } from '../../services/errors.js';
import { post } from '../../services/http.js';

// Path segments appended to the API base (config.host).
const ASSESSMENTS_PATH = 'assessments';
const PRE_AUTHENTICATION_PATH = 'pre-authentication';
const PRE_CAPTURE_PATH = 'pre-capture';
const RISK_PATH = 'risk';

/**
 * Class dealing with the /risk endpoint
 * @deprecated v2.x.x - Use Risk Assessment API instead
 *
 * @export
 * @class Risk
 */
export default class Risk {
    constructor(config) {
        this.config = config;
    }

    /**
     * Perform a pre-authentication fraud assessment using your defined risk settings.
     *
     * @memberof Risk
     * @param {Object} body Risk request body.
     * @return {Promise<Object>} A promise to the risk response.
     */
    async requestPreAuthentication(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/${RISK_PATH}/${ASSESSMENTS_PATH}/${PRE_AUTHENTICATION_PATH}`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Perform a pre-capture fraud assessment using your defined risk settings.
     *
     * @memberof Risk
     * @param {Object} body Risk request body.
     * @return {Promise<Object>} A promise to the risk response.
     */
    async requestPreCapture(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/${RISK_PATH}/${ASSESSMENTS_PATH}/${PRE_CAPTURE_PATH}`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
