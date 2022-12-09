import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import http from '../../services/http';
import { TRANSFERS_SANDBOX_URL, TRANSFERS_LIVE_URL } from '../../config';
import { setTokenType } from '../../services/validation';

/**
 * Class dealing with the /transfers endpoint
 *
 * @export
 * @class Transfers
 */
export default class Transfers {
    constructor(config) {
        this.config = config;
    }

    /**
     * Initiate a transfer of funds from source entity to destination entity.
     *
     * @memberof Transfers
     * @param {Object} body Transfers request body.
     * @param {string} [idempotencyKey] Idempotency Key.
     * @return {Promise<Object>} A promise to the request transfers response.
     */
    async initiate(body, idempotencyKey) {
        try {
            const response = await http(fetch, this.config, {
                method: 'post',
                url: `${
                    this.config.host.includes('sandbox')
                        ? TRANSFERS_SANDBOX_URL
                        : TRANSFERS_LIVE_URL
                }`,
                headers: determineHeaders(this.config, idempotencyKey),
                body,
            });
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Retrieve transfer details using the transfer identifier.
     *
     * @memberof Transfers
     * @param {string} id tra_XXX The transfer identifier.
     * @return {Promise<Object>} A promise to the transfer response.
     */
    async retrieve(id) {
        try {
            const response = await http(fetch, this.config, {
                method: 'get',
                url: `${
                    this.config.host.includes('sandbox')
                        ? TRANSFERS_SANDBOX_URL
                        : TRANSFERS_LIVE_URL
                }/${id}`,
                headers: { Authorization: this.config.sk },
            });
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}

const determineHeaders = (config, idempotencyKey) => {
    if (idempotencyKey !== undefined) {
        return {
            Authorization: config.sk,
            'Cko-Idempotency-Key': idempotencyKey,
        };
    }
    return { Authorization: config.sk };
};
