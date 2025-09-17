import { determineError } from '../../services/errors.js';
import { get } from '../../services/http.js';

/**
 * Class dealing with the /giropay endpoint
 *
 * @deprecated - Since version 2.1.2 - Should use Payments client instead
 * @export
 * @class Giropay
 */
export default class Giropay {
    constructor(config) {
        this.config = config;
    }

    /**
     * Get Giropay EPS banks
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @memberof Giropay
     * @return {Promise<Object>} A promise to the banks response.
     */
    async getEpsBanks() {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/giropay/eps/banks`,
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
     * Get Giropay banks
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @memberof Giropay
     * @return {Promise<Object>} A promise to the banks response.
     */
    async getBanks() {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/giropay/banks`,
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
