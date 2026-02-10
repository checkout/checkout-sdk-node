import { determineError } from '../../services/errors.js';
import { get, post, put } from '../../services/http.js';

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
            const response = await get(this.config.httpClient, url, this.config, this.config.sk);
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Returns all the details of a dispute using the dispute identifier.
     *
     * @memberof Disputes
     * @param {string} disputeId Dispute id.
     * @return {Promise<Object>} A promise to the dispute response.
     */
    async getDetails(disputeId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/disputes/${disputeId}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Returns all the details of a dispute using the dispute identifier.
     *
     * @memberof Disputes
     * @param {string} disputeId Dispute id.
     * @return {Promise<Object>} A promise to the dispute response.
     */
    async accept(disputeId) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/disputes/${disputeId}/accept`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
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
     * @param {string} disputeId Dispute id.
     * @param {Object} body Evidence
     * @return {Promise<Object>} A promise to the dispute response.
     */
    async provideEvidence(disputeId, body) {
        try {
            const response = await put(
                this.config.httpClient,
                `${this.config.host}/disputes/${disputeId}/evidence`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Retrieves a list of the evidence submitted in response to a specific dispute.
     *
     * @memberof Disputes
     * @param {string} disputeId Dispute id.
     * @return {Promise<Object>} A promise to the dispute response.
     */
    async getEvidence(disputeId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/disputes/${disputeId}/evidence`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * With this final request, you can submit the evidence that you have previously
     * provided. Make sure you have provided all the relevant information before using
     * this request. You will not be able to amend your evidence once you have submitted it.
     *
     * @memberof Disputes
     * @param {string} disputeId Dispute id.
     * @return {Promise<Object>} A promise to the dispute response.
     */
    async submit(disputeId) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/disputes/${disputeId}/evidence`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Retrieves the unique identifier of the PDF file containing all the evidence submitted to represent the dispute case.
     * To retrieve the file's download link, call the GET /files/{file_id} endpoint with the returned file ID.
     * Evidence submitted before February 2024 cannot be retrieved using this endpoint.
     *
     * @memberof Disputes
     * @param {string} disputeId Dispute id.
     * @return {Promise<Object>} A promise to the compiled submitted evidence response.
     */
    async getCompiledSubmittedEvidence(disputeId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/disputes/${disputeId}/evidence/submitted`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Returns all of the scheme files of a dispute using the dispute identifier.
     * Currently available only for VISA disputes.
     *
     * @memberof Disputes
     * @param {string} disputeId Dispute id.
     * @return {Promise<Object>} A promise to the dispute scheme files response.
     */
    async getDisputeSchemeFiles(disputeId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/disputes/${disputeId}/schemefiles`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Submit dispute arbitration evidence.
     * Submits the previously provided arbitration evidence to the scheme.
     * You cannot amend evidence after you submit with this endpoint. Ensure you have provided all of the required information.
     *
     * @memberof Disputes
     * @param {string} disputeId Dispute id.
     * @return {Promise<void>} A promise that resolves when evidence is submitted successfully (204 No Content).
     */
    async submitArbitrationEvidence(disputeId) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/disputes/${disputeId}/evidence/arbitration`,
                this.config,
                this.config.sk
            );
            // 204 No Content - return undefined
            if (response.status === 204) {
                return undefined;
            }
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Get dispute submitted arbitration evidence.
     * Retrieves the unique identifier of the PDF file containing all the evidence submitted to escalate the dispute to arbitration.
     * To retrieve the file's download link, call the GET /files/{file_id} endpoint with the returned file ID.
     *
     * @memberof Disputes
     * @param {string} disputeId Dispute id.
     * @return {Promise<Object>} A promise to the compiled submitted arbitration evidence response.
     */
    async getCompiledSubmittedArbitrationEvidence(disputeId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/disputes/${disputeId}/evidence/arbitration/submitted`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
