import Applicants from './applicants.js';
import IdentityVerifications from './identity-verifications.js';
import AMLScreenings from './aml-screenings.js';
import FaceAuthentications from './face-authentications.js';
import IDDocumentVerifications from './id-document-verifications.js';

/**
 * Main Identities class that consolidates all identity verification endpoints
 *
 * @export
 * @class Identities
 */
export default class Identities {
    constructor(config) {
        this.config = config;
        this.applicants = new Applicants(config);
        this.identityVerifications = new IdentityVerifications(config);
        this.amlScreenings = new AMLScreenings(config);
        this.faceAuthentications = new FaceAuthentications(config);
        this.idDocumentVerifications = new IDDocumentVerifications(config);
    }

    // Backwards compatibility - delegate to submodules

    // Applicants
    async createApplicant(body) {
        return this.applicants.createApplicant(body);
    }

    async getApplicant(applicant_id) {
        return this.applicants.getApplicant(applicant_id);
    }

    async updateApplicant(applicant_id, body) {
        return this.applicants.updateApplicant(applicant_id, body);
    }

    async anonymizeApplicant(applicant_id) {
        return this.applicants.anonymizeApplicant(applicant_id);
    }

    // AML Screenings
    async createAMLVerification(body) {
        return this.amlScreenings.createAMLVerification(body);
    }

    async getAMLScreening(aml_screening_id) {
        return this.amlScreenings.getAMLScreening(aml_screening_id);
    }

    // Face Authentications
    async createFaceAuthentication(body) {
        return this.faceAuthentications.createFaceAuthentication(body);
    }

    async getFaceAuthentication(face_authentication_id) {
        return this.faceAuthentications.getFaceAuthentication(face_authentication_id);
    }

    async listFaceAuthenticationAttempts(face_authentication_id) {
        return this.faceAuthentications.listAttempts(face_authentication_id);
    }

    async getFaceAuthenticationAttempt(face_authentication_id, attempt_id) {
        return this.faceAuthentications.getAttempt(face_authentication_id, attempt_id);
    }

    async createFaceAuthenticationAttempt(face_authentication_id, body) {
        return this.faceAuthentications.createAttempt(face_authentication_id, body);
    }

    async anonymizeFaceAuthentication(face_authentication_id) {
        return this.faceAuthentications.anonymizeFaceAuthentication(face_authentication_id);
    }

    // ID Document Verifications
    async createIDDocumentVerification(body) {
        return this.idDocumentVerifications.createIDDocumentVerification(body);
    }

    async getIDDocumentVerification(id_document_verification_id) {
        return this.idDocumentVerifications.getIDDocumentVerification(id_document_verification_id);
    }

    async listIDDocumentVerificationAttempts(id_document_verification_id) {
        return this.idDocumentVerifications.listAttempts(id_document_verification_id);
    }

    async getIDDocumentVerificationAttempt(id_document_verification_id, attempt_id) {
        return this.idDocumentVerifications.getAttempt(id_document_verification_id, attempt_id);
    }

    async anonymizeIDDocumentVerification(id_document_verification_id) {
        return this.idDocumentVerifications.anonymizeIDDocumentVerification(id_document_verification_id);
    }

    async createIDDocumentVerificationAttempt(id_document_verification_id, body) {
        return this.idDocumentVerifications.createAttempt(id_document_verification_id, body);
    }

    async getIDDocumentVerificationPDFReport(id_document_verification_id) {
        return this.idDocumentVerifications.getPDFReport(id_document_verification_id);
    }

    // Identity Verifications
    async createAndStartIdentityVerification(body) {
        return this.identityVerifications.createAndStartIdentityVerification(body);
    }

    async createIdentityVerification(body) {
        return this.identityVerifications.createIdentityVerification(body);
    }

    async getIdentityVerification(identity_verification_id) {
        return this.identityVerifications.getIdentityVerification(identity_verification_id);
    }

    async anonymizeIdentityVerification(identity_verification_id) {
        return this.identityVerifications.anonymizeIdentityVerification(identity_verification_id);
    }

    async createIdentityVerificationAttempt(identity_verification_id, body) {
        return this.identityVerifications.createAttempt(identity_verification_id, body);
    }

    async listIdentityVerificationAttempts(identity_verification_id) {
        return this.identityVerifications.listAttempts(identity_verification_id);
    }

    async getIdentityVerificationAttempt(identity_verification_id, attempt_id) {
        return this.identityVerifications.getAttempt(identity_verification_id, attempt_id);
    }

    async getIdentityVerificationPDFReport(identity_verification_id) {
        return this.identityVerifications.getPDFReport(identity_verification_id);
    }
}
