import { determineError } from '../../services/errors.js';
import { post } from '../../services/http.js';

/**
 * Class dealing with the /apms/pagofacil endpoint
 *
 * @deprecated - Since version 2.1.2 - Should use Payments client instead
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
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @param {string} id Payment id.
     * @memberof PagoFacil
     * @return {Promise<Object>} A promise to the PagoFacil response.
     */
    async succeed(id) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/apms/pagofacil/payments/${id}/succeed`,
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
     * Cancel PagoFacil payment
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @param {string} id Payment id.
     * @memberof PagoFacil
     * @return {Promise<Object>} A promise to the PagoFacil response.
     */
    async expire(id) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/apms/pagofacil/payments/${id}/expire`,
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
