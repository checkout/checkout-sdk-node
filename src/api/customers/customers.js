import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import http from '../../services/http';

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
            const response = await http(fetch, this.config, {
                method: 'post',
                url: `${this.config.host}/customers`,
                headers: { Authorization: this.config.sk },
                body: customer,
            });
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
            const response = await http(fetch, this.config, {
                method: 'get',
                url: `${this.config.host}/customers/${id}`,
                headers: { Authorization: this.config.sk },
            });
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
            const response = await http(fetch, this.config, {
                method: 'patch',
                url: `${this.config.host}/customers/${id}`,
                headers: { Authorization: this.config.sk },
                body,
            });
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
            const response = await http(fetch, this.config, {
                method: 'delete',
                url: `${this.config.host}/customers/${id}`,
                headers: { Authorization: this.config.sk },
            });
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
