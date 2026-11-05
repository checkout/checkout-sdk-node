import { determineError } from '../../services/errors.js';
import { get } from '../../services/http.js';
import { buildQueryParams, encodePathSegment } from '../../services/utils.js';

// Path segments appended to the API base (config.host).
const FILES_PATH = 'files';
const REPORTS_PATH = 'reports';

/**
 * Class dealing with the /reports api endpoint
 *
 * @export
 * @class Reports
 */
export default class Reports {
    constructor(config) {
        this.config = config;
    }

    /**
     * Returns the list of reports and their details.
     *
     * @memberof Reports
     * @param {Object} parameters Parameters.
     * @return {Promise<Object>} A promise to the Reports response.
     */
    async getAllReports(parameters) {
        try {
            const url = buildQueryParams(`${this.config.host}/${REPORTS_PATH}`, parameters);

            const response = await get(this.config.httpClient, url, this.config, this.config.sk);
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Use this endpoint to retrieve a specific report using its ID.
     *
     * @memberof Reports
     * @param {string} id The ID of the report to retrieve.
     * @return {Promise<Object>} A promise to the Reports response.
     * @throws {ValueError} If id is undefined, empty, "." or "..".
     */
    async getReportDetails(id) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/${REPORTS_PATH}/${encodePathSegment(id, 'id')}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Use this endpoint to retrieve a specific file from a given report using their respective IDs.
     *
     * @memberof Reports
     * @param {string} id The ID of the report that the file belongs to.
     * @param {Object} fileId The ID of the file to retrieve.
     * @return {Promise<Object>} A promise to the Reports response.
     * @throws {ValueError} If id or fileId is undefined, empty, "." or "..".
     */
    async getReportFile(id, fileId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/${REPORTS_PATH}/${encodePathSegment(id, 'id')}/${FILES_PATH}/${encodePathSegment(fileId, 'fileId')}`,
                { ...this.config, csv: true },
                this.config.sk
            );
            return await response.csv;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
