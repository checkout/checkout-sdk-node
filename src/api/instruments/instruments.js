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
            const response = await http(fetch, this.config, {
                method: 'post',
                url: `${this.config.host}/instruments`,
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
     * Returns details of an instrument
     *
     * @memberof Instruments
     * @param {string} id Instrument id.
     * @return {Promise<Object>} A promise to the instrument response.
     */
    async get(id) {
        try {
            const response = await http(fetch, this.config, {
                method: 'get',
                url: `${this.config.host}/instruments/${id}`,
                headers: { Authorization: this.config.sk },
            });
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Update details of an instrument
     *
     * @memberof Instruments
     * @param {string} id Instrument id.
     * @param {Object} body Instruments request body.
     * @return {Promise<Object>} A promise to the instrument response.
     */
    async update(id, body) {
        try {
            const response = await http(fetch, this.config, {
                method: 'patch',
                url: `${this.config.host}/instruments/${id}`,
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
     * Delete a payment instrument.
     *
     * @memberof Instruments
     * @param {string} id Instrument id.
     * @return {Promise<Object>} A promise to the instrument response.
     */
    async delete(id) {
        try {
            const response = await http(fetch, this.config, {
                method: 'delete',
                url: `${this.config.host}/instruments/${id}`,
                headers: { Authorization: this.config.sk },
            });
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Delete a payment instrument.
     *
     * @memberof Instruments
     * @param {string} country Country 2 character ISO.
     * @param {string} currency Currency 3 character ISO.
     * @return {Promise<Object>} A promise to the instrument response.
     */
    async getBankAccountFieldFormatting(country, currency) {
        try {
            const response = await http(fetch, this.config, {
                method: 'get',
                url: `${this.config.host}/validation/bank-accounts/${country}/${currency}`,
                headers: { Authorization: this.config.sk },
            });
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
