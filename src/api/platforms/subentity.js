import { determineError } from '../../services/errors.js';
import { get, post, put } from '../../services/http.js';
import { getConfigWithAcceptHeader } from './accept-header.js';

// Path segments appended to the API base (config.host).
const ACCOUNTS_PATH = 'accounts';
const ENTITIES_PATH = 'entities';
const MEMBERS_PATH = 'members';

/**
 * Sub-entity (accounts/entities) operations for the Platforms API.
 *
 * @export
 * @class Subentity
 */
export default class Subentity {
    constructor(config) {
        this.config = config;
    }

    /**
     * Onboard a sub-entity so they can start receiving payments (POST /accounts/entities).
     *
     * The body is sent as given. Which fields are required depends on the onboarding variant
     * (region, company or sole trader, Full or Lite, schema version). The main fields of a v3.0
     * request:
     *  - body.reference: [Required] string, 1 to 50 characters.
     *  - body.contact_details: { phone: { country_code, number }, email_addresses: { primary },
     *    invitee: { email } }. On v3.0 phone.country_code is the ISO 3166-1 alpha-2 country
     *    where the number is registered (for example "FR"), not the dialling code; v2.0 takes
     *    number only.
     *  - body.profile: [Required] { urls, mccs, default_holding_currency, holding_currencies }.
     *  - body.company: { legal_name, trading_name, business_registration_number, business_type,
     *    date_of_incorporation, principal_address, registered_address, representatives }.
     *  - body.company.representatives[]: a person of interest { id, individual, roles,
     *    company_position, ownership_percentage, documents }, or, on EEA and GB Company Full
     *    (3.0), a controlling company { id, company: { legal_name, trading_name,
     *    registered_address }, ownership_percentage }. Sole traders have exactly one
     *    representative, with roles ["ubo"].
     *  - body.processing_details: [Required on v3.0] { settlement_country, target_countries,
     *    annual_processing_volume, average_transaction_value, highest_transaction_value,
     *    currency }; amounts in minor units without decimals.
     *  - body.individual: v2.0 sole traders only. On v3.0 a sole trader is onboarded as
     *    body.company with one representative.
     *
     * **Documents go in two different places, and the two objects behave differently.**
     *
     *  - body.company.representatives[].documents: the representative's own documents. On v3.0
     *    the API validates this object **strictly**: it accepts only these four keys and rejects
     *    any other.
     *      - identity_verification: type passport, national_identity_card, driving_license,
     *        citizen_card, residence_permit or electoral_id. Required on Sole Trader Full (3.0);
     *        optional on the company variants.
     *      - certified_authorised_signatory: type power_of_attorney. Company Full (3.0), optional.
     *      - proof_of_residential_address: type proof_of_address. EEA Sole Trader Full (3.0) only,
     *        required there.
     *      - proof_of_registration: type extract_from_trade_register or other. EEA Sole Trader Full
     *        (3.0) only, required there.
     *    Each is { type, front } (identity_verification also takes back). front and back are file
     *    IDs, ^file_[a-z2-7]{26}$.
     *
     *  - body.documents: the top-level documents. The API ignores keys it does not recognise here
     *    rather than rejecting them, so a representative document placed here is dropped silently.
     *    Keys: company_verification (incorporation_document), articles_of_association
     *    (memorandum_of_association, articles_of_association), bank_verification (bank_statement),
     *    shareholder_structure (certified_shareholder_structure), proof_of_legality
     *    (proof_of_legality), proof_of_principal_address (proof_of_address), tax_verification
     *    (ein_letter), financial_verification (financial_statement), financial_statements
     *    (financial_statements), additional_document1/2/3 ({ front } only, no type), and
     *    identity_verification on the v2.0 sole trader variants.
     *
     * Upload each file first (see PlatformFiles.uploadFile) and use the returned ID as front.
     *
     * @param {Object} body Platforms request body, as described above.
     * @param {string} [schemaVersion='3.0'] Schema version to use (1.0, 2.0, or 3.0).
     * @return {Promise<Object>} A promise to the Platforms response: the sub-entity id, reference,
     *   status (draft after POST), capabilities and requirements_due.
     */
    async onboardSubEntity(body, schemaVersion) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/${ACCOUNTS_PATH}/${ENTITIES_PATH}`,
                getConfigWithAcceptHeader(this.config, schemaVersion),
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Retrieve a sub-entity and its full details (GET /accounts/entities/{id}).
     * The response carries the same shape as the onboarding body, including
     * company.representatives[].documents and the top-level documents and processing_details.
     *
     * @param {string} id Sub-entity id.
     * @param {string} [schemaVersion='3.0'] Schema version to use (1.0, 2.0, or 3.0).
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async getSubEntityDetails(id, schemaVersion) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/${ACCOUNTS_PATH}/${ENTITIES_PATH}/${id}`,
                getConfigWithAcceptHeader(this.config, schemaVersion),
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Update sub-entity details (PUT /accounts/entities/{id}). The body takes the same shape as
     * onboardSubEntity, including both documents objects and their different validation (see
     * onboardSubEntity). Set body.is_draft to true to keep the sub-entity in draft and skip due
     * diligence checks.
     *
     * @param {string} id Sub-entity id.
     * @param {Object} body Platforms request body, as described in onboardSubEntity.
     * @param {string} [schemaVersion='3.0'] Schema version to use (1.0, 2.0, or 3.0).
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async updateSubEntityDetails(id, body, schemaVersion) {
        try {
            const response = await put(
                this.config.httpClient,
                `${this.config.host}/${ACCOUNTS_PATH}/${ENTITIES_PATH}/${id}`,
                getConfigWithAcceptHeader(this.config, schemaVersion),
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Retrieve information on all users of a sub-entity invited through Hosted Onboarding.
     *
     * @param {string} entityId Sub-entity id.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async getSubEntityMembers(entityId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/${ACCOUNTS_PATH}/${ENTITIES_PATH}/${entityId}/${MEMBERS_PATH}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Resend an invitation to the user of a sub-entity (Hosted Onboarding).
     *
     * @param {string} entityId The ID of the sub-entity.
     * @param {string} userId The ID of the invited user.
     * @param {Object} body The body (Reinvite sub-entity member).
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    async reinviteSubEntityMember(entityId, userId, body) {
        try {
            const response = await put(
                this.config.httpClient,
                `${this.config.host}/${ACCOUNTS_PATH}/${ENTITIES_PATH}/${entityId}/${MEMBERS_PATH}/${userId}`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
