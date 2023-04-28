/**
 * Class dealing with the /files endpoint
 *
 * @export
 * @class Files
 */
export default class Files {
    constructor(config: any);
    config: any;
    /**
     * Upload a file to use as evidence in a dispute. Your file must be in either JPEG/JPG,
     * PNG or PDF format, and be no larger than 4MB.
     *
     * @memberof Files
     * @param {Object} body Files request body.
     * @return {Promise<Object>} A promise to the files response.
     */
    upload(body: any): Promise<any>;
    /**
     * Retrieve information about a file that was previously uploaded.
     *
     * @memberof Files
     * @param {string} fileId Files id.
     * @return {Promise<Object>} A promise to the files response.
     */
    getFile(fileId: string): Promise<any>;
}
//# sourceMappingURL=files.d.ts.map