import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import { get, patch, post, put } from '../../services/http';
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

            const url = `${
                this.config.host.includes('sandbox')
                    ? PLATFORMS_FILES_SANDBOX_URL
                    : PLATFORMS_FILES_LIVE_URL
            }`;

            const response = await post(
                fetch,
                url,
                { ...this.config, formData: true },
                this.config.sk,
                form
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
            const response = await post(
                fetch,
                `${this.config.host}/accounts/entities`,
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
     * Our Platforms solution provides an easy way to upload documentation required for full due diligence.
     * Use this endpoint to generate a file upload link, which you can then upload a file to using a data-binary type request.
     * See the https://www.checkout.com/docs/platforms/onboard-sub-entities/full-sub-entity-onboarding/upload-a-file#Upload_a_file for more information.
     *
     * @memberof Platforms
     * @param {string} entityId The ID of the sub-entity.
     * @param {Object} body The body
     * @param {string} body.purpose The purpose of the file upload.
     * @returns {Promise<Object>}
     */
    async uploadAFile(entityId, body) {
        try {
            const response = await post(
                fetch,
                `${this.config.host}/accounts/entities/${entityId}/files`,
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
     * Retrieve information about a previously uploaded file.
     *
     * @memberof Platforms
     * @param {string} entityId The ID of the sub-entity.
     * @param {string} fileId The ID of the file. The value is always prefixed with file_.
     * @returns {Promise<Object>}
     */
    async retrieveAFile(entityId, fileId) {
        try {
            const response = await get(
                fetch,
                `${this.config.host}/accounts/entities/${entityId}/files/${fileId}`,
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
     * Retrieve information on all users of a sub-entity that has been invited through Hosted Onboarding
     * (https://www.checkout.com/docs/platforms/onboard-sub-entities/onboard-with-hosted-onboarding). Only
     * one user can be invited to onboard the sub-entity through Hosted Onboarding.
     *
     * To enable the Hosted Onboarding feature, contact your Customer Success Manager.
     *
     * @memberof Platforms
     * @param {string} entityId Sub-entity id.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async getSubEntityMembers(entityId) {
        try {
            const response = await get(
                fetch,
                `${this.config.host}/accounts/entities/${entityId}/members`,
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
     * Resend an invitation to the user of a sub-entity. The user will receive another email to continue their
     * Hosted Onboarding (https://www.checkout.com/docs/platforms/onboard-sub-entities/onboard-with-hosted-onboarding)
     * application. An invitation can only be resent to the user originally registered to the
     * sub-entity.
     *
     * To enable the Hosted Onboarding feature, contact your Customer Success Manager.
     *
     * @memberof Platforms
     * @param {string} entityId The ID of the sub-entity.
     * @param {string} userId The ID of the invited user.
     * @param {Object} body The body (Reinvite sub-entity member)
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async reinviteSubEntityMember(entityId, userId, body) {
        try {
            const response = await put(
                fetch,
                `${this.config.host}/accounts/entities/${entityId}/members/${userId}`,
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
     * Use this endpoint to retrieve a sub-entity and its full details.
     *
     * @memberof Platforms
     * @param {string} id Sub-entity id.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async getSubEntityDetails(id) {
        try {
            const response = await get(
                fetch,
                `${this.config.host}/accounts/entities/${id}`,
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
            const response = await put(
                fetch,
                `${this.config.host}/accounts/entities/${id}`,
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
     * Retrieve the details of a specific payment instrument used for sub-entity payouts.
     *
     * @memberof Platforms
     * @param {string} entityId The sub-entity's ID.
     * @param {string} id The payment instrument's ID.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async getPaymentInstrumentDetails(entityId, id) {
        try {
            const response = await get(
                fetch,
                `${this.config.host}/accounts/entities/${entityId}/payment-instruments/${id}`,
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
     * Update a session by providing information about the environment.
     *
     * @memberof Platforms
     * @param {string} entityId Sub-entity id.
     * @param {string} id Payment instrument's id.
     * @param {Object} body Platforms request body.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async updatePaymentInstrumentDetails(entityId, id, body) {
        try {
            const response = await patch(
                fetch,
                `${this.config.host}/accounts/entities/${entityId}/payment-instruments/${id}`,
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
     * Update a session by providing information about the environment.
     *
     * @deprecated Use the payment instrument operations at /payment-instruments instead.
     * @memberof Platforms
     * @param {string} id Sub-entity id.
     * @param {Object} body Platforms request body.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async createPaymentInstrument(id, body) {
        try {
            const response = await post(
                fetch,
                `${this.config.host}/accounts/entities/${id}/instruments`,
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
     * Update a session by providing information about the environment.
     *
     * @memberof Platforms
     * @param {string} id Sub-entity id.
     * @param {Object} body Platforms request body.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async addPaymentInstrument(id, body) {
        try {
            const response = await post(
                fetch,
                `${this.config.host}/accounts/entities/${id}/payment-instruments`,
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
            const url = `${this.config.host}/accounts/entities/${id}/payment-instruments${
                status ? `?status=${status}` : ''
            }`;

            const response = await get(fetch, url, this.config, this.config.sk);
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
            const response = await get(
                fetch,
                `${this.config.host}/accounts/entities/${id}/payout-schedules`,
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
            const response = await put(
                fetch,
                `${this.config.host}/accounts/entities/${id}/payout-schedules`,
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
}
