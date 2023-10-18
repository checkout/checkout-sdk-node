import { determineError } from '../../services/errors';
import { createAccessToken } from '../../services/http';

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
     * @param {Object} body Access object body.
     * @return {Promise<Object>} A promise to the Access response.
     */
    async request(body) {
        try {
            const response = await createAccessToken(
                this.config,
                this.config.httpClient,
                body
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Update the access details in the config.
     *
     * @param {Object} body Access response body.
     * @return {Promise<Object>} A promise to the Access response.
     */
    updateAccessToken(body) {
        this.config.access = {
            token: body.access_token,
            type: body.token_type,
            scope: body.scope,
            expires: new Date(new Date().getTime() + body.expires_in),
        };
    }
}
