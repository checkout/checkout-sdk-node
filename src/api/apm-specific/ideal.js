import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import http from '../../services/http';

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
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'get',
                    url: `${this.config.host}/ideal-external`,
                    headers: { Authorization: this.config.sk },
                }
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
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'get',
                    url: `${this.config.host}/ideal-external/issuers`,
                    headers: { Authorization: this.config.sk },
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
