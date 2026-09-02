 
import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';
import { setSourceOrDestinationType, validatePayment } from '../../services/validation.js';

const addUtilityParams = (json) => {
    if (!json || typeof json !== 'object') return json;
    let requiresRedirect = false;

    if (json.destination) {
        requiresRedirect = false;
    } else {
        const isPending = json.status === 'Pending';
        const hasRedirectUrl = json._links && json._links.redirect !== undefined;
        requiresRedirect = isPending && hasRedirectUrl;
    }

    // If the redirection URL exists add it to the response body as 'redirectLink'
    let redirectLink;
    if (requiresRedirect && json._links && json._links.redirect) {
        redirectLink = json._links.redirect.href;
    }
    return {
        ...json,
        requiresRedirect,
        redirectLink,
    };
};

/**
 * Class dealing with the /payments endpoint
 *
 * @export
 * @class Payments
 */
export default class Payments {
    constructor(config) {
        this.config = config;
    }

    /**
     * Sends payment or a payout request.
     *
     * Notable optional fields (swagger PaymentRequest, 2026-04 → 2026-06):
     *  - body.source — supports BLIK via `{ type: 'blik', ... }` per
     *    `PaymentRequestBlikSource` (2026-05-08), and Bacs Direct Debit via
     *    `{ type: 'bacs', id: 'src_...' }` per `PaymentRequestBacsSource`
     *    (2026-07-30) — both fields required. Pass `type` explicitly: with `type`
     *    omitted, `setSourceOrDestinationType` infers `id` (not `bacs`) from a
     *    `src_`-prefixed id. The `bacs` source echoes back as
     *    `PaymentGetResponseBacsSource` (`type` + `id`) on retrieval.
     *  - body.source — SEPA Direct Debit via `{ type: 'sepa', ... }` per
     *    `PaymentRequestSEPAV4Source` (2026-07-30). Required: `type`, `country`,
     *    `account_number` (the IBAN), `currency` and `account_holder`, whose
     *    `billing_address` is itself required with all five of `address_line1`,
     *    `address_line2`, `city`, `zip` and `country`. Optional: `mandate_id`,
     *    `date_of_signature` (`yyyy-MM-dd`) and `mandate_type` — `Core` or `B2B`,
     *    capitalised. `account_holder` also takes optional `first_name`, `last_name`,
     *    `company_name` and `type`. **Send `account_holder.type` lowercase**
     *    (`individual` / `corporate`). The swagger declares it capitalised
     *    (`Individual` / `Corporate`) at this one site, but that looks like a spec
     *    defect: the other 23 account-holder-type sites in the specification are all
     *    lowercase - including the sibling `PaymentRequestAchSource` - and every other
     *    Checkout.com SDK sends lowercase here. Pending confirmation from the API
     *    owners, lowercase is the safe value. Note this source carries no `bank_code`.
     *  - body.fallback_source — alternate source attempted if the primary source
     *    fails (2026-04-23).
     *  - body.processing.affiliate_id / processing.affiliate_url — affiliate
     *    tracking, surfaced under `processing` (2026-05-07).
     *  - body.payment_plan, body.authorization_type — present on
     *    HostedPayments/PaymentLinks/PaymentSessions variants (2026-06-08).
     *  - body.3ds.challenge_indicator — four values only (default
     *    `no_preference`): `no_preference`, `no_challenge_requested`,
     *    `challenge_requested`, `challenge_requested_mandate`. The exemption
     *    values (`low_value`, `trusted_listing`, `trusted_listing_prompt`,
     *    `transaction_risk_assessment`, `data_share`) are accepted only by
     *    `cko.sessions.request` and are rejected here.
     *
     * Response fields newly available under `processing` (pass-through):
     *  - scheme_transaction_link_id (Mastercard Transaction Link Identifier, 2026-06-08)
     *  - scheme (2026-06-02), failure_code, partner_code, partner_response_code (2026-05-08)
     *  - fallback_source_used (2026-04-23)
     *
     * @memberof Payments
     * @param {Object} body Payment Request body.
     * @param {string} [idempotencyKey] Idempotency Key.
     * @return {Promise<Object>} A promise to payment response.
     */
    async request(body, idempotencyKey) {
        try {
            setSourceOrDestinationType(body);
            validatePayment(body);

            const response = await post(
                this.config.httpClient,
                `${this.config.host}/payments`,
                this.config,
                this.config.sk,
                body,
                idempotencyKey
            );
            return addUtilityParams(await response.json);
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Returns a list of your business' payments that match the specified reference.
     *
     * @memberof Payments
     * @param {Object} body /^(pay|sid)_(\w{26})$/ The payment or payment session identifier.
     * @return {Promise<Object>} A promise to the get payment response.
     */
    async getPaymentList(body) {
        let url = `${this.config.host}/payments`;

        if (body) {
            const queryString = Object.keys(body)
                .map((key) => `${key}=${body[key]}`)
                .join('&');
            url += `?${queryString}`;
        }

        try {
            const response = await get(this.config.httpClient, url, this.config, this.config.sk);
            return response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Returns the details of the payment with the specified identifier string.
     *
     * Response fields available under `processing` (pass-through, swagger ProcessingData):
     *  - scheme — the scheme on which the payment was authorized, which may differ from the
     *    card's scheme if the card is co-badged (2026-06-02)
     *  - partner_fraud_status — partner fraud status; if `Pending` and the merchant captures
     *    before it changes to `Accepted`, the transaction risk is solely on the merchant
     *  - partner_merchant_advice_code — Mastercard Merchant Advice Code (MAC), with retry
     *    guidance for declined transactions
     *  - scheme_transaction_link_id (Mastercard Transaction Link Identifier, 2026-06-08)
     *  - failure_code, partner_code, partner_response_code (2026-05-08)
     *  - fallback_source_used (2026-04-23)
     *
     * @memberof Payments
     * @param {string} id /^(pay|sid)_(\w{26})$/ The payment or payment session identifier.
     * @return {Promise<Object>} A promise to the get payment response.
     */
    async get(id) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/payments/${id}`,
                this.config,
                this.config.sk
            );
            return response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Returns all the actions associated with a payment ordered by processing date in
     * descending order (latest first).
     *
     * @memberof Payments
     * @param {string} id /^(pay)_(\w{26})$/ The payment identifier.
     * @return {Promise<Object>} A promise to the getActions response.
     */
    async getActions(id) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/payments/${id}/actions`,
                this.config,
                this.config.sk
            );
            return response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Request an incremental authorization to increase the authorization amount or extend
     * the authorization's validity period.
     *
     * @memberof Payments
     * @param {string} id /^(pay)_(\w{26})$/ The payment identifier.
     * @param {Object} body Payment Request body.
     * @param {string} [idempotencyKey] Idempotency Key.
     * @return {Promise<Object>} A promise to the getActions response.
     */
    async increment(id, body, idempotencyKey) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/payments/${id}/authorizations`,
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

    /**
     * Cancels an upcoming retry, if there is one scheduled
     * Cancellation requests are processed asynchronously. You can use workflows to be notified if the cancellation is successful.
     *
     * @memberof Payments
     * @param {string} id /^(pay)_(\w{26})$/ The unique payment identifier.
     * @param {Object} body Payment Request body.
     * @param {string} [idempotencyKey] Idempotency Key.
     * @return {Promise<Object>} A promise to the getActions response.
     */
    async cancelScheduledRetry(id, body, idempotencyKey) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/payments/${id}/cancellations`,
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

    /**
     * Captures a payment if supported by the payment method.
     *
     * @memberof Payments
     * @param {string} paymentId /^(pay)_(\w{26})$/ The payment or payment session identifier.
     * @param {Object} [body] Capture request body.
     * @param {string} [idempotencyKey] Idempotency Key.
     * @return {Promise<Object>} A promise to the capture response.
     */
    async capture(paymentId, body, idempotencyKey) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/payments/${paymentId}/captures`,
                this.config,
                this.config.sk,
                body,
                idempotencyKey
            );
            return response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Refunds a payment if supported by the payment method.
     *
     * @memberof Payments
     * @param {string} paymentId /^(pay)_(\w{26})$/ The payment or payment session identifier.
     * @param {Object} [body] Refund request body.
     * @param {string} [idempotencyKey] Idempotency Key.
     * @return {Promise<Object>} A promise to the refund response.
     */
    async refund(paymentId, body, idempotencyKey) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/payments/${paymentId}/refunds`,
                this.config,
                this.config.sk,
                body,
                idempotencyKey
            );
            return response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Reverse a payment if supported by the payment method.
     *
     * Response (PaymentReversalAcceptedResponse) carries `action_type` since
     * swagger 2026-05-26 — exposed verbatim in the resolved JSON.
     *
     * @memberof Payments
     * @param {string} paymentId /^(pay)_(\w{26})$/ The unique identifier for the payment.
     * @param {Object} [body] Reverse request body.
     * @param {string} [idempotencyKey] Idempotency Key.
     * @return {Promise<Object>} A promise to the reverse response.
     */
    async reverse(paymentId, body, idempotencyKey) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/payments/${paymentId}/reversals`,
                this.config,
                this.config.sk,
                body,
                idempotencyKey
            );
            return response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Voids a payment if supported by the payment method.
     *
     * @memberof Payments
     * @param {string} paymentId /^(pay)_(\w{26})$/ The payment or payment session identifier.
     * @param {Object} [body] Void request body.
     * @param {number} [body.amount] The amount to void, in the minor currency unit (min 0, max 9999999999). If not specified, the full payment amount is voided.
     * @param {string} [idempotencyKey] Idempotency Key.
     * @return {Promise<Object>} A promise to the void response.
     */
    async void(paymentId, body, idempotencyKey) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/payments/${paymentId}/voids`,
                this.config,
                this.config.sk,
                body,
                idempotencyKey
            );
            return response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Search payments if supported by the payment method.
     *
     * @memberof Payments
     * @param {Object} [body] Search request body.
     * @return {Promise<Object>} A promise to the void response.
     */
    async search(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/payments/search`,
                this.config,
                this.config.sk,
                body
            );
            return response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
