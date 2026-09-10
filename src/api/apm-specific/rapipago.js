import { determineError } from '../../services/errors.js';
import { post } from '../../services/http.js';

// Path segments appended to the API base (config.host).
const APMS_PATH = 'apms';
const EXPIRE_PATH = 'expire';
const PAYMENTS_PATH = 'payments';
const RAPIPAGO_PATH = 'rapipago';
const SUCCEED_PATH = 'succeed';

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
                this.config.httpClient,
                `${this.config.host}/${APMS_PATH}/${RAPIPAGO_PATH}/${PAYMENTS_PATH}/${id}/${SUCCEED_PATH}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
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
                this.config.httpClient,
                `${this.config.host}/${APMS_PATH}/${RAPIPAGO_PATH}/${PAYMENTS_PATH}/${id}/${EXPIRE_PATH}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
