import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';
import FormData from 'form-data';

// Path segments appended to the API base (config.host).
const ENTITIES_PATH = 'entities';
const FILES_PATH = 'files';

/**
 * Platform file upload and retrieval (identity/documentation for sub-entities).
 * Uses Platforms Files URL for uploadFile; entity-scoped files use main API host.
 *
 * @export
 * @class PlatformFiles
 */
export default class PlatformFiles {
    constructor(config) {
        this.config = config;
    }

    /**
     * Upload identity documentation required for full due diligence (standalone file upload,
     * POST /files on the Files host, multipart). The returned id is what a document's front and
     * back fields take in onboardSubEntity.
     *
     * Onboarding purposes (PlatformsFileUpload): additional_document, articles_of_association,
     * bank_verification, certified_authorised_signatory, company_ownership, company_verification,
     * financial_verification, identity_verification, proof_of_legality, proof_of_principal_address,
     * shareholder_structure, tax_verification, proof_of_residential_address, proof_of_registration.
     *
     * @param {string} purpose The purpose of the file upload, one of the values above.
     * @param {Object} path The local path of the file to upload, and its type.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async uploadFile(purpose, path) {
        try {
            const form = new FormData();
            form.append('path', path);
            form.append('purpose', purpose);

            const url = this.config.filesUrl;

            const response = await post(
                this.config.httpClient,
                url,
                { ...this.config, formData: true },
                this.config.sk,
                form
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Generate a file upload link for a sub-entity (POST /entities/{entityId}/files). The body is
     * { purpose } only; the response carries the file id, maximum_size_in_bytes,
     * document_types_for_purpose and _links.upload, the link the file content is then sent to.
     *
     * Onboarding purposes (PlatformsFileUpload): additional_document, articles_of_association,
     * bank_verification, certified_authorised_signatory, company_ownership, company_verification,
     * financial_verification, identity_verification, proof_of_legality, proof_of_principal_address,
     * shareholder_structure, tax_verification, proof_of_residential_address, proof_of_registration.
     *
     * @param {string} entityId The ID of the sub-entity.
     * @param {Object} body The body; body.purpose is the purpose of the file upload, one of the
     *   values above.
     * @returns {Promise<Object>} A promise to the file id and upload link.
     */
    async uploadAFile(entityId, body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/${ENTITIES_PATH}/${entityId}/${FILES_PATH}`,
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
     * Retrieve information about a previously uploaded file for a sub-entity
     * (GET /entities/{entityId}/files/{fileId}).
     *
     * @param {string} entityId The ID of the sub-entity.
     * @param {string} fileId The ID of the file (prefix file_).
     * @returns {Promise<Object>} A promise to the file's id, status, status_reasons, size,
     *   mime_type, uploaded_on and purpose.
     */
    async retrieveAFile(entityId, fileId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/${ENTITIES_PATH}/${entityId}/${FILES_PATH}/${fileId}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
