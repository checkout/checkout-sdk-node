import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import http from '../../services/http';

/**
 * Class dealing with the /apms/pagofacil endpoint
 *
 * @export
 * @class PagoFacil
 */
export default class PagoFacil {
    constructor(config) {
        this.config = config;
    }

    /**
     * Succeed a PagoFacil payment
     *
     * @param {string} id Payment id.
     * @memberof PagoFacil
     * @return {Promise<Object>} A promise to the PagoFacil response.
     */
    async succeed(id) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'post',
                    url: `${this.config.host}/apms/pagofacil/payments/${id}/succeed`,
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
     * Cancel PagoFacil payment
     *
     * @param {string} id Payment id.
     * @memberof PagoFacil
     * @return {Promise<Object>} A promise to the PagoFacil response.
     */
    async expire(id) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'post',
                    url: `${this.config.host}/apms/pagofacil/payments/${id}/expire`,
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
