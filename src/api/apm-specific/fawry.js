import { determineError } from '../../services/errors.js';
import { put } from '../../services/http.js';

// Path segments appended to the API base (config.host).
const APPROVAL_PATH = 'approval';
const CANCELLATION_PATH = 'cancellation';
const FAWRY_PATH = 'fawry';
const PAYMENTS_PATH = 'payments';

/**
 * Class dealing with the /fawry endpoint
 *
 * @deprecated - Since version 2.1.2 - To be removed in future versions.
 * Should use Payments client instead
 * @export
 * @class Fawry
 */
export default class Fawry {
    constructor(config) {
        this.config = config;
    }

    /**
     * Approve Fawry payment
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @param {string} reference Reference.
     * @memberof Fawry
     * @return {Promise<Object>} A promise to the Fawry response.
     */
    async approve(reference) {
        try {
            const response = await put(
                this.config.httpClient,
                `${this.config.host}/${FAWRY_PATH}/${PAYMENTS_PATH}/${reference}/${APPROVAL_PATH}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Cancel Fawry payment
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @param {string} reference Reference.
     * @memberof Fawry
     * @return {Promise<Object>} A promise to the Fawry response.
     */
    async cancel(reference) {
        try {
            const response = await put(
                this.config.httpClient,
                `${this.config.host}/${FAWRY_PATH}/${PAYMENTS_PATH}/${reference}/${CANCELLATION_PATH}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
