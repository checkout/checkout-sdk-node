import { get } from '../../services/http.js';
import { determineError } from '../../services/errors.js';
import { buildQueryParams } from '../../services/utils.js';

// Path segments appended to the API base (config.host).
const ISSUING_PATH = 'issuing';
const TRANSACTIONS_PATH = 'transactions';

/**
 * Transactions class for managing transaction operations
 *
 * @export
 * @class Transactions
 */
export default class Transactions {
    constructor(config) {
        this.config = config;
    }

    /**
     * Get a list of transactions.
     * [Beta] Returns a list of transactions based on the matching input parameters in reverse chronological order,
     * with the most recent transactions shown first.
     *
     * @memberof Transactions
     * @param {Object} params Query parameters for filtering transactions (limit, skip, cardholder_id, card_id, entity_id, status, from, to).
     * @return {Promise<Object>} A promise to the transactions list.
     */
    async getTransactions(params = {}) {
        try {
            const url = buildQueryParams(`${this.config.host}/${ISSUING_PATH}/${TRANSACTIONS_PATH}`, params);
            const response = await get(this.config.httpClient, url, this.config, this.config.sk);
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Get a single transaction.
     * [Beta] Get the details of a transaction using its ID.
     *
     * @memberof Transactions
     * @param {string} transactionId The transaction ID.
     * @return {Promise<Object>} A promise to the transaction details.
     */
    async getTransactionById(transactionId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/${ISSUING_PATH}/${TRANSACTIONS_PATH}/${transactionId}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
