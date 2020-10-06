import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import http from '../../services/http';
import { setSourceType } from '../../services/validation';

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
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'post',
                    url: `${this.config.host}/sources`,
                    headers: { Authorization: this.config.sk },
                    body,
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
