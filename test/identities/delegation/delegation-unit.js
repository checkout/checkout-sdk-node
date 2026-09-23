import { Checkout } from '../../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';
const BASE = 'https://identity-verification.sandbox.checkout.com';

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

    // Attempt-assets delegation. The two document-verification delegates are new in the
    // 2026-09-02 row; the face-authentication and identity-verification ones predate it and had no
    // delegate coverage either.
    const ASSETS = (type) => ({
        total_count: 1,
        skip: 0,
        limit: 10,
        data: [{ type, _links: { asset_url: { href: `https://storage.example.com/${type}.png` } } }],
        _links: { self: { href: 'https://identity-verification.sandbox.checkout.com/assets' } },
    });

    it('should delegate getAddressDocumentVerificationAttemptAssets to addressDocumentVerifications submodule', async () => {
        nock(BASE)
            .get('/address-document-verifications/adv_123/attempts/adva_123/assets')
            .reply(200, ASSETS('document'));
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.getAddressDocumentVerificationAttemptAssets('adv_123', 'adva_123');
        expect(result.data[0].type).to.equal('document');
        expect(result.data[0]._links.asset_url.href).to.contain('document.png');
    });

    it('should delegate getIDDocumentVerificationAttemptAssets to idDocumentVerifications submodule', async () => {
        nock(BASE)
            .get('/id-document-verifications/iddv_123/attempts/datp_123/assets')
            .reply(200, ASSETS('document_front_image'));
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.getIDDocumentVerificationAttemptAssets('iddv_123', 'datp_123');
        expect(result.data[0].type).to.equal('document_front_image');
    });

    it('should delegate getFaceAuthenticationAttemptAssets to faceAuthentications submodule', async () => {
        nock(BASE)
            .get('/face-authentications/fav_123/attempts/fatp_123/assets')
            .reply(200, ASSETS('face_image'));
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.getFaceAuthenticationAttemptAssets('fav_123', 'fatp_123');
        expect(result.data[0].type).to.equal('face_image');
    });

    it('should delegate getIdentityVerificationAttemptAssets to identityVerifications submodule', async () => {
        nock(BASE)
            .get('/identity-verifications/idv_123/attempts/iatp_123/assets')
            .reply(200, ASSETS('face_video'));
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.getIdentityVerificationAttemptAssets('idv_123', 'iatp_123');
        expect(result.data[0].type).to.equal('face_video');
    });

    it('should forward skip and limit through the attempt-assets delegates', async () => {
        nock(BASE)
            .get('/address-document-verifications/adv_123/attempts/adva_123/assets')
            .query({ skip: 10, limit: 5 })
            .reply(200, ASSETS('document'));
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.getAddressDocumentVerificationAttemptAssets(
            'adv_123',
            'adva_123',
            { skip: 10, limit: 5 }
        );
        expect(result.total_count).to.equal(1);
    });

    // The four list-attempts delegates gained a params argument, so each one has to
    // pass it through rather than silently drop it.
    const ATTEMPTS = { total_count: 25, skip: 5, limit: 25, data: [], _links: { self: { href: 'x' } } };

    it('should forward skip and limit through listAddressDocumentVerificationAttempts', async () => {
        nock(BASE)
            .get('/address-document-verifications/adv_123/attempts')
            .query({ skip: 5, limit: 25 })
            .reply(200, ATTEMPTS);
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.listAddressDocumentVerificationAttempts('adv_123', {
            skip: 5,
            limit: 25,
        });
        expect(result.total_count).to.equal(25);
    });

    it('should forward skip and limit through listIDDocumentVerificationAttempts', async () => {
        nock(BASE)
            .get('/id-document-verifications/iddv_123/attempts')
            .query({ skip: 5, limit: 25 })
            .reply(200, ATTEMPTS);
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.listIDDocumentVerificationAttempts('iddv_123', {
            skip: 5,
            limit: 25,
        });
        expect(result.total_count).to.equal(25);
    });

    it('should forward skip and limit through listFaceAuthenticationAttempts', async () => {
        nock(BASE)
            .get('/face-authentications/fav_123/attempts')
            .query({ skip: 5, limit: 25 })
            .reply(200, ATTEMPTS);
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.listFaceAuthenticationAttempts('fav_123', {
            skip: 5,
            limit: 25,
        });
        expect(result.total_count).to.equal(25);
    });

    it('should forward skip and limit through listIdentityVerificationAttempts', async () => {
        nock(BASE)
            .get('/identity-verifications/idv_123/attempts')
            .query({ skip: 5, limit: 25 })
            .reply(200, ATTEMPTS);
        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.listIdentityVerificationAttempts('idv_123', {
            skip: 5,
            limit: 25,
        });
        expect(result.total_count).to.equal(25);
    });
});
