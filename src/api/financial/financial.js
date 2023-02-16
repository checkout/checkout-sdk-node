import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import http from '../../services/http';

/**
 * Class dealing with the /financial-actions api endpoint
 *
 * @export
 * @class Financial
 */
export default class Financial {
    constructor(config) {
        this.config = config;
    }

    /**
     * Returns the list of financial actions and their details.
     *
     * @memberof Financial
     * @param {Object} parameters Parameters.
     * @return {Promise<Object>} A promise to the Financial Actions response.
     */
    async query(parameters) {
        try {
            let url = `${this.config.host}/financial-actions`;

            if (parameters) {
                const queryString = Object.keys(parameters)
                    .map((key) => `${key}=${parameters[key]}`)
                    .join('&');
                url += `?${queryString}`;
            }

            const response = await http(fetch, this.config, {
                method: 'get',
                url,
                headers: { Authorization: this.config.sk },
            });

            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
