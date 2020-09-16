import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import http from '../../services/http';

/**
 * Class dealing with the /disputes endpoint
 *
 * @export
 * @class Disputes
 */
export default class Disputes {
    constructor(config) {
        this.config = config;
    }

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
    async get(body) {
        try {
            let url = `${this.config.host}/disputes`;

            if (body) {
                const queryString = Object.keys(body)
                    .map((key) => `${key}=${body[key]}`)
                    .join('&');
                url += `?${queryString}`;
            }
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'get',
                    url,
                    headers: { Authorization: this.config.sk },
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Returns all the details of a dispute using the dispute identifier.
     *
     * @memberof Disputes
     * @param {String} disputeId Dispute id.
     * @return {Promise<Object>} A promise to the dispute response.
     */
    async getDetails(disputeId) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'get',
                    url: `${this.config.host}/disputes/${disputeId}`,
                    headers: { Authorization: this.config.sk },
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Returns all the details of a dispute using the dispute identifier.
     *
     * @memberof Disputes
     * @param {String} disputeId Dispute id.
     * @return {Promise<Object>} A promise to the dispute response.
     */
    async accept(disputeId) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'post',
                    url: `${this.config.host}/disputes/${disputeId}/accept`,
                    headers: { Authorization: this.config.sk },
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

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
     * @param {String} disputeId Dispute id.
     * @param {Object} body Evidence
     * @return {Promise<Object>} A promise to the dispute response.
     */
    async provideEvidence(disputeId, body) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'put',
                    url: `${this.config.host}/disputes/${disputeId}/evidence`,
                    headers: { Authorization: this.config.sk },
                    body,
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Retrieves a list of the evidence submitted in response to a specific dispute.
     *
     * @memberof Disputes
     * @param {String} disputeId Dispute id.
     * @return {Promise<Object>} A promise to the dispute response.
     */
    async getEvidence(disputeId) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'get',
                    url: `${this.config.host}/disputes/${disputeId}/evidence`,
                    headers: { Authorization: this.config.sk },
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * With this final request, you can submit the evidence that you have previously
     * provided. Make sure you have provided all the relevant information before using
     * this request. You will not be able to amend your evidence once you have submitted it.
     *
     * @memberof Disputes
     * @param {String} disputeId Dispute id.
     * @return {Promise<Object>} A promise to the dispute response.
     */
    async submit(disputeId) {
        try {
            const response = await http(
                fetch,
                { timeout: this.config.timeout, agent: this.config.agent },
                {
                    method: 'post',
                    url: `${this.config.host}/disputes/${disputeId}/evidence`,
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
