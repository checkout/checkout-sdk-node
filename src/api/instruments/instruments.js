import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import http from '../../services/http';
import { setInstrumentType } from '../../services/validation';

/**
 * Class dealing with the /tokens endpoint
 *
 * @export
 * @class Instruments
 */
export default class Instruments {
    constructor(config) {
        this.config = config;
    }

    /**
     * Exchange card details or a digital wallet payment token for a reference token
     * that can be used later to request a card payment.
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
                { timeout: this.config.timeout },
                {
                    method: 'post',
                    url: `${this.config.host}/instruments`,
                    headers: { Authorization: this.config.sk },
                    body
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
