import { Checkout } from '../../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';
const BASE = 'https://identity-verification.api.sandbox.checkout.com';

describe('Identities - Backwards Compatibility Delegation', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    // Applicants delegation
    it('should delegate createApplicant to applicants submodule', async () => {
        nock(BASE).post('/applicants').reply(201, { id: 'aplt_123' });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.createApplicant({ email: 'test@example.com' });
        expect(result.id).to.equal('aplt_123');
    });

    it('should delegate getApplicant to applicants submodule', async () => {
        nock(BASE).get('/applicants/aplt_123').reply(200, { id: 'aplt_123' });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.getApplicant('aplt_123');
        expect(result.id).to.equal('aplt_123');
    });

    it('should delegate updateApplicant to applicants submodule', async () => {
        nock(BASE).patch('/applicants/aplt_123').reply(200, { id: 'aplt_123', email: 'updated@example.com' });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.updateApplicant('aplt_123', { email: 'updated@example.com' });
        expect(result.email).to.equal('updated@example.com');
    });

    it('should delegate anonymizeApplicant to applicants submodule', async () => {
        nock(BASE).post('/applicants/aplt_123/anonymize').reply(200, { id: 'aplt_123' });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.anonymizeApplicant('aplt_123');
        expect(result.id).to.equal('aplt_123');
    });

    // AML Screenings delegation
    it('should delegate createAMLVerification to amlScreenings submodule', async () => {
        nock(BASE).post('/aml-verifications').reply(201, { id: 'aml_123' });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.createAMLVerification({ applicant_id: 'aplt_123' });
        expect(result.id).to.equal('aml_123');
    });

    it('should delegate getAMLScreening to amlScreenings submodule', async () => {
        nock(BASE).get('/aml-verifications/aml_123').reply(200, { id: 'aml_123' });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.getAMLScreening('aml_123');
        expect(result.id).to.equal('aml_123');
    });

    // Face Authentications delegation
    it('should delegate createFaceAuthentication to faceAuthentications submodule', async () => {
        nock(BASE).post('/face-authentications').reply(201, { id: 'fca_123' });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.createFaceAuthentication({ applicant_id: 'aplt_123' });
        expect(result.id).to.equal('fca_123');
    });

    it('should delegate getFaceAuthentication to faceAuthentications submodule', async () => {
        nock(BASE).get('/face-authentications/fca_123').reply(200, { id: 'fca_123' });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.getFaceAuthentication('fca_123');
        expect(result.id).to.equal('fca_123');
    });

    it('should delegate listFaceAuthenticationAttempts to faceAuthentications submodule', async () => {
        nock(BASE).get('/face-authentications/fca_123/attempts').reply(200, { attempts: [] });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.listFaceAuthenticationAttempts('fca_123');
        expect(result.attempts).to.be.an('array');
    });

    it('should delegate getFaceAuthenticationAttempt to faceAuthentications submodule', async () => {
        nock(BASE).get('/face-authentications/fca_123/attempts/att_456').reply(200, { id: 'att_456' });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.getFaceAuthenticationAttempt('fca_123', 'att_456');
        expect(result.id).to.equal('att_456');
    });

    it('should delegate createFaceAuthenticationAttempt to faceAuthentications submodule', async () => {
        nock(BASE).post('/face-authentications/fca_123/attempts').reply(201, { id: 'att_789' });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.createFaceAuthenticationAttempt('fca_123', { data: 'test' });
        expect(result.id).to.equal('att_789');
    });

    it('should delegate anonymizeFaceAuthentication to faceAuthentications submodule', async () => {
        nock(BASE).post('/face-authentications/fca_123/anonymize').reply(200, { id: 'fca_123' });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.anonymizeFaceAuthentication('fca_123');
        expect(result.id).to.equal('fca_123');
    });

    // ID Document Verifications delegation
    it('should delegate createIDDocumentVerification to idDocumentVerifications submodule', async () => {
        nock(BASE).post('/id-document-verifications').reply(201, { id: 'idv_doc_123' });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.createIDDocumentVerification({ applicant_id: 'aplt_123' });
        expect(result.id).to.equal('idv_doc_123');
    });

    it('should delegate getIDDocumentVerification to idDocumentVerifications submodule', async () => {
        nock(BASE).get('/id-document-verifications/idv_doc_123').reply(200, { id: 'idv_doc_123' });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.getIDDocumentVerification('idv_doc_123');
        expect(result.id).to.equal('idv_doc_123');
    });

    it('should delegate listIDDocumentVerificationAttempts to idDocumentVerifications submodule', async () => {
        nock(BASE).get('/id-document-verifications/idv_doc_123/attempts').reply(200, { attempts: [] });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.listIDDocumentVerificationAttempts('idv_doc_123');
        expect(result.attempts).to.be.an('array');
    });

    it('should delegate getIDDocumentVerificationAttempt to idDocumentVerifications submodule', async () => {
        nock(BASE).get('/id-document-verifications/idv_doc_123/attempts/att_456').reply(200, { id: 'att_456' });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.getIDDocumentVerificationAttempt('idv_doc_123', 'att_456');
        expect(result.id).to.equal('att_456');
    });

    it('should delegate anonymizeIDDocumentVerification to idDocumentVerifications submodule', async () => {
        nock(BASE).post('/id-document-verifications/idv_doc_123/anonymize').reply(200, { id: 'idv_doc_123' });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.anonymizeIDDocumentVerification('idv_doc_123');
        expect(result.id).to.equal('idv_doc_123');
    });

    it('should delegate createIDDocumentVerificationAttempt to idDocumentVerifications submodule', async () => {
        nock(BASE).post('/id-document-verifications/idv_doc_123/attempts').reply(201, { id: 'att_789' });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.createIDDocumentVerificationAttempt('idv_doc_123', { data: 'test' });
        expect(result.id).to.equal('att_789');
    });

    it('should delegate getIDDocumentVerificationPDFReport to idDocumentVerifications submodule', async () => {
        nock(BASE).get('/id-document-verifications/idv_doc_123/pdf-report').reply(200, { report: 'data' });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.getIDDocumentVerificationPDFReport('idv_doc_123');
        expect(result).to.not.be.null;
    });

    // Identity Verifications delegation
    it('should delegate createAndStartIdentityVerification to identityVerifications submodule', async () => {
        nock(BASE).post('/create-and-open-idv').reply(201, { id: 'idv_123', status: 'in_progress' });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.createAndStartIdentityVerification({
            applicant_id: 'aplt_123',
            declared_data: { name: 'Test' },
        });
        expect(result.id).to.equal('idv_123');
    });

    it('should delegate createIdentityVerification to identityVerifications submodule', async () => {
        nock(BASE).post('/identity-verifications').reply(201, { id: 'idv_123', status: 'pending' });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.createIdentityVerification({
            applicant_id: 'aplt_123',
        });
        expect(result.id).to.equal('idv_123');
    });

    it('should delegate getIdentityVerification to identityVerifications submodule', async () => {
        nock(BASE).get('/identity-verifications/idv_123').reply(200, { id: 'idv_123', status: 'approved' });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.getIdentityVerification('idv_123');
        expect(result.id).to.equal('idv_123');
    });

    it('should delegate anonymizeIdentityVerification to identityVerifications submodule', async () => {
        nock(BASE).post('/identity-verifications/idv_123/anonymize').reply(200, { id: 'idv_123' });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.anonymizeIdentityVerification('idv_123');
        expect(result.id).to.equal('idv_123');
    });

    it('should delegate createIdentityVerificationAttempt to identityVerifications submodule', async () => {
        nock(BASE).post('/identity-verifications/idv_123/attempts').reply(201, { id: 'att_123' });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.createIdentityVerificationAttempt('idv_123', { data: 'test' });
        expect(result.id).to.equal('att_123');
    });

    it('should delegate listIdentityVerificationAttempts to identityVerifications submodule', async () => {
        nock(BASE).get('/identity-verifications/idv_123/attempts').reply(200, { attempts: [] });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.listIdentityVerificationAttempts('idv_123');
        expect(result.attempts).to.be.an('array');
    });

    it('should delegate getIdentityVerificationAttempt to identityVerifications submodule', async () => {
        nock(BASE).get('/identity-verifications/idv_123/attempts/att_456').reply(200, { id: 'att_456' });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.getIdentityVerificationAttempt('idv_123', 'att_456');
        expect(result.id).to.equal('att_456');
    });

    it('should delegate getIdentityVerificationPDFReport to identityVerifications submodule', async () => {
        const pdfContent = '%PDF-1.4 test content';
        nock(BASE).get('/identity-verifications/idv_123/pdf-report').reply(200, pdfContent, {
            'Content-Type': 'application/pdf',
        });
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.getIdentityVerificationPDFReport('idv_123');
        expect(result).to.not.be.null;
    });
});
