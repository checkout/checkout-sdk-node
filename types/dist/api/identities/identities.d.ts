import { config } from '../../Checkout';
import Applicants from './applicants';
import IdentityVerifications from './identity-verifications';
import AMLScreenings from './aml-screenings';
import FaceAuthentications from './face-authentications';
import IDDocumentVerifications from './id-document-verifications';

export default class Identities {
    constructor(config: config);

    applicants: Applicants;
    identityVerifications: IdentityVerifications;
    amlScreenings: AMLScreenings;
    faceAuthentications: FaceAuthentications;
    idDocumentVerifications: IDDocumentVerifications;

    // Backwards compatibility - Applicants
    createApplicant(body: object): Promise<object>;
    getApplicant(applicantId: string): Promise<object>;
    updateApplicant(applicantId: string, body: object): Promise<object>;
    anonymizeApplicant(applicantId: string): Promise<object>;

    // Backwards compatibility - AML Screenings
    createAMLVerification(body: object): Promise<object>;
    getAMLScreening(amlScreeningId: string): Promise<object>;

    // Backwards compatibility - Face Authentications
    createFaceAuthentication(body: object): Promise<object>;
    getFaceAuthentication(faceAuthenticationId: string): Promise<object>;
    listFaceAuthenticationAttempts(faceAuthenticationId: string): Promise<object>;
    getFaceAuthenticationAttempt(faceAuthenticationId: string, attemptId: string): Promise<object>;
    createFaceAuthenticationAttempt(faceAuthenticationId: string, body: object): Promise<object>;
    anonymizeFaceAuthentication(faceAuthenticationId: string): Promise<object>;

    // Backwards compatibility - ID Document Verifications
    createIDDocumentVerification(body: object): Promise<object>;
    getIDDocumentVerification(idDocumentVerificationId: string): Promise<object>;
    listIDDocumentVerificationAttempts(idDocumentVerificationId: string): Promise<object>;
    getIDDocumentVerificationAttempt(idDocumentVerificationId: string, attemptId: string): Promise<object>;
    createIDDocumentVerificationAttempt(idDocumentVerificationId: string, body: object): Promise<object>;
    anonymizeIDDocumentVerification(idDocumentVerificationId: string): Promise<object>;
    getIDDocumentVerificationPDFReport(idDocumentVerificationId: string): Promise<Buffer>;

    // Backwards compatibility - Identity Verifications
    createIdentityVerification(body: object): Promise<object>;
    createAndStartIdentityVerification(body: object): Promise<object>;
    getIdentityVerification(identityVerificationId: string): Promise<object>;
    createIdentityVerificationAttempt(identityVerificationId: string, body: object): Promise<object>;
    listIdentityVerificationAttempts(identityVerificationId: string): Promise<object>;
    getIdentityVerificationAttempt(identityVerificationId: string, attemptId: string): Promise<object>;
    anonymizeIdentityVerification(identityVerificationId: string): Promise<object>;
    getIdentityVerificationPDFReport(identityVerificationId: string): Promise<Buffer>;
}
