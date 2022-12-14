import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import http from '../../services/http';

/**
 * Class dealing with the /metadata/card endpoint
 *
 * @export
 * @class CardMetadata
 */
export default class CardMetadata {
    constructor(config) {
        this.config = config;
    }

    /**
     * Returns a single metadata record for the card specified by the Primary Account Number (PAN),
     * Bank Identification Number (BIN), token, or instrument supplied.
     *
     * @param {Object} body Card Metadata request body.
     * @return {Promise<Object>} A promise to the add Card Metadata response.
     */
    async get(body) {
        try {
            const response = await http(fetch, this.config, {
                method: 'post',
                url: `${this.config.host}/metadata/card`,
                headers: { Authorization: this.config.sk },
                body,
            });
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
