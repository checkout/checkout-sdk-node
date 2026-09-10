import { determineError } from '../../services/errors.js';
import { post } from '../../services/http.js';

// Path segments appended to the API base (config.host).
const AGENTIC_COMMERCE_PATH = 'agentic_commerce';
const DELEGATE_PAYMENT_PATH = 'delegate_payment';

/**
 * Class dealing with the /agentic_commerce endpoints (Beta).
 *
 * Used by AI agents to create delegated payment tokens scoped to a single purchase.
 *
 * @export
 * @class AgenticCommerce
 */
export default class AgenticCommerce {
    constructor(config) {
        this.config = config;
    }

    /**
     * Create a delegated payment token under the Agentic Commerce Protocol.
     *
     * Required body fields per swagger `DelegatedPaymentRequest`: payment_method,
     * allowance, risk_signals, metadata.
     *
     * @memberof AgenticCommerce
     * @param {Object} body Delegated payment request.
     * @param {Object} body.payment_method Card payment method (`DelegatedPaymentMethodCard`).
     * @param {Object} body.allowance Spend allowance (`DelegatedPaymentAllowance`).
     * @param {Object} [body.billing_address] Billing address (`DelegatedPaymentBillingAddress`).
     * @param {Array<Object>} body.risk_signals Risk signals (`DelegatedPaymentRiskSignal[]`).
     * @param {Object} body.metadata Key-value metadata.
     * @param {string} [idempotencyKey] Optional idempotency key.
     * @return {Promise<Object>} A promise to the delegated payment response.
     */
    async createDelegatedPaymentToken(body, idempotencyKey) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/${AGENTIC_COMMERCE_PATH}/${DELEGATE_PAYMENT_PATH}`,
                this.config,
                this.config.sk,
                body,
                idempotencyKey
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
