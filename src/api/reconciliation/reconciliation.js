import { determineError } from '../../services/errors.js';
import { get } from '../../services/http.js';
import { buildQueryParams, encodePathSegment } from '../../services/utils.js';

// Path segments appended to the API base (config.host).
const ACTIONS_PATH = 'actions';
const DOWNLOAD_PATH = 'download';
const PAYMENTS_PATH = 'payments';
const REPORTING_PATH = 'reporting';
const STATEMENTS_PATH = 'statements';

/**
 * Class dealing with the /reporting endpoint
 * @deprecated v2.x.x - Use Reports API instead
 *
 * @export
 * @class Reconciliation
 */
export default class Reconciliation {
    constructor(config) {
        this.config = config;
    }

    /**
     * Returns a JSON report containing all payments within your specified parameters
     *
     * @memberof Reconciliation
     * @param {Object} body Reconciliation request body.
     * @return {Promise<Object>} A promise to the request reconciliation response.
     */
    async getPayments(body) {
        try {
            const url = buildQueryParams(`${this.config.host}/${REPORTING_PATH}/${PAYMENTS_PATH}`, body);

            const response = await get(this.config.httpClient, url, this.config, this.config.sk);
            const res = await response.json;

            // In case there is a "next" page, inject it in the response body
            if (res._links && res._links.next) {
                const nextLink = res._links.next.href;
                return await { ...res, page: nextLink.match(/after=([^&]*)/)[1] };
            }
            return await res;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Returns a JSON payment report containing all of the data related to a specific payment,
     * based on the payment's identifier.
     *
     * @memberof Reconciliation
     * @param {string} paymentId Payment id.
     * @return {Promise<Object>} A promise to the request reconciliation response.
     * @throws {ValueError} If paymentId is undefined, empty, "." or "..".
     */
    async getPayment(paymentId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/${REPORTING_PATH}/${PAYMENTS_PATH}/${encodePathSegment(paymentId, 'paymentId')}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Returns a JSON report containing all payments within your specified parameters
     *
     * @memberof Reconciliation
     * @param {Object} body Reconciliation request body.
     * @return {Promise<Buffer>} A promise to the request reconciliation response.
     */
    async getPaymentsCsv(body) {
        try {
            const url = buildQueryParams(`${this.config.host}/${REPORTING_PATH}/${PAYMENTS_PATH}/${DOWNLOAD_PATH}`, body);
            const response = await get(
                this.config.httpClient,
                url,
                { ...this.config, csv: true },
                this.config.sk
            );
            return await response.csv;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Returns a JSON report containing all statements within your specified parameters.
     * Please note that the timezone for the request will be UTC.
     *
     * @memberof Reconciliation
     * @param {Object} body Reconciliation request body.
     * @return {Promise<Object>} A promise to the request reconciliation response.
     */
    async getStatements(body) {
        try {
            const url = buildQueryParams(`${this.config.host}/${REPORTING_PATH}/${STATEMENTS_PATH}`, body);
            const response = await get(this.config.httpClient, url, this.config, this.config.sk);
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Downloads a CSV statement report containing all of the data related to a specific
     * statement, based on the statement's identifier.
     *
     * @memberof Reconciliation
     * @param {string} statementId Statement id.
     * @return {Promise<Buffer>} A promise to the request reconciliation response.
     * @throws {ValueError} If statementId is undefined, empty, "." or "..".
     */
    async getStatementCsv(statementId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/${REPORTING_PATH}/${STATEMENTS_PATH}/${encodePathSegment(statementId, 'statementId')}/${PAYMENTS_PATH}/${DOWNLOAD_PATH}`,
                { ...this.config, csv: true },
                this.config.sk
            );
            return await response.csv;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Returns all associated payment actions that impact your balance within the parameters you specify
     *
     * @memberof Reconciliation
     * @param {Object} body Reconciliation request body.
     * @return {Promise<Object>} A promise to the request reconciliation response.
     */
    async getPaymentsActions(body) {
        try {
            const url = buildQueryParams(`${this.config.host}/${REPORTING_PATH}/${ACTIONS_PATH}`, body);

            const response = await get(this.config.httpClient, url, this.config, this.config.sk);
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Returns the reconciliation data of the payment action
     *
     * @memberof Reconciliation
     * @param {string} actionsId Action id.
     * @return {Promise<Object>} A promise to the request reconciliation response.
     * @throws {ValueError} If actionsId is undefined, empty, "." or "..".
     */
    async getPaymentsAction(actionsId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/${REPORTING_PATH}/${PAYMENTS_PATH}/${ACTIONS_PATH}/${encodePathSegment(actionsId, 'actionsId')}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Returns a CSV report containing all payments within your specified parameters
     *
     * @memberof Reconciliation
     * @param {Object} body Reconciliation request body.
     * @return {Promise<Buffer>} A promise to the request reconciliation response.
     */
    async getPaymentsActionsCsv(body) {
        try {
            const url = buildQueryParams(`${this.config.host}/${REPORTING_PATH}/${ACTIONS_PATH}/${DOWNLOAD_PATH}`, body);
            const response = await get(
                this.config.httpClient,
                url,
                { ...this.config, csv: true },
                this.config.sk
            );
            return await response.csv;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Returns the reconciliation data of a payment action
     *
     * @memberof Reconciliation
     * @param {string} actionId Action id.
     * @return {Promise<Object>} A promise to the request reconciliation response.
     * @throws {ValueError} If actionId is undefined, empty, "." or "..".
     */
    async getAction(actionId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/${REPORTING_PATH}/${ACTIONS_PATH}/${encodePathSegment(actionId, 'actionId')}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
