import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import http from '../../services/http';

const FormData = require('form-data');

/**
 * Class dealing with the /files endpoint
 *
 * @export
 * @class Files
 */
export default class Files {
    constructor(config) {
        this.config = config;
    }

    /**
     * Upload a file to use as evidence in a dispute. Your file must be in either JPEG/JPG,
     * PNG or PDF format, and be no larger than 4MB.
     *
     * @memberof Files
     * @param {Object} body Files request body.
     * @return {Promise<Object>} A promise to the files response.
     */
    async upload(body) {
        try {
            const form = new FormData();

            form.append('file', body.path);
            form.append('purpose', 'dispute_evidence');

            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent, formData: true },
                {
                    method: 'post',
                    url: `${this.config.host}/files`,
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
     * Retrieve information about a file that was previously uploaded.
     *
     * @memberof Files
     * @param {String} fileId Files id.
     * @return {Promise<Object>} A promise to the files response.
     */
    async getFile(fileId) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'get',
                    url: `${this.config.host}/files/${fileId}`,
                    headers: { Authorization: this.config.sk },
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
