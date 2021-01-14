import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import http from '../../services/http';

/**
 * Class dealing with the /apms/baloto endpoint
 *
 * @export
 * @class Baloto
 */
export default class Baloto {
    constructor(config) {
        this.config = config;
    }

    /**
     * Succeed a Baloto payment
     *
     * @param {string} id Payment id.
     * @memberof Baloto
     * @return {Promise<Object>} A promise to the Baloto response.
     */
    async succeed(id) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'post',
                    url: `${this.config.host}/apms/baloto/payments/${id}/succeed`,
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
     * Cancel Baloto payment
     *
     * @param {string} id Payment id.
     * @memberof Baloto
     * @return {Promise<Object>} A promise to the Baloto response.
     */
    async expire(id) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'post',
                    url: `${this.config.host}/apms/baloto/payments/${id}/expire`,
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
