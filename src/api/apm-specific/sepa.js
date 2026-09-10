import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';

// Path segments appended to the API base (config.host).
const CANCEL_PATH = 'cancel';
const MANDATES_PATH = 'mandates';
const PPRO_PATH = 'ppro';
const SEPA_EXTERNAL_PATH = 'sepa-external';
const SEPA_PATH = 'sepa';

/**
 * Class dealing with the /sepa and /ppro/sepa endpoint
 *
 * @export
 * @class Sepa
 */
export default class Sepa {
    constructor(config) {
        this.config = config;
    }

    /**
     * Get mandate
     *
     * @param {string} id Source id
     * @return {Promise<Object>} A promise to the Sepa response.
     */
    async getMandate(id) {
        const url = this.config.host.includes('sandbox')
            ? `${this.config.host}/${SEPA_EXTERNAL_PATH}/${MANDATES_PATH}/${id}`
            : `${this.config.host}/${SEPA_PATH}/${MANDATES_PATH}/${id}`;
        try {
            const response = await get(this.config.httpClient, url, this.config, this.config.sk);
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Cancel mandate
     *
     * @param {string} id Source id
     * @return {Promise<Object>} A promise to the Sepa response.
     */
    async cancelMandate(id) {
        const url = this.config.host.includes('sandbox')
            ? `${this.config.host}/${SEPA_EXTERNAL_PATH}/${MANDATES_PATH}/${id}/${CANCEL_PATH}`
            : `${this.config.host}/${SEPA_PATH}/${MANDATES_PATH}/${id}/${CANCEL_PATH}`;

        try {
            const response = await post(this.config.httpClient, url, this.config, this.config.sk);
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Get mandate via PPRO
     *
     * @param {string} id Source id
     * @return {Promise<Object>} A promise to the Sepa response.
     */
    async getPPROMandate(id) {
        const url = this.config.host.includes('sandbox')
            ? `${this.config.host}/${PPRO_PATH}/${SEPA_EXTERNAL_PATH}/${MANDATES_PATH}/${id}`
            : `${this.config.host}/${PPRO_PATH}/${SEPA_PATH}/${MANDATES_PATH}/${id}`;
        try {
            const response = await get(this.config.httpClient, url, this.config, this.config.sk);
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Cancel mandate via PPRO
     *
     * @param {string} id Source id
     * @return {Promise<Object>} A promise to the Sepa response.
     */
    async cancelPPROMandate(id) {
        const url = this.config.host.includes('sandbox')
            ? `${this.config.host}/${PPRO_PATH}/${SEPA_EXTERNAL_PATH}/${MANDATES_PATH}/${id}/${CANCEL_PATH}`
            : `${this.config.host}/${PPRO_PATH}/${SEPA_PATH}/${MANDATES_PATH}/${id}/${CANCEL_PATH}`;

        try {
            const response = await post(this.config.httpClient, url, this.config, this.config.sk);
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
