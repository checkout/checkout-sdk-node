import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import http from '../../services/http';
import { setInstrumentType } from '../../services/validation';

/**
 * Class dealing with the /instruments endpoint
 *
 * @export
 * @class Instruments
 */
export default class Instruments {
    constructor(config) {
        this.config = config;
    }

    /**
     * Exchange a single use Checkout.com token for a payment instrument reference,
     * that can be used at any time to request one or more payments.
     *
     * @memberof Instruments
     * @param {Object} body Instruments request body.
     * @return {Promise<Object>} A promise to the request instruments response.
     */
    async create(body) {
        setInstrumentType(body);
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'post',
                    url: `${this.config.host}/instruments`,
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
