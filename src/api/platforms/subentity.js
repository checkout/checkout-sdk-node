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
     *  - body.contact_details: [Required on every variant except EEA Company Full (3.0)]
     *    { phone: { country_code, number }, email_addresses: { primary }, invitee: { email } }.
     *    On v3.0 phone.country_code is the ISO 3166-1 alpha-2 country where the number is
     *    registered (for example "FR"), not the dialling code; v2.0 takes number only. The US ISV
     *    Seller variants take email_addresses: { primary, pci_compliance_contact } and no invitee;
     *    there both are [Required], email addresses, and pci_compliance_contact is the person
     *    responsible for PCI compliance at the sub-entity. invitee.email is [Required] in the
     *    hosted onboarding invite body ({ reference, is_draft, contact_details: { invitee } }) and
     *    [Optional] in the Full and Lite onboarding variants.
     *  - body.profile: [Required] { urls, mccs, default_holding_currency, holding_currencies }.
     *  - body.company: { legal_name, trading_name, business_registration_number, business_type,
     *    date_of_incorporation, principal_address, registered_address, representatives }, plus
     *    regulatory_licence_number on EEA Company Full (3.0) and additional_trading_names on the
     *    US ISV Seller variants. A v3.0 sole trader's company has no legal_name,
     *    business_registration_number or registered_address; it takes trading_name, business_type,
     *    date_of_incorporation, principal_address and representatives (plus
     *    is_registered_company and additional_trading_names on US ISV Seller Sole Trader).
     *  - body.company.representatives[]: a person of interest { id, individual, roles,
     *    company_position, ownership_percentage, documents }, or, on EEA and GB Company Full
     *    (3.0), a controlling company { id, company: { legal_name, trading_name,
     *    registered_address }, ownership_percentage }. On the US ISV Seller variants a
     *    representative has no id: { individual, roles, company_position, ownership_percentage,
     *    documents } (no company_position on the sole trader). Sole traders have exactly one
     *    representative, with roles ["ubo"].
     *  - body.processing_details: [Required on v3.0] { settlement_country, target_countries,
     *    annual_processing_volume, average_transaction_value, highest_transaction_value,
     *    currency }; amounts in minor units without decimals. The US ISV Seller variants take
     *    { annual_processing_volume, average_transaction_value, average_order_fulfillment_time,
     *    currency, target_countries, payments } instead.
     *  - body.agreed_terms and body.seller_category: [Required] on the US ISV Seller variants
     *    only.
     *  - body.individual: v2.0 sole traders only. On v3.0 a sole trader is onboarded as
     *    body.company with one representative.
     *
     * **Documents go in two different places, and the two objects behave differently.**
     *
     *  - body.company.representatives[].documents: the representative's own documents. On the
     *    Company Full and Sole Trader Full (3.0) variants of EEA, GB and US the API validates this
     *    object **strictly**: it accepts only the keys below and rejects any other. The US ISV
     *    Seller variants do not reject unknown keys, and on v2.0 it takes identity_verification
     *    only.
     *      - identity_verification: type passport, national_identity_card, driving_license,
     *        citizen_card, residence_permit or electoral_id. Required on Sole Trader Full (3.0);
     *        optional on the company variants and the US ISV Seller variants.
     *      - certified_authorised_signatory: type power_of_attorney. Optional, on Company Full
     *        (3.0) and US ISV Seller Company (3.0).
     *      - proof_of_residential_address: type proof_of_address. EEA Sole Trader Full (3.0) only,
     *        required there.
     *      - proof_of_registration: type extract_from_trade_register or other. EEA Sole Trader Full
     *        (3.0) only, required there.
     *    Each is { type, front } (identity_verification also takes back). front and back are file
     *    IDs, ^file_[a-z2-7]{26}$.
     *
     *  - body.documents: the top-level documents. Unlike the strict representative object, the
     *    API ignores keys it does not recognise here rather than rejecting them: the request
     *    succeeds and a misplaced document (for example a representative document) is dropped
     *    silently. Keys by variant ([Required] marked, all
     *    others optional):
     *      - EEA Company Full (3.0): company_verification [Required], articles_of_association
     *        [Required], shareholder_structure [Required], bank_verification [Required],
     *        proof_of_legality, proof_of_principal_address, additional_document1/2/3.
     *      - GB Company Full (3.0): articles_of_association [Required], shareholder_structure
     *        [Required], company_verification, bank_verification, proof_of_legality,
     *        proof_of_principal_address, additional_document1/2/3.
     *      - US Company Full (3.0): tax_verification, company_verification,
     *        articles_of_association, bank_verification, shareholder_structure,
     *        proof_of_legality, proof_of_principal_address, additional_document1/2/3.
     *      - EEA, GB and US Sole Trader Full (3.0): bank_verification [Required],
     *        additional_document1/2/3.
     *      - US ISV Seller Company (3.0): tax_verification, company_verification,
     *        articles_of_association, shareholder_structure, proof_of_legality,
     *        proof_of_principal_address, financial_statements. US ISV Seller Sole Trader (3.0):
     *        the same without shareholder_structure.
     *      - EEA Company Full and Lite (2.0): company_verification ([Required] on Full),
     *        bank_verification, financial_verification. GB Company Full and Lite (2.0):
     *        company_verification ([Required] on Full). US Company Full and Lite (2.0):
     *        company_verification, tax_verification.
     *      - The six v2.0 sole trader variants: identity_verification [Required].
     *    Type values: company_verification incorporation_document (also articles_of_association
     *    on US Company Full and Lite (2.0)), articles_of_association memorandum_of_association or
     *    articles_of_association, bank_verification bank_statement, shareholder_structure
     *    certified_shareholder_structure, proof_of_legality proof_of_legality,
     *    proof_of_principal_address proof_of_address, tax_verification ein_letter,
     *    financial_verification financial_statement, financial_statements financial_statements,
     *    identity_verification as on the representative. Each is { type, front };
     *    additional_document1/2/3 take { front } only, no type. body.documents itself is
     *    [Required] on the Company Full and Sole Trader Full (3.0) variants of EEA, GB and US,
     *    and on EEA Company Full and EEA Sole Trader Full (2.0).
     *
     * Upload each file first (see PlatformFiles.uploadFile) and use the returned ID as front.
     *
     * @param {Object} body Platforms request body, as described above.
     * @param {string} [schemaVersion='3.0'] Schema version to use (1.0, 2.0, or 3.0).
     * @return {Promise<Object>} A promise to the Platforms response: on v3.0 the sub-entity id,
     *   reference, requirements_due and _links; v2.0 also returns capabilities.
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
     * The response carries the same shape as the onboarding body of the entity's variant,
     * including company.representatives[].documents and the top-level documents, and on v3.0
     * processing_details.
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
     * @return {Promise<Object>} A promise to the Platforms response, the same shape as the
     *   onboardSubEntity response.
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
