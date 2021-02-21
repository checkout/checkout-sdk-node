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

            // Handle local files and remote files
            if (isUrl(body.file)) {
                // use file and file name from remote
                form.append('file', body.file, {
                    filename: body.file.split('/').pop().split('#')[0].split('?')[0],
                });
            } else {
                // use the local file
                form.append('file', body.file || body.path);
            }
            form.append('purpose', 'dispute_evidence');

            const response = await http(
                fetch,
                {
                    timeout: this.config.timeout,
                    agent: this.config.agent,
                    formData: true,
                },
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

const isUrl = (string) => {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:';
};
