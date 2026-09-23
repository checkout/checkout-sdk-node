/**
 * Integration tests for Identities Address Document Verifications API.
 *
 * This family had no integration coverage before the 2026-09-02 row, unlike the other three.
 */
import nock from 'nock';
import { expect } from 'chai';
import { NotFoundError } from '../../../src/services/errors.js';
import { cko } from '../identities-common.js';

afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

describe.skip('Integration::Identities::AddressDocumentVerifications', () => {
    it('should create an address document verification', async () => {
        const applicant = await cko.identities.createApplicant({
            external_applicant_id: `ext_${Date.now()}`,
            email: 'test.addressdoc@example.com',
            external_applicant_name: 'Test Address Doc',
        });
        const addressDoc = await cko.identities.createAddressDocumentVerification({
            applicant_id: applicant.id,
        });
        expect(addressDoc.id).to.not.be.null;
    });

    it('should throw NotFoundError when getting non-existent address document verification', async () => {
        try {
            await cko.identities.getAddressDocumentVerification('adv_nonexistent');
            expect.fail('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    // Part A: the new attempt-assets endpoint. AdvAttemptAsset requires type and an
    // _links.asset_url, and type is always document for this family.
    it('should get address document verification attempt assets', async () => {
        const applicant = await cko.identities.createApplicant({
            external_applicant_id: `ext_${Date.now()}`,
            email: 'test.addressdoc.assets@example.com',
            external_applicant_name: 'Test Address Doc Assets',
        });
        const addressDoc = await cko.identities.createAddressDocumentVerification({
            applicant_id: applicant.id,
        });
        const attempt = await cko.identities.createAddressDocumentVerificationAttempt(addressDoc.id, {});
        const assets = await cko.identities.getAddressDocumentVerificationAttemptAssets(
            addressDoc.id,
            attempt.id,
            { skip: 0, limit: 10 }
        );
        expect(assets).to.not.be.null;
        expect(assets.data).to.be.an('array');
    });

    // Part F M1: list-attempts became paginated in the 2026-09-02 row.
    it('should list address document verification attempts with skip and limit', async () => {
        const applicant = await cko.identities.createApplicant({
            external_applicant_id: `ext_${Date.now()}`,
            email: 'test.addressdoc.paging@example.com',
            external_applicant_name: 'Test Address Doc Paging',
        });
        const addressDoc = await cko.identities.createAddressDocumentVerification({
            applicant_id: applicant.id,
        });
        const attempts = await cko.identities.listAddressDocumentVerificationAttempts(addressDoc.id, {
            skip: 0,
            limit: 5,
        });
        expect(attempts.data).to.be.an('array');
        expect(attempts.limit).to.equal(5);
    });

    // Part C: IdvPdf declares pdf_report and nothing else; signed_url is gone from the spec.
    it('should get an address document verification pdf report', async () => {
        const applicant = await cko.identities.createApplicant({
            external_applicant_id: `ext_${Date.now()}`,
            email: 'test.addressdoc.pdf@example.com',
            external_applicant_name: 'Test Address Doc Pdf',
        });
        const addressDoc = await cko.identities.createAddressDocumentVerification({
            applicant_id: applicant.id,
        });
        const report = await cko.identities.getAddressDocumentVerificationPDFReport(addressDoc.id);
        expect(report.pdf_report).to.be.a('string');
    });
});
