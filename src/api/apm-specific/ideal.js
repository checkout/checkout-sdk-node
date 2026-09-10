import { determineError } from '../../services/errors.js';
import { get } from '../../services/http.js';

// Path segments appended to the API base (config.host).
const IDEAL_EXTERNAL_PATH = 'ideal-external';
const ISSUERS_PATH = 'issuers';

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
                `${this.config.host}/${IDEAL_EXTERNAL_PATH}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
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
                `${this.config.host}/${IDEAL_EXTERNAL_PATH}/${ISSUERS_PATH}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
