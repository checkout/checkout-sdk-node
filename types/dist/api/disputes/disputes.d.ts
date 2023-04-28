/**
 * Class dealing with the /disputes endpoint
 *
 * @export
 * @class Disputes
 */
export default class Disputes {
    constructor(config: any);
    config: any;
    /**
     * Returns a list of all disputes against your business. The results will be returned
     * in reverse chronological order, showing the last modified dispute (for example,
     * where you've recently added a piece of evidence) first. You can use the optional
     * parameters below to skip or limit results.
     *
     * @memberof Disputes
     * @param {Object} body Disputes params.
     * @return {Promise<Object>} A promise to the disputes response.
     */
    get(body: any): Promise<any>;
    /**
     * Returns all the details of a dispute using the dispute identifier.
     *
     * @memberof Disputes
     * @param {string} disputeId Dispute id.
     * @return {Promise<Object>} A promise to the dispute response.
     */
    getDetails(disputeId: string): Promise<any>;
    /**
     * Returns all the details of a dispute using the dispute identifier.
     *
     * @memberof Disputes
     * @param {string} disputeId Dispute id.
     * @return {Promise<Object>} A promise to the dispute response.
     */
    accept(disputeId: string): Promise<any>;
    /**
     * Adds supporting evidence to a dispute. Before using this endpoint, you first need
     * to upload your files using the file uploader. You will receive a file id
     * (prefixed by file_) which you can then use in your request. Note that this only
     * attaches the evidence to the dispute, it does not send it to us.
     * Once ready, you will need to submit it.
     *
     * You must provide at least one evidence type in the body of your request.
     *
     * @memberof Disputes
     * @param {string} disputeId Dispute id.
     * @param {Object} body Evidence
     * @return {Promise<Object>} A promise to the dispute response.
     */
    provideEvidence(disputeId: string, body: any): Promise<any>;
    /**
     * Retrieves a list of the evidence submitted in response to a specific dispute.
     *
     * @memberof Disputes
     * @param {string} disputeId Dispute id.
     * @return {Promise<Object>} A promise to the dispute response.
     */
    getEvidence(disputeId: string): Promise<any>;
    /**
     * With this final request, you can submit the evidence that you have previously
     * provided. Make sure you have provided all the relevant information before using
     * this request. You will not be able to amend your evidence once you have submitted it.
     *
     * @memberof Disputes
     * @param {string} disputeId Dispute id.
     * @return {Promise<Object>} A promise to the dispute response.
     */
    submit(disputeId: string): Promise<any>;
    /**
     * Returns all of the scheme files of a dispute using the dispute identifier.
     * Currently available only for VISA disputes.
     *
     * @memberof Disputes
     * @param {string} disputeId Dispute id.
     * @return {Promise<Object>} A promise to the dispute scheme files response.
     */
    getDisputeSchemeFiles(disputeId: string): Promise<any>;
}
//# sourceMappingURL=disputes.d.ts.map