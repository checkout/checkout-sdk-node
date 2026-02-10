import { post } from '../../services/http.js';
import { determineError } from '../../services/errors.js';

/**
 * Simulate class for managing simulation operations
 *
 * @export
 * @class Simulate
 */
export default class Simulate {
    constructor(config) {
        this.config = config;
    }

    /**
     * Simulate an authorization request with a card you issued previously.
     *
     * @memberof Simulate
     * @param {Object} body Card params.
     * @return {Promise<Object>} A promise to the card response.
     */
    async simulateAuthorization(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/issuing/simulate/authorizations`,
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
     * Simulate an incremental authorization request for an existing approved transaction.
     *
     * @memberof Simulate
     * @param {String} id transaction ID.
     * @param {Object} body Amount.
     * @return {Promise<Object>} A promise to the simulation response.
     */
    async simulateIncrement(id, body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/issuing/simulate/authorizations/${id}/authorizations`,
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
     * Simulate the clearing of an existing approved authorization.
     *
     * @memberof Simulate
     * @param {String} id transaction ID.
     * @param {Object} body Amount.
     * @return {Promise<Object>} A promise to the simulation response.
     */
    async simulateClearing(id, body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/issuing/simulate/authorizations/${id}/presentments`,
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
     * Simulate the refund of an existing cleared authorization.
     *
     * @memberof Simulate
     * @param {String} id transaction ID.
     * @param {Object} body Refund amount and params.
     * @return {Promise<Object>} A promise to the simulation response.
     */
    async simulateRefund(id, body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/issuing/simulate/authorizations/${id}/refunds`,
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
     * Simulate the reversal of an existing approved authorization.
     *
     * @memberof Simulate
     * @param {String} id transaction ID.
     * @param {Object} body Amount.
     * @return {Promise<Object>} A promise to the simulation response.
     */
    async simulateReversal(id, body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/issuing/simulate/authorizations/${id}/reversals`,
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
     * Simulate an out-of-band (OOB) authentication request.
     * Simulate a request to your back-end from an out-of-band (OOB) authentication provider.
     *
     * @memberof Simulate
     * @param {Object} body OOB authentication request params.
     * @return {Promise<Object>} A promise to the simulation response.
     */
    async simulateOobAuthentication(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/issuing/simulate/oob/authentication`,
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
