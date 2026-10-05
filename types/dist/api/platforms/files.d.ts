import {config} from '../../Checkout';

/** The onboarding upload purposes (PlatformsFileUpload). */
export type PlatformsFilePurpose =
    | 'additional_document'
    | 'articles_of_association'
    | 'bank_verification'
    | 'certified_authorised_signatory'
    | 'company_ownership'
    | 'company_verification'
    | 'financial_verification'
    | 'identity_verification'
    | 'proof_of_legality'
    | 'proof_of_principal_address'
    | 'shareholder_structure'
    | 'tax_verification'
    | 'proof_of_residential_address'
    | 'proof_of_registration';

/** POST /entities/{entityId}/files response (PlatformsFileUploadResponse). */
export type PlatformsFileUploadResponse = {
    id?: string;
    maximum_size_in_bytes?: number;
    document_types_for_purpose?: string[];
    _links?: { upload?: { href?: string }; self?: { href?: string } };
};

/** GET /entities/{entityId}/files/{fileId} response (PlatformsFileRetrieveResponse). */
export type PlatformsFileRetrieveResponse = {
    id?: string;
    status?: string;
    status_reasons?: string[];
    size?: number;
    mime_type?: string;
    uploaded_on?: string;
    purpose?: string;
    _links?: { [key: string]: { href?: string } };
};

// `(string & {})` keeps any string accepted while editors still suggest the known purposes.
export default class PlatformFiles {
    constructor(config: config);

    uploadFile: (purpose: PlatformsFilePurpose | (string & {}), path: string) => Promise<Object>;
    uploadAFile: (
        entityId: string,
        body: { purpose: PlatformsFilePurpose | (string & {}) } | Object
    ) => Promise<PlatformsFileUploadResponse>;
    retrieveAFile: (entityId: string, fileId: string) => Promise<PlatformsFileRetrieveResponse>;
}
