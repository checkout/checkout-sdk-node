import { determineError } from '../../services/errors.js';
import { get, post, put } from '../../services/http.js';

/**
 * Class dealing with the /sessions endpoint
 *
 * @export
 * @class Sessions
 */
export default class Sessions {
    constructor(config) {
        this.config = config;
    }

    /**
     * Create a payment session to authenticate a cardholder before requesting a payment.
     *
     * Notable optional fields (swagger SessionRequest, 2026-05-07):
     *  - body.device_information — device-fingerprint block. See swagger
     *    `DeviceInformation` for shape (browser, ip, screen, timezone, etc.).
     *  - body.challenge_indicator — this endpoint is the only one that accepts the
     *    exemption values. Nine values (swagger `ChallengeIndicator`, default
     *    `no_preference`, max 50 characters): `no_preference`,
     *    `no_challenge_requested`, `challenge_requested`,
     *    `challenge_requested_mandate`, plus the exemption requests `low_value`,
     *    `trusted_listing`, `trusted_listing_prompt`,
     *    `transaction_risk_assessment`, and `data_share`. If an exemption cannot
     *    be applied, `no_challenge_requested` is used instead. The
     *    `3ds.challenge_indicator` field on payments, hosted payments, payment
     *    links and payment sessions accepts only the first four.
     *
     * @memberof Sessions
     * @param {Object} body Sessions request body.
     * @return {Promise<Object>} A promise to the sessions response.
     */
    async request(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/sessions`,
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
     * Returns the details of the session with the specified identifier string.
     *
     * @memberof Sessions
     * @param {string} id Sessions id.
     * @param {string} channel Type of channnel.
     * @return {Promise<Object>} A promise to the sessions response.
     */
    async get(id, channel) {
        try {
            this.config.headers = { ...this.config.headers, channel };

            const response = await get(
                this.config.httpClient,
                `${this.config.host}/sessions/${id}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Update a session by providing information about the environment.
     *
     * @memberof Sessions
     * @param {string} id Sessions id.
     * @param {Object} body Sessions request body.
     * @return {Promise<Object>} A promise to the sessions response.
     */
    async update(id, body) {
        try {
            const response = await put(
                this.config.httpClient,
                `${this.config.host}/sessions/${id}/collect-data`,
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
     * Completes a session by posting the the following request to the callback URL
     * (only relevant for non hosted sessions)
     *
     * @memberof Sessions
     * @param {string} id Sessions id.
     * @return {Promise<Object>} A promise to the sessions response.
     */
    async complete(id) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/sessions/${id}/complete`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Completes a session by posting the the following request to the callback URL
     * (only relevant for non hosted sessions)
     *
     * @memberof Sessions
     * @param {string} id Sessions id.
     * @param {string} threeDsMethodCompletion 3DS Method completion indicator
     * @return {Promise<Object>} A promise to the sessions response.
     */
    async update3DSMethodCompletionIndicator(id, threeDsMethodCompletion) {
        try {
            const body = {
                three_ds_method_completion: threeDsMethodCompletion,
            };

            const response = await put(
                this.config.httpClient,
                `${this.config.host}/sessions/${id}/issuer-fingerprint`,
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
