import { post } from '../../services/http.js';
import { determineError } from '../../services/errors.js';

/**
 * Access class for managing cardholder access token operations
 *
 * @export
 * @class Access
 */
export default class Access {
    constructor(config) {
        this.config = config;
    }

    /**
     * Request an access token.
     * OAuth endpoint to exchange your access key ID and access key secret for an access token.
     *
     * @memberof Access
     * @param {Object} body Access token request params (grant_type, client_id, client_secret, cardholder_id, single_use).
     * @return {Promise<Object>} A promise to the access token response.
     */
    async requestCardholderAccessToken(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/issuing/access/connect/token`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
