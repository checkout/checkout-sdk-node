import { determineError } from '../../services/errors.js';
import { _delete, get, patch, post } from '../../services/http.js';

/**
 * Class dealing with the /customers endpoint
 *
 * @export
 * @class Customers
 */
export default class Customers {
    constructor(config) {
        this.config = config;
    }

    /**
     * Create a customer
     *
     * @memberof Customers
     * @param {Object} customer Customer object body.
     * @return {Promise<Object>} A promise to the create customer response.
     */
    async create(customer) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/customers`,
                this.config,
                this.config.sk,
                customer
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Get a customer
     *
     * @memberof Customers
     * @param {string} id Customer id.
     * @return {Promise<Object>} A promise to the customer details response.
     */
    async get(id) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/customers/${id}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Update details of a customer
     *
     * @memberof Customers
     * @param {string} id Customer id.
     * @param {Object} body Customer object body.
     * @return {Promise<Object>} A promise to the request customer response.
     */
    async update(id, body) {
        try {
            const response = await patch(
                this.config.httpClient,
                `${this.config.host}/customers/${id}`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Delete a customer
     *
     * @memberof Customers
     * @param {string} id Customer id.
     * @return {Promise<Object>} A promise to the customer response.
     */
    async delete(id) {
        try {
            const response = await _delete(
                this.config.httpClient,
                `${this.config.host}/customers/${id}`,
                this.config,
                this.config.sk
            );

            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
