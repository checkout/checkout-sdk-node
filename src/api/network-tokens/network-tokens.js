import { determineError } from '../../services/errors.js';
import { get, patch, post } from '../../services/http.js';

/**
 * Class dealing with the /network-tokens endpoint
 *
 * @export
 * @class NetworkTokens
 */
export default class NetworkTokens {
    constructor(config) {
        this.config = config;
    }

    /**
     * Provision a Network Token
     * [BETA]
     * Provision a network token from a card source.
     * @memberof NetworkTokens
     * @param {Object} body - Request body containing the source details
     * @returns {Promise<Object>} A promise to the Provision a Network Token response
     */
    async provisionNetworkToken(body) {
        try {
            const url = `${this.config.host}/network-tokens`;
            const response = await post(
                this.config.httpClient,
                url,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }

    /**
     * Get Network Token
     * [BETA]
     * Given network token ID, this endpoint returns network token details: DPAN, expiry date, state, TRID and also card details like last four and expiry date.
     * @memberof NetworkTokens
     * @param {string} network_token_id - The network token ID
     * @returns {Promise<Object>} A promise to the Get Network Token response
     */
    async getNetworkToken(network_token_id) {
        try {
            const url = `${this.config.host}/network-tokens/${network_token_id}`;
            const response = await get(
                this.config.httpClient,
                url,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }

    /**
     * Request a cryptogram
     * [BETA]
     * Request a cryptogram for a network token for a specific transaction type.
     * @memberof NetworkTokens
     * @param {string} network_token_id - The network token ID
     * @param {Object} body - Request body containing transaction_type
     * @returns {Promise<Object>} A promise to the Request a cryptogram response
     */
    async provisionCryptogram(network_token_id, body) {
        try {
            const url = `${this.config.host}/network-tokens/${network_token_id}/cryptograms`;
            const response = await post(
                this.config.httpClient,
                url,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }

    /**
     * Permanently deletes a network token.
     * [Beta] This endpoint is for permanently deleting a network token. A network token should be deleted when
     * a payment instrument it is associated with is removed from file or if the security of the token has been compromised.
     *
     * @memberof NetworkTokens
     * @param {string} network_token_id - Unique token ID assigned by Checkout.com for each token
     * @returns {Promise<Object>} A promise to the Delete Network Token response
     */
    async deleteNetworkToken(network_token_id) {
        try {
            const url = `${this.config.host}/network-tokens/${network_token_id}/delete`;
            const response = await patch(
                this.config.httpClient,
                url,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (error) {
            throw await determineError(error);
        }
    }
}
