import { determineError } from '../../services/errors.js';
import { post } from '../../services/http.js';
import { setSourceType } from '../../services/validation.js';

/**
 * Class dealing with the /sources endpoint
 *
 * @export
 * @class Sources
 */
export default class Sources {
    constructor(config) {
        this.config = config;
    }

    /**
     * Add a reusable payment source that can be used later to make one or more payments.
     * Payment sources are linked to a specific customer and cannot be shared between customers.
     *
     * @memberof Sources
     * @param {Object} body Source request body.
     * @return {Promise<Object>} A promise to the add source response.
     */
    async add(body) {
        setSourceType(body);
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/sources`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
