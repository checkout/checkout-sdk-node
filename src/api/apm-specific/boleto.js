import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import { post } from '../../services/http';

/**
 * Class dealing with the /apms/boleto endpoint
 *
 * @deprecated - Since version 2.1.2 - Should use Payments client instead
 * @export
 * @class Boleto
 */
export default class Boleto {
    constructor(config) {
        this.config = config;
    }

    /**
     * Succeed a Boleto payment
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @param {string} id Payment id.
     * @memberof Boleto
     * @return {Promise<Object>} A promise to the Boleto response.
     */
    async succeed(id) {
        try {
            const response = await post(
                fetch,
                `${this.config.host}/apms/boleto/payments/${id}/succeed`,
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
     * Cancel Boleto payment
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @param {string} id Payment id.
     * @memberof Boleto
     * @return {Promise<Object>} A promise to the Boleto response.
     */
    async expire(id) {
        try {
            const response = await post(
                fetch,
                `${this.config.host}/apms/boleto/payments/${id}/expire`,
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
