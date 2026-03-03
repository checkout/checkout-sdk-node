import { get, post } from '../../services/http.js';
import { determineError } from '../../services/errors.js';

/**
 * Disputes class for managing dispute operations
 *
 * @export
 * @class Disputes
 */
export default class Disputes {
    constructor(config) {
        this.config = config;
    }

    /**
     * Create an Issuing dispute.
     * [Beta] Create a dispute for an Issuing transaction. The transaction must already be cleared and not refunded.
     * For full guidance, see https://www.checkout.com/docs/card-issuing/manage-cardholder-transactions/manage-issuing-disputes
     *
     * @memberof Disputes
     * @param {Object} body Dispute request params.
     * @return {Promise<Object>} A promise to the dispute response.
     */
    async createDispute(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/issuing/disputes`,
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
     * Get an Issuing dispute.
     * [Beta] Retrieve the details of an Issuing dispute.
     *
     * @memberof Disputes
     * @param {string} disputeId The dispute ID.
     * @return {Promise<Object>} A promise to the dispute details.
     */
    async getDispute(disputeId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/issuing/disputes/${disputeId}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Cancel an Issuing dispute.
     * [Beta] Cancel an Issuing dispute. If you decide not to proceed with a dispute, you can cancel it either:
     * (1) Before you submit it, or (2) While the dispute status is processing and status_reason is chargeback_pending or chargeback_processed.
     *
     * @memberof Disputes
     * @param {string} disputeId The dispute ID.
     * @return {Promise<Object>} A promise to the cancellation response.
     */
    async cancelDispute(disputeId) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/issuing/disputes/${disputeId}/cancel`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Escalate an Issuing dispute.
     * [Beta] Escalate an Issuing dispute to pre-arbitration or arbitration.
     *
     * @memberof Disputes
     * @param {string} disputeId The dispute ID.
     * @return {Promise<Object>} A promise to the escalation response.
     */
    async escalateDispute(disputeId) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/issuing/disputes/${disputeId}/escalate`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Submit an Issuing dispute.
     * [Beta] Submit an Issuing dispute to the card scheme for processing.
     *
     * @memberof Disputes
     * @param {string} disputeId The dispute ID.
     * @return {Promise<Object>} A promise to the submission response.
     */
    async submitDispute(disputeId) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/issuing/disputes/${disputeId}/submit`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
