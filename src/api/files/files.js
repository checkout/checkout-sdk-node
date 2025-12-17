import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';

import FormData from 'form-data';

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
     * @param {string|ReadStream} body.file File URL (for remote files) or file path/ReadStream (for local files).
     * @param {string|ReadStream} [body.path] Alternative property name for local file path/ReadStream.
     * @param {string} body.purpose Purpose of the file upload. Valid values: 'dispute_evidence', 'additional_document', 'bank_verification', 'identity_verification'.
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
            form.append('purpose', body.purpose);

            const response = await post(
                this.config.httpClient,
                `${this.config.host}/files`,
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
     * Retrieve information about a file that was previously uploaded.
     *
     * @memberof Files
     * @param {string} fileId Files id.
     * @return {Promise<Object>} A promise to the files response.
     */
    async getFile(fileId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/files/${fileId}`,
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

const isUrl = (string) => {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === 'http:' || url.protocol === 'https:';
};
