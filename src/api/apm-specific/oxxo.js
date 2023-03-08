import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import { post } from '../../services/http';

/**
 * Class dealing with the /apms/oxxo endpoint
 *
 * @export
 * @class Oxxo
 */
export default class Oxxo {
    constructor(config) {
        this.config = config;
    }

    /**
     * Succeed a Oxxo payment
     *
     * @param {string} id Payment id.
     * @memberof Oxxo
     * @return {Promise<Object>} A promise to the Oxxo response.
     */
    async succeed(id) {
        try {
            const response = await post(
                fetch,
                `${this.config.host}/apms/oxxo/payments/${id}/succeed`,
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
     * Cancel Oxxo payment
     *
     * @param {string} id Payment id.
     * @memberof Oxxo
     * @return {Promise<Object>} A promise to the Oxxo response.
     */
    async expire(id) {
        try {
            const response = await post(
                fetch,
                `${this.config.host}/apms/oxxo/payments/${id}/expire`,
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
