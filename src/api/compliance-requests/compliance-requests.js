import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';

/**
 * Class dealing with the /compliance-requests endpoints.
 *
 * @export
 * @class ComplianceRequests
 */
export default class ComplianceRequests {
    constructor(config) {
        this.config = config;
    }

    /**
     * Retrieve a compliance request raised against a payment.
     *
     * @memberof ComplianceRequests
     * @param {string} paymentId The payment id whose compliance request to fetch.
     * @return {Promise<Object>} A promise to the compliance request response.
     */
    async getComplianceRequest(paymentId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/compliance-requests/${paymentId}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Respond to a compliance request.
     *
     * Body per swagger `ComplianceRequestResponse`:
     *  - fields: { sender: [{ name, value, not_available }], recipient: [...] }
     *  - comments: optional free-text
     *
     * @memberof ComplianceRequests
     * @param {string} paymentId The payment id whose compliance request to respond to.
     * @param {Object} body Compliance response body.
     * @return {Promise<Object>} A promise to the response.
     */
    async respondToComplianceRequest(paymentId, body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/compliance-requests/${paymentId}`,
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
