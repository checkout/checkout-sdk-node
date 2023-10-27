import { determineError } from '../../services/errors';
import { get } from '../../services/http';

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
            let url = `${this.config.host}/reports`;

            if (parameters) {
                const queryString = Object.keys(parameters)
                    .map((key) => `${key}=${parameters[key]}`)
                    .join('&');
                url += `?${queryString}`;
            }

            const response = await get(
                this.config.httpClient, 
                url, 
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
     * Use this endpoint to retrieve a specific report using its ID.
     *
     * @memberof Reports
     * @param {string} id The ID of the report to retrieve.
     * @return {Promise<Object>} A promise to the Reports response.
     */
    async getReportDetails(id) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/reports/${id}`,
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
     * Use this endpoint to retrieve a specific file from a given report using their respective IDs.
     *
     * @memberof Reports
     * @param {string} id The ID of the report that the file belongs to.
     * @param {Object} fileId The ID of the file to retrieve.
     * @return {Promise<Object>} A promise to the Reports response.
     */
    async getReportFile(id, fileId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/reports/${id}/files/${fileId}`,
                { ...this.config, csv: true },
                this.config.sk
            );
            return await response.csv;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
