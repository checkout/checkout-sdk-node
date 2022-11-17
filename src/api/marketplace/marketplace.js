import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import http from '../../services/http';
import { MARKETPLACE_FILES_LIVE_URL, MARKETPLACE_FILES_SANDBOX_URL } from '../../config';

const FormData = require('form-data');

/**
 * Class dealing with the /marketplace endpoint
 *
 * @export
 * @class Marketplace
 */
export default class Marketplace {
    constructor(config) {
        this.config = config;
    }

    /**
     * Upload identity documentation required for full due diligence
     *
     * @memberof Marketplace
     * @param {string} purpose The purpose of the file upload.
     * @param {Object} path The local path of the file to upload, and its type.
     * @return {Promise<Object>} A promise to the Marketplace response.
     */
    async uploadFile(purpose, path) {
        try {
            const form = new FormData();

            // Handle local files and remote files
            if (isUrl(path)) {
                // use file and file name from remote
                form.append('path', path, {
                    filename: path.split('/').pop().split('#')[0].split('?')[0],
                });
            } else {
                // use the local file
                form.append('path', path);
            }
            form.append('purpose', purpose);

            const response = await http(
                fetch,
                { ...this.config, formData: true },
                {
                    method: 'post',
                    url: `${
                        this.config.host.includes('sandbox')
                            ? MARKETPLACE_FILES_SANDBOX_URL
                            : MARKETPLACE_FILES_LIVE_URL
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
     * Onboard a sub-entity so they can start receiving payments. Once created, Checkout.com
     * will run due diligence checks. If the checks are successful, we'll enable payment
     * capabilities for that sub-entity and they will start receiving payments.
     *
     * @memberof Marketplace
     * @param {Object} body Marketplace request body.
     * @return {Promise<Object>} A promise to the Marketplace response.
     */
    async onboardSubEntity(body) {
        try {
            const response = await http(fetch, this.config, {
                method: 'post',
                url: `${this.config.host}/marketplace/entities`,
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
     * Use this endpoint to retrieve a sub-entity and its full details.
     *
     * @memberof Marketplace
     * @param {string} id Sub-entity id.
     * @return {Promise<Object>} A promise to the Marketplace response.
     */
    async getSubEntityDetails(id) {
        try {
            const response = await http(fetch, this.config, {
                method: 'get',
                url: `${this.config.host}/marketplace/entities/${id}`,
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
     * @memberof Marketplace
     * @param {string} id Sub-entity id.
     * @param {Object} body Marketplace request body.
     * @return {Promise<Object>} A promise to the Marketplace response.
     */
    async updateSubEntityDetails(id, body) {
        try {
            const response = await http(fetch, this.config, {
                method: 'put',
                url: `${this.config.host}/marketplace/entities/${id}`,
                body,
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
     * @memberof Marketplace
     * @param {string} id Sub-entity id.
     * @param {Object} body Marketplace request body.
     * @return {Promise<Object>} A promise to the Marketplace response.
     */
    async addPaymentInstrument(id, body) {
        try {
            const response = await http(fetch, this.config, {
                method: 'post',
                url: `${this.config.host}/marketplace/entities/${id}/instruments`,
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

const isUrl = (string) => {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:';
};
