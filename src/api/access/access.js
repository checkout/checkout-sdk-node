import { determineError } from '../../services/errors.js';
import { createAccessToken, storeAccessToken } from '../../services/http.js';

/**
 * Class dealing with the access api
 *
 * @export
 * @class Access
 */
export default class Access {
    constructor(config) {
        this.config = config;
    }

    /**
     * Request an access token
     *
     * @memberof Access
     * @param {Object} body Access object body.
     * @return {Promise<Object>} A promise to the Access response.
     */
    async request(body) {
        try {
            const response = await createAccessToken(this.config, this.config.httpClient, body);
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Update the access details in the config.
     *
     * @memberof Access
     * @param {Object} body Access response body: access_token, token_type, scope and
     *   expires_in (lifetime in seconds).
     * @return {void}
     */
    updateAccessToken(body) {
        storeAccessToken(this.config, body);
    }
}
