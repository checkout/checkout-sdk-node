import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import { post } from '../../services/http';

/**
 * Class dealing with the /risk endpoint
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
                fetch,
                `${this.config.host}/risk/assessments/pre-authentication`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
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
                fetch,
                `${this.config.host}/risk/assessments/pre-capture`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
