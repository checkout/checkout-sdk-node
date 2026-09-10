import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';

// Path segments appended to the API base (config.host).
const DOMAINS_PATH = 'domains';
const DOMAIN_PATH = 'domain';
const ENROLLMENTS_PATH = 'enrollments';
const GOOGLEPAY_PATH = 'googlepay';
const STATE_PATH = 'state';

/**
 * Class dealing with the /googlepay endpoints.
 *
 * All endpoints require OAuth authentication.
 *
 * @export
 * @class GooglePay
 */
export default class GooglePay {
    constructor(config) {
        this.config = config;
    }

    /**
     * Enroll an entity to the Google Pay service.
     *
     * Body per swagger `GooglePayEnrollmentRequest`:
     *  - entity_id, email_address, accept_terms_of_service (all required)
     *
     * @memberof GooglePay
     * @param {Object} body Enrollment request.
     * @return {Promise<Object>} A promise that resolves on success.
     */
    async enroll(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/${GOOGLEPAY_PATH}/${ENROLLMENTS_PATH}`,
                this.config,
                this.config.access,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Register a web domain for an enrolled entity.
     *
     * @memberof GooglePay
     * @param {string} entityId The enrolled entity id.
     * @param {Object} body { web_domain: string } per swagger `GooglePayRegisterDomainRequest`.
     * @return {Promise<Object>} A promise that resolves on success.
     */
    async registerDomain(entityId, body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/${GOOGLEPAY_PATH}/${ENROLLMENTS_PATH}/${entityId}/${DOMAIN_PATH}`,
                this.config,
                this.config.access,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * List the web domains registered for an entity.
     *
     * @memberof GooglePay
     * @param {string} entityId The enrolled entity id.
     * @return {Promise<Object>} A promise to the registered-domains response.
     */
    async getRegisteredDomains(entityId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/${GOOGLEPAY_PATH}/${ENROLLMENTS_PATH}/${entityId}/${DOMAINS_PATH}`,
                this.config,
                this.config.access
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Get the enrollment state for an entity.
     *
     * @memberof GooglePay
     * @param {string} entityId The enrolled entity id.
     * @return {Promise<Object>} A promise to the enrollment-state response.
     */
    async getEnrollmentState(entityId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/${GOOGLEPAY_PATH}/${ENROLLMENTS_PATH}/${entityId}/${STATE_PATH}`,
                this.config,
                this.config.access
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
