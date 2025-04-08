/* eslint-disable no-underscore-dangle */
import { determineError } from '../../services/errors';
import { get, post } from '../../services/http';
import { setSourceOrDestinationType, validatePayment } from '../../services/validation';

const addUtilityParams = (json) => {
    let requiresRedirect = false;

    if (json.destination) {
        requiresRedirect = false;
    } else {
        const isPending = json.status === 'Pending';
        const hasRedirectUrl = json._links.redirect !== undefined;
        requiresRedirect = isPending && hasRedirectUrl;
    }

    // If the redirection URL exists add it to the response body as 'redirectLink'
    let redirectLink;
    if (requiresRedirect && json._links.redirect) {
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
     * Sends payment or a payout requests.
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
            const error = await determineError(err);
            throw error;
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
            const response = await get(
                this.config.httpClient,
                url,
                this.config,
                this.config.sk
            );
            return response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Returns the details of the payment with the specified identifier string.
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
            const error = await determineError(err);
            throw error;
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
            const error = await determineError(err);
            throw error;
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
     * @memberof Payments
     * @param {string} paymentId /^(pay)_(\w{26})$/ The unique identifier for the payment.
     * @param {Object} [body] Reverse request body.
     * @param {string} [idempotencyKey] Idempotency Key.
     * @return {Promise<Object>} A promise to the refund response.
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
    async search( body) {
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
