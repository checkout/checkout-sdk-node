import { determineError } from '../../services/errors.js';
import { post } from '../../services/http.js';

// Path segments appended to the API base (config.host).
const APMS_PATH = 'apms';
const BOLETO_PATH = 'boleto';
const EXPIRE_PATH = 'expire';
const PAYMENTS_PATH = 'payments';
const SUCCEED_PATH = 'succeed';

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
                this.config.httpClient,
                `${this.config.host}/${APMS_PATH}/${BOLETO_PATH}/${PAYMENTS_PATH}/${id}/${SUCCEED_PATH}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
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
                this.config.httpClient,
                `${this.config.host}/${APMS_PATH}/${BOLETO_PATH}/${PAYMENTS_PATH}/${id}/${EXPIRE_PATH}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
