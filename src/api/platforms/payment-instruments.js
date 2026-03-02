import { determineError } from '../../services/errors.js';
import { get, patch, post } from '../../services/http.js';

/**
 * Payment instruments for sub-entities (payouts).
 *
 * @export
 * @class PaymentInstruments
 */
export default class PaymentInstruments {
    constructor(config) {
        this.config = config;
    }

    /**
     * Retrieve the details of a specific payment instrument used for sub-entity payouts.
     *
     * @param {string} entityId The sub-entity's ID.
     * @param {string} id The payment instrument's ID.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async getPaymentInstrumentDetails(entityId, id) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/accounts/entities/${entityId}/payment-instruments/${id}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Update a payment instrument's details.
     *
     * @param {string} entityId Sub-entity id.
     * @param {string} id Payment instrument's id.
     * @param {Object} body Platforms request body.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async updatePaymentInstrumentDetails(entityId, id, body) {
        try {
            const response = await patch(
                this.config.httpClient,
                `${this.config.host}/accounts/entities/${entityId}/payment-instruments/${id}`,
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
     * Create a payment instrument for a sub-entity.
     *
     * @deprecated Use the payment instrument operations at /payment-instruments instead.
     * @param {string} id Sub-entity id.
     * @param {Object} body Platforms request body.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async createPaymentInstrument(id, body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/accounts/entities/${id}/instruments`,
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
     * Add a payment instrument to a sub-entity.
     *
     * @param {string} id Sub-entity id.
     * @param {Object} body Platforms request body.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async addPaymentInstrument(id, body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/accounts/entities/${id}/payment-instruments`,
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
     * Fetch all payment instruments for a sub-entity, optionally filtered by status.
     *
     * @param {string} id The sub-entity's ID.
     * @param {string} [status] The status of your sub-entity's payment instrument.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async queryPaymentInstruments(id, status) {
        try {
            const url = `${this.config.host}/accounts/entities/${id}/payment-instruments${status ? `?status=${status}` : ''}`;
            const response = await get(this.config.httpClient, url, this.config, this.config.sk);
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
