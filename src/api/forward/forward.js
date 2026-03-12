import { determineError } from '../../services/errors.js';
import { _delete, get, patch, post } from '../../services/http.js';

/**
 * Class dealing with the /forward endpoint
 *
 * @export
 * @class Forward
 */
export default class Forward {
    constructor(config) {
        this.config = config;
    }

    /**
     * Beta
     * Forwards an API request to a third-party endpoint.
     * For example, you can forward payment credentials you've stored in our Vault to a third-party payment processor.
     *
     * @memberof Forward
     * @param {Object} body Forward request body
     * @return {Promise<Object>} A promise to the forward response
     */
    async forwardRequest(body) {
        try {
            const response = await post(
                this.config.httpClient,
                this.config.forwardUrl,
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
     * Retrieve the details of a successfully forwarded API request.
     * The details can be retrieved for up to 14 days after the request was initiated.
     *
     * @memberof Forward
     * @param {string} id The unique identifier of the forward request
     * @return {Promise<Object>} A promise to the forward request details
     */
    async get(id) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.forwardUrl}/${id}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Create a new secret with a plaintext value.
     * 
     * Validation Rules:
     * - name: 1-64 characters, alphanumeric + underscore
     * - value: max 8KB
     * - entity_id (optional): when provided, secret is scoped to this entity
     *
     * @memberof Forward
     * @param {Object} body Secret creation body with name, value, and optional entity_id
     * @return {Promise<Object>} A promise to the secret metadata
     */
    async createSecret(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.forwardUrl}/secrets`,
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
     * Returns metadata for secrets scoped for client_id.
     *
     * @memberof Forward
     * @return {Promise<Object>} A promise to the list of secrets metadata
     */
    async listSecrets() {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.forwardUrl}/secrets`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Update an existing secret. After updating, the version is automatically incremented.
     * 
     * Validation Rules:
     * - Only value and entity_id can be updated
     * - value: max 8KB
     *
     * @memberof Forward
     * @param {string} name The secret name
     * @param {Object} body Update body with value and/or entity_id
     * @return {Promise<Object>} A promise to the updated secret metadata with incremented version
     */
    async updateSecret(name, body) {
        try {
            const response = await patch(
                this.config.httpClient,
                `${this.config.forwardUrl}/secrets/${name}`,
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
     * Permanently delete a secret by name.
     *
     * @memberof Forward
     * @param {string} name The secret name to delete
     * @return {Promise<Object>} A promise to the deletion response
     */
    async deleteSecret(name) {
        try {
            const response = await _delete(
                this.config.httpClient,
                `${this.config.forwardUrl}/secrets/${name}`,
                this.config,
                this.config.sk
            );
            // DELETE typically returns 204 with no content, so return undefined
            return response.status === 204 ? undefined : await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
