import { determineError } from '../../services/errors';
import { post } from '../../services/http';
import { setTokenType } from '../../services/validation';

/**
 * Class dealing with the /tokens endpoint
 *
 * @export
 * @class Tokens
 */
export default class Tokens {
    constructor(config) {
        this.config = config;
    }

    /**
     * Exchange card details or a digital wallet payment token for a reference token
     * that can be used later to request a card payment.
     *
     * @memberof Tokens
     * @param {Object} body Token request body.
     * @return {Promise<Object>} A promise to the request token response.
     */
    async request(body) {
        setTokenType(body);
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/tokens`,
                this.config,
                this.config.pk,
                body
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
