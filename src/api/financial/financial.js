import { determineError } from '../../services/errors.js';
import { get } from '../../services/http.js';

// Path segments appended to the API base (config.host).
const FINANCIAL_ACTIONS_PATH = 'financial-actions';

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
            let url = `${this.config.host}/${FINANCIAL_ACTIONS_PATH}`;

            if (parameters) {
                const queryString = Object.keys(parameters)
                    .map((key) => `${key}=${parameters[key]}`)
                    .join('&');
                url += `?${queryString}`;
            }

            const response = await get(this.config.httpClient, url, this.config, this.config.sk);
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
