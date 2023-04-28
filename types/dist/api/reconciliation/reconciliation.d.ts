/**
 * Class dealing with the /reporting endpoint
 *
 * @export
 * @class Reconciliation
 */
export default class Reconciliation {
    constructor(config: any);
    config: any;
    /**
     * Returns a JSON report containing all payments within your specified parameters
     *
     * @memberof Reconciliation
     * @param {Object} body Reconciliation request body.
     * @return {Promise<Object>} A promise to the request reconciliation response.
     */
    getPayments(body: any): Promise<any>;
    /**
     * Returns a JSON payment report containing all of the data related to a specific payment,
     * based on the payment's identifier.
     *
     * @memberof Reconciliation
     * @param {string} paymentId Payment id.
     * @return {Promise<Object>} A promise to the request reconciliation response.
     */
    getPayment(paymentId: string): Promise<any>;
    /**
     * Returns a JSON report containing all payments within your specified parameters
     *
     * @memberof Reconciliation
     * @param {Object} body Reconciliation request body.
     * @return {Promise<Buffer>} A promise to the request reconciliation response.
     */
    getPaymentsCsv(body: any): Promise<Buffer>;
    /**
     * Returns a JSON report containing all statements within your specified parameters.
     * Please note that the timezone for the request will be UTC.
     *
     * @memberof Reconciliation
     * @param {Object} body Reconciliation request body.
     * @return {Promise<Object>} A promise to the request reconciliation response.
     */
    getStatements(body: any): Promise<any>;
    /**
     * Downloads a CSV statement report containing all of the data related to a specific
     * statement, based on the statement's identifier.
     *
     * @memberof Reconciliation
     * @param {string} statementId Statement id.
     * @return {Promise<Buffer>} A promise to the request reconciliation response.
     */
    getStatementCsv(statementId: string): Promise<Buffer>;
    /**
     * Returns all associated payment actions that impact your balance within the parameters you specify
     *
     * @memberof Reconciliation
     * @param {Object} body Reconciliation request body.
     * @return {Promise<Object>} A promise to the request reconciliation response.
     */
    getPaymentsActions(body: any): Promise<any>;
    /**
     * Returns the reconciliation data of the payment action
     *
     * @memberof Reconciliation
     * @param {string} actionsId Action id.
     * @return {Promise<Object>} A promise to the request reconciliation response.
     */
    getPaymentsAction(actionsId: string): Promise<any>;
    /**
     * Returns a CSV report containing all payments within your specified parameters
     *
     * @memberof Reconciliation
     * @param {Object} body Reconciliation request body.
     * @return {Promise<Buffer>} A promise to the request reconciliation response.
     */
    getPaymentsActionsCsv(body: any): Promise<Buffer>;
    /**
     * Returns the reconciliation data of a payment action
     *
     * @memberof Reconciliation
     * @param {string} actionId Action id.
     * @return {Promise<Object>} A promise to the request reconciliation response.
     */
    getAction(actionId: string): Promise<any>;
}
//# sourceMappingURL=reconciliation.d.ts.map