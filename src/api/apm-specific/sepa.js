import { determineError } from '../../services/errors';
import { get, post } from '../../services/http';

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
            ? `${this.config.host}/sepa-external/mandates/${id}`
            : `${this.config.host}/sepa/mandates/${id}`;
        try {
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
     * Cancel mandate
     *
     * @param {string} id Source id
     * @return {Promise<Object>} A promise to the Sepa response.
     */
    async cancelMandate(id) {
        const url = this.config.host.includes('sandbox')
            ? `${this.config.host}/sepa-external/mandates/${id}/cancel`
            : `${this.config.host}/sepa/mandates/${id}/cancel`;

        try {
            const response = await post(
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
     * Get mandate via PPRO
     *
     * @param {string} id Source id
     * @return {Promise<Object>} A promise to the Sepa response.
     */
    async getPPROMandate(id) {
        const url = this.config.host.includes('sandbox')
            ? `${this.config.host}/ppro/sepa-external/mandates/${id}`
            : `${this.config.host}/ppro/sepa/mandates/${id}`;
        try {
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
     * Cancel mandate via PPRO
     *
     * @param {string} id Source id
     * @return {Promise<Object>} A promise to the Sepa response.
     */
    async cancelPPROMandate(id) {
        const url = this.config.host.includes('sandbox')
            ? `${this.config.host}/ppro/sepa-external/mandates/${id}/cancel`
            : `${this.config.host}/ppro/sepa/mandates/${id}/cancel`;

        try {
            const response = await post(
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
}
