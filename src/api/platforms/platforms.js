import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import http from '../../services/http';
import { PLATFORMS_FILES_LIVE_URL, PLATFORMS_FILES_SANDBOX_URL } from '../../config';

const FormData = require('form-data');

/**
 * Class dealing with the platforms api
 *
 * @export
 * @class Platforms
 */
export default class Platforms {
    constructor(config) {
        this.config = config;
    }

    /**
     * Our Platforms solution provides an easy way to upload identity documentation required for full due diligence.
     *
     * @memberof Platforms
     * @param {string} purpose The purpose of the file upload.
     * @param {Object} path The local path of the file to upload, and its type.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async uploadFile(purpose, path) {
        try {
            const form = new FormData();
            form.append('path', path);
            form.append('purpose', purpose);

            const response = await http(
                fetch,
                { ...this.config, formData: true },
                {
                    method: 'post',
                    url: `${
                        this.config.host.includes('sandbox')
                            ? PLATFORMS_FILES_SANDBOX_URL
                            : PLATFORMS_FILES_LIVE_URL
                    }`,
                    headers: { Authorization: this.config.sk },
                    body: form,
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Onboard a sub-entity so they can start receiving payments. Once created,
     * Checkout.com will run due diligence checks. If the checks are successful,
     * we'll enable payment capabilities for that sub-entity and they will start
     * receiving payments.
     *
     * @memberof Platforms
     * @param {Object} body Platforms request body.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async onboardSubEntity(body) {
        try {
            const response = await http(fetch, this.config, {
                method: 'post',
                url: `${this.config.host}/accounts/entities`,
                body,
                headers: { Authorization: this.config.sk },
            });

            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Retrieve the details of a specific payment instrument used for sub-entity payouts.
     *
     * @memberof Platforms
     * @param {string} entityId The sub-entity's ID.
     * @param {string} id The payment instrument's ID.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async getPaymentInstrumentDetails(entityId, id) {
        try {
            const response = await http(fetch, this.config, {
                method: 'get',
                url: `${this.config.host}/accounts/entities/${entityId}/payment-instruments/${id}`,
                headers: { Authorization: this.config.sk },
            });

            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Use this endpoint to retrieve a sub-entity and its full details.
     *
     * @memberof Platforms
     * @param {string} id Sub-entity id.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async getSubEntityDetails(id) {
        try {
            const response = await http(fetch, this.config, {
                method: 'get',
                url: `${this.config.host}/accounts/entities/${id}`,
                headers: { Authorization: this.config.sk },
            });

            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * You can update all fields under the Contact details, Profile, and Company objects.
     * You can also add identification information to complete due diligence requirements.
     *
     * @memberof Platforms
     * @param {string} id Sub-entity id.
     * @param {Object} body Platforms request body.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async updateSubEntityDetails(id, body) {
        try {
            const response = await http(fetch, this.config, {
                method: 'put',
                url: `${this.config.host}/accounts/entities/${id}`,
                body,
                headers: { Authorization: this.config.sk },
            });

            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Update a session by providing information about the environment.
     *
     * @memberof Platforms
     * @param {string} id Sub-entity id.
     * @param {Object} body Platforms request body.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async addPaymentInstrument(id, body) {
        try {
            const response = await http(fetch, this.config, {
                method: 'post',
                url: `${this.config.host}/accounts/entities/${id}/payment-instruments`,
                body,
                headers: { Authorization: this.config.sk },
            });

            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Fetch all of the payment instruments for a sub-entity. You can filter by status to
     * identify verified instruments that are ready to be used for Payouts.
     *
     * @memberof Platforms
     * @param {string} id The sub-entity's ID.
     * @param {string} status The status of your sub-entity's payment instrument.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async queryPaymentInstruments(id, status) {
        try {
            const response = await http(fetch, this.config, {
                method: 'get',
                url: `${this.config.host}/accounts/entities/${id}/payment-instruments${
                    status ? `?status=${status}` : ''
                }`,
                headers: { Authorization: this.config.sk },
            });

            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * You can schedule when your sub-entities receive their funds using our Platforms solution.
     * Use this endpoint to retrieve information about a sub-entity's schedule.
     *
     * @memberof Platforms
     * @param {string} id The sub-entity's ID.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async retrieveSubEntityPayoutSchedule(id) {
        try {
            const response = await http(fetch, this.config, {
                method: 'get',
                url: `${this.config.host}/accounts/entities/${id}/payout-schedules`,
                headers: { Authorization: this.config.sk },
            });

            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * You can schedule when your sub-entities receive their funds using our Platforms solution.
     * Use this endpoint to update a sub-entity's schedule.
     *
     * @memberof Platforms
     * @param {string} id The sub-entity's ID.
     * @param {Object} body Platforms request body.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async updateSubEntityPayoutSchedule(id, body) {
        try {
            const response = await http(fetch, this.config, {
                method: 'put',
                url: `${this.config.host}/accounts/entities/${id}/payout-schedules`,
                body,
                headers: { Authorization: this.config.sk },
            });

            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
