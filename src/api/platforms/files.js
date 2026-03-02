import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';
import FormData from 'form-data';

/**
 * Platform file upload and retrieval (identity/documentation for sub-entities).
 * Uses Platforms Files URL for uploadFile; entity-scoped files use main API host.
 *
 * @export
 * @class PlatformFiles
 */
export default class PlatformFiles {
    constructor(config) {
        this.config = config;
    }

    /**
     * Upload identity documentation required for full due diligence (standalone file upload).
     *
     * @param {string} purpose The purpose of the file upload.
     * @param {Object} path The local path of the file to upload, and its type.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async uploadFile(purpose, path) {
        try {
            const form = new FormData();
            form.append('path', path);
            form.append('purpose', purpose);

            const url = this.config.filesUrl;

            const response = await post(
                this.config.httpClient,
                url,
                { ...this.config, formData: true },
                this.config.sk,
                form
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Generate a file upload link for a sub-entity (full sub-entity onboarding).
     *
     * @param {string} entityId The ID of the sub-entity.
     * @param {Object} body The body; body.purpose is the purpose of the file upload.
     * @returns {Promise<Object>}
     */
    async uploadAFile(entityId, body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/entities/${entityId}/files`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Retrieve information about a previously uploaded file for a sub-entity.
     *
     * @param {string} entityId The ID of the sub-entity.
     * @param {string} fileId The ID of the file (prefix file_).
     * @returns {Promise<Object>}
     */
    async retrieveAFile(entityId, fileId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/entities/${entityId}/files/${fileId}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
