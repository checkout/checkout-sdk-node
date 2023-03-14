import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import { post } from '../../services/http';

/**
 * Class dealing with the /apms/rapipago endpoint
 *
 * @deprecated - Since version 2.1.2 - Should use Payments client instead
 * @export
 * @class Rapipago
 */
export default class Rapipago {
    constructor(config) {
        this.config = config;
    }

    /**
     * Succeed a Rapipago payment
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @param {string} id Payment id.
     * @memberof Rapipago
     * @return {Promise<Object>} A promise to the Rapipago response.
     */
    async succeed(id) {
        try {
            const response = await post(
                fetch,
                `${this.config.host}/apms/rapipago/payments/${id}/succeed`,
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
     * Cancel Rapipago payment
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @param {string} id Payment id.
     * @memberof Rapipago
     * @return {Promise<Object>} A promise to the Rapipago response.
     */
    async expire(id) {
        try {
            const response = await post(
                fetch,
                `${this.config.host}/apms/rapipago/payments/${id}/expire`,
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
