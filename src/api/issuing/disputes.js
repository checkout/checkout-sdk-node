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
     * Note: `is_ready_for_submission` was removed from the request body on
     * 2026-04-15 — the submission step is now handled automatically when a
     * dispute is created. Passing the field is silently ignored by the API.
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
     * @param {Object} [body] Escalation request params. Provide `fraud_details`
     *   when the dispute reason code is fraud-related.
     * @return {Promise<Object>} A promise to the escalation response.
     */
    async escalateDispute(disputeId, body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/issuing/disputes/${disputeId}/escalate`,
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
     * Amend an Issuing dispute.
     * [Beta] Amend an Issuing dispute when its status is `action_required`, to
     * respond to requested changes (for example, updating the reason, amount,
     * evidence, or fraud details).
     *
     * @memberof Disputes
     * @param {string} disputeId The dispute ID.
     * @param {Object} [body] Amend request params (`reason`, `amount`,
     *   `evidence`, `fraud_details`, `reason_change_justification`,
     *   `action_response`).
     * @return {Promise<Object>} A promise to the dispute response.
     */
    async amendDispute(disputeId, body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/issuing/disputes/${disputeId}/amend`,
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
     * Submit an Issuing dispute.
     *
     * @deprecated Deprecated by the Checkout.com API. Create an Issuing dispute
     *   (which creates and submits it in one step) instead, or use `amendDispute`
     *   when the dispute status is `action_required`.
     *
     * @memberof Disputes
     * @param {string} disputeId The dispute ID.
     * @param {Object} [body] Submission request params.
     * @return {Promise<Object>} A promise to the submission response.
     */
    async submitDispute(disputeId, body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/issuing/disputes/${disputeId}/submit`,
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
