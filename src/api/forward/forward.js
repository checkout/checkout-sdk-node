import { determineError } from '../../services/errors';
import { get, post } from '../../services/http';

/**
 * Class dealing with the /forward endpoint
 *
 * @export
 * @class Forward
 */
export default class Forward {
    constructor(config) {
        this.config = config;
    }

    /**
     * Beta
     * Forwards an API request to a third-party endpoint.
     * For example, you can forward payment credentials you've stored in our Vault to a third-party payment processor.
     *
     * Forward an API request
     * @param {Object} body Forward request body
     * @return {Promise<Object>} A promise to the forward response
     */
    async forwardRequest(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/forward`,
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

    /**
     * Retrieve the details of a successfully forwarded API request.
     * The details can be retrieved for up to 14 days after the request was initiated.
     *
     * Get forward request
     * @param {string} id The unique identifier of the forward request
     * @return {Promise<Object>} A promise to the forward request details
     */
    async get(id) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/forward/${id}`,
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
