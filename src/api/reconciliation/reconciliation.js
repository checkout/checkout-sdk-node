import { determineError } from '../../services/errors';
import { get } from '../../services/http';

/**
 * Class dealing with the /reporting endpoint
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
            let url = `${this.config.host}/reporting/payments`;

            if (body) {
                const queryString = Object.keys(body)
                    .map((key) => `${key}=${body[key]}`)
                    .join('&');
                url += `?${queryString}`;
            }

            const response = await get(this.config.httpClient, url, this.config, this.config.sk);
            const res = await response.json;

            // In case there is a "next" page, inject it in the response body
            if (res._links && res._links.next) {
                const nextLink = res._links.next.href;
                return await { ...res, page: nextLink.match(/after=([^&]*)/)[1] };
            }
            return await res;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Returns a JSON payment report containing all of the data related to a specific payment,
     * based on the payment's identifier.
     *
     * @memberof Reconciliation
     * @param {string} paymentId Payment id.
     * @return {Promise<Object>} A promise to the request reconciliation response.
     */
    async getPayment(paymentId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/reporting/payments/${paymentId}`,
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
     * Returns a JSON report containing all payments within your specified parameters
     *
     * @memberof Reconciliation
     * @param {Object} body Reconciliation request body.
     * @return {Promise<Buffer>} A promise to the request reconciliation response.
     */
    async getPaymentsCsv(body) {
        try {
            let url = `${this.config.host}/reporting/payments/download`;

            if (body) {
                const queryString = Object.keys(body)
                    .map((key) => `${key}=${body[key]}`)
                    .join('&');
                url += `?${queryString}`;
            }
            const response = await get(
                this.config.httpClient,
                url,
                { ...this.config, csv: true },
                this.config.sk
            );
            return await response.csv;
        } catch (err) {
            const error = await determineError(err);
            throw error;
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
            let url = `${this.config.host}/reporting/statements`;

            if (body) {
                const queryString = Object.keys(body)
                    .map((key) => `${key}=${body[key]}`)
                    .join('&');
                url += `?${queryString}`;
            }
            const response = await get(this.config.httpClient, url, this.config, this.config.sk);
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Downloads a CSV statement report containing all of the data related to a specific
     * statement, based on the statement's identifier.
     *
     * @memberof Reconciliation
     * @param {string} statementId Statement id.
     * @return {Promise<Buffer>} A promise to the request reconciliation response.
     */
    async getStatementCsv(statementId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/reporting/statements/${statementId}/payments/download`,
                { ...this.config, csv: true },
                this.config.sk
            );
            return await response.csv;
        } catch (err) {
            const error = await determineError(err);
            throw error;
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
            let url = `${this.config.host}/reporting/actions`;

            if (body) {
                const queryString = Object.keys(body)
                    .map((key) => `${key}=${body[key]}`)
                    .join('&');
                url += `?${queryString}`;
            }

            const response = await get(this.config.httpClient, url, this.config, this.config.sk);
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Returns the reconciliation data of the payment action
     *
     * @memberof Reconciliation
     * @param {string} actionsId Action id.
     * @return {Promise<Object>} A promise to the request reconciliation response.
     */
    async getPaymentsAction(actionsId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/reporting/payments/actions/${actionsId}`,
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
     * Returns a CSV report containing all payments within your specified parameters
     *
     * @memberof Reconciliation
     * @param {Object} body Reconciliation request body.
     * @return {Promise<Buffer>} A promise to the request reconciliation response.
     */
    async getPaymentsActionsCsv(body) {
        try {
            let url = `${this.config.host}/reporting/actions/download`;

            if (body) {
                const queryString = Object.keys(body)
                    .map((key) => `${key}=${body[key]}`)
                    .join('&');
                url += `?${queryString}`;
            }
            const response = await get(
                this.config.httpClient,
                url,
                { ...this.config, csv: true },
                this.config.sk
            );
            return await response.csv;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Returns the reconciliation data of a payment action
     *
     * @memberof Reconciliation
     * @param {string} actionId Action id.
     * @return {Promise<Object>} A promise to the request reconciliation response.
     */
    async getAction(actionId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/reporting/actions/${actionId}`,
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
