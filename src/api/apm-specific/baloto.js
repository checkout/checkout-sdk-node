import { determineError } from '../../services/errors';
import { post } from '../../services/http';

/**
 * Class dealing with the /apms/baloto endpoint
 *
 * @deprecated - Since version 2.1.2 - Should use Payments client instead
 * @export
 * @class Baloto
 */
export default class Baloto {
    constructor(config) {
        this.config = config;
    }

    /**
     * Succeed a Baloto payment
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @param {string} id Payment id.
     * @memberof Baloto
     * @return {Promise<Object>} A promise to the Baloto response.
     */
    async succeed(id) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/apms/baloto/payments/${id}/succeed`,
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
     * Cancel Baloto payment
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @param {string} id Payment id.
     * @memberof Baloto
     * @return {Promise<Object>} A promise to the Baloto response.
     */
    async expire(id) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/apms/baloto/payments/${id}/expire`,
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
