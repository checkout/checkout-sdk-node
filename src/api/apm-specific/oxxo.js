import { determineError } from '../../services/errors.js';
import { post } from '../../services/http.js';
import { encodePathSegment } from '../../services/utils.js';

// Path segments appended to the API base (config.host).
const APMS_PATH = 'apms';
const EXPIRE_PATH = 'expire';
const OXXO_PATH = 'oxxo';
const PAYMENTS_PATH = 'payments';
const SUCCEED_PATH = 'succeed';

/**
 * Class dealing with the /apms/oxxo endpoint
 *
 * @deprecated - Since version 2.1.2 - Should use Payments client instead
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
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @param {string} id Payment id.
     * @memberof Oxxo
     * @return {Promise<Object>} A promise to the Oxxo response.
     * @throws {ValueError} If id is undefined, empty, "." or "..".
     */
    async succeed(id) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/${APMS_PATH}/${OXXO_PATH}/${PAYMENTS_PATH}/${encodePathSegment(id, 'id')}/${SUCCEED_PATH}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Cancel Oxxo payment
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @param {string} id Payment id.
     * @memberof Oxxo
     * @return {Promise<Object>} A promise to the Oxxo response.
     * @throws {ValueError} If id is undefined, empty, "." or "..".
     */
    async expire(id) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/${APMS_PATH}/${OXXO_PATH}/${PAYMENTS_PATH}/${encodePathSegment(id, 'id')}/${EXPIRE_PATH}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
