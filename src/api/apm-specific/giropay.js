import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import { get } from '../../services/http';

/**
 * Class dealing with the /giropay endpoint
 *
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
     * @memberof Giropay
     * @return {Promise<Object>} A promise to the banks response.
     */
    async getEpsBanks() {
        try {
            const response = await get(
                fetch,
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
     * @memberof Giropay
     * @return {Promise<Object>} A promise to the banks response.
     */
    async getBanks() {
        try {
            const response = await get(
                fetch,
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
