/**
 * Class dealing with the /reports api endpoint
 *
 * @export
 * @class Reports
 */
export default class Reports {
    constructor(config: any);
    config: any;
    /**
     * Returns the list of reports and their details.
     *
     * @memberof Reports
     * @param {Object} parameters Parameters.
     * @return {Promise<Object>} A promise to the Reports response.
     */
    getAllReports(parameters: any): Promise<any>;
    /**
     * Use this endpoint to retrieve a specific report using its ID.
     *
     * @memberof Reports
     * @param {string} id The ID of the report to retrieve.
     * @return {Promise<Object>} A promise to the Reports response.
     */
    getReportDetails(id: string): Promise<any>;
    /**
     * Use this endpoint to retrieve a specific file from a given report using their respective IDs.
     *
     * @memberof Reports
     * @param {string} id The ID of the report that the file belongs to.
     * @param {Object} fileId The ID of the file to retrieve.
     * @return {Promise<Object>} A promise to the Reports response.
     */
    getReportFile(id: string, fileId: any): Promise<any>;
}
//# sourceMappingURL=reports.d.ts.map