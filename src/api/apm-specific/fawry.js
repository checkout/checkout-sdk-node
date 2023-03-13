import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import { put } from '../../services/http';

/**
 * Class dealing with the /fawry endpoint
 *
 * @export
 * @class Fawry
 */
export default class Fawry {
    constructor(config) {
        this.config = config;
    }

    /**
     * Approve Fawry payment
     *
     * @param {string} reference Reference.
     * @memberof Fawry
     * @return {Promise<Object>} A promise to the Fawry response.
     */
    async approve(reference) {
        try {
            const response = await put(
                fetch,
                `${this.config.host}/fawry/payments/${reference}/approval`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Cancel Fawry payment
     *
     * @param {string} reference Reference.
     * @memberof Fawry
     * @return {Promise<Object>} A promise to the Fawry response.
     */
    async cancel(reference) {
        try {
            const response = await put(
                fetch,
                `${this.config.host}/fawry/payments/${reference}/cancellation`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
