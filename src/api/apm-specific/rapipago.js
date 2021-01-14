import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import http from '../../services/http';

/**
 * Class dealing with the /apms/rapipago endpoint
 *
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
     * @param {string} id Payment id.
     * @memberof Rapipago
     * @return {Promise<Object>} A promise to the Rapipago response.
     */
    async succeed(id) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'post',
                    url: `${this.config.host}/apms/rapipago/payments/${id}/succeed`,
                    headers: { Authorization: this.config.sk },
                }
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
     * @param {string} id Payment id.
     * @memberof Rapipago
     * @return {Promise<Object>} A promise to the Rapipago response.
     */
    async expire(id) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'post',
                    url: `${this.config.host}/apms/rapipago/payments/${id}/expire`,
                    headers: { Authorization: this.config.sk },
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
