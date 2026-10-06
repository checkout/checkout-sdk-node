import {config} from '../../Checkout';

/** A document file reference: the file ID returned by an upload, ^file_[a-z2-7]{26}$. */
export type OnboardingDocument<T extends string = string> = {
    type: T;
    front: string;
};

/**
 * company.representatives[].documents. Strict on the Company Full and Sole Trader Full (3.0)
 * variants of EEA, GB and US: the API rejects any other key there.
 */
export type RepresentativeDocuments = {
    identity_verification?: OnboardingDocument<
        | 'passport'
        | 'national_identity_card'
        | 'driving_license'
        | 'citizen_card'
        | 'residence_permit'
        | 'electoral_id'
    > & { back?: string };
    certified_authorised_signatory?: OnboardingDocument<'power_of_attorney'>;
    /** EEA Sole Trader Full (3.0) only, required there. */
    proof_of_residential_address?: OnboardingDocument<'proof_of_address'>;
    /** EEA Sole Trader Full (3.0) only, required there. */
    proof_of_registration?: OnboardingDocument<'extract_from_trade_register' | 'other'>;
};

/** The top-level documents. Which keys apply depends on the variant; see onboardSubEntity. */
export type OnboardSubEntityDocuments = {
    company_verification?: OnboardingDocument<'incorporation_document' | 'articles_of_association'>;
    articles_of_association?: OnboardingDocument<'memorandum_of_association' | 'articles_of_association'>;
    bank_verification?: OnboardingDocument<'bank_statement'>;
    shareholder_structure?: OnboardingDocument<'certified_shareholder_structure'>;
    proof_of_legality?: OnboardingDocument<'proof_of_legality'>;
    proof_of_principal_address?: OnboardingDocument<'proof_of_address'>;
    tax_verification?: OnboardingDocument<'ein_letter'>;
    financial_verification?: OnboardingDocument<'financial_statement'>;
    financial_statements?: OnboardingDocument<'financial_statements'>;
    additional_document1?: { front: string };
    additional_document2?: { front: string };
    additional_document3?: { front: string };
    /** v2.0 sole trader variants only. */
    identity_verification?: RepresentativeDocuments['identity_verification'];
    [key: string]: any;
};

export type EntityEmailAddresses = {
    primary?: string;
    /** [Required] on the US ISV Seller variants (3.0), with primary. */
    pci_compliance_contact?: string;
};

/**
 * The onboarding body. Only the documents sub-tree and the email addresses are typed; every
 * other field is passed through as given.
 */
export type OnboardSubEntityRequest = {
    reference?: string;
    contact_details?: {
        email_addresses?: EntityEmailAddresses;
        invitee?: { email: string };
        [key: string]: any;
    };
    company?: {
        representatives?: Array<{ documents?: RepresentativeDocuments; [key: string]: any }>;
        [key: string]: any;
    };
    documents?: OnboardSubEntityDocuments;
    [key: string]: any;
};

export default class Subentity {
    constructor(config: config);

    onboardSubEntity: (body: OnboardSubEntityRequest, schemaVersion?: string) => Promise<Object>;
    getSubEntityDetails: (id: string, schemaVersion?: string) => Promise<Object>;
    updateSubEntityDetails: (id: string, body: OnboardSubEntityRequest, schemaVersion?: string) => Promise<Object>;
    getSubEntityMembers: (entityId: string) => Promise<Object>;
    reinviteSubEntityMember: (entityId: string, userId: string, body: Object) => Promise<Object>;
}
