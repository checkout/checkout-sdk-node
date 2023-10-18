import { determineError } from '../../services/errors';
import { get } from '../../services/http';

/**
 * Class dealing with the /ideal-external endpoint
 *
 * @export
 * @class Ideal
 */
export default class Ideal {
    constructor(config) {
        this.config = config;
    }

    /**
     * Get Ideal details
     *
     * @memberof Ideal
     * @return {Promise<Object>} A promise to the iDeal response.
     */
    async get() {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/ideal-external`,
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
     * Get Ideal issuers
     *
     * @memberof Ideal
     * @return {Promise<Object>} A promise to the iDeal response.
     */
    async getIssuers() {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/ideal-external/issuers`,
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
