/**
 * Integration tests for Identities ID Document Verifications API.
 */
import nock from 'nock';
import { expect } from 'chai';
import { NotFoundError } from '../../../src/services/errors.js';
import { cko } from '../identities-common.js';

afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

describe.skip('Integration::Identities::IDDocumentVerifications', () => {
    it('should create an ID document verification', async () => {
        const applicant = await cko.identities.createApplicant({
            external_applicant_id: `ext_${Date.now()}`,
            email: 'test.iddoc@example.com',
            external_applicant_name: 'Test ID Doc',
        });
        const idDoc = await cko.identities.createIDDocumentVerification({
            applicant_id: applicant.id,
        });
        expect(idDoc.id).to.not.be.null;
    });

    it('should throw NotFoundError when getting non-existent ID document verification', async () => {
        try {
            await cko.identities.getIDDocumentVerification('idv_doc_nonexistent');
            expect.fail('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    // The new attempt-assets endpoint. IddvAttemptAsset requires type and an
    // _links.asset_url, and type is one of document_front_image or document_back_image.
    it('should get ID document verification attempt assets', async () => {
        const applicant = await cko.identities.createApplicant({
            external_applicant_id: `ext_${Date.now()}`,
            email: 'test.iddoc.assets@example.com',
            external_applicant_name: 'Test ID Doc Assets',
        });
        const idDoc = await cko.identities.createIDDocumentVerification({
            applicant_id: applicant.id,
        });
        const attempt = await cko.identities.createIDDocumentVerificationAttempt(idDoc.id, {});
        const assets = await cko.identities.getIDDocumentVerificationAttemptAssets(
            idDoc.id,
            attempt.id,
            { skip: 0, limit: 10 }
        );
        expect(assets).to.not.be.null;
        expect(assets.data).to.be.an('array');
    });

    // List-attempts became paginated in the 2026-09-02 row.
    it('should list ID document verification attempts with skip and limit', async () => {
        const applicant = await cko.identities.createApplicant({
            external_applicant_id: `ext_${Date.now()}`,
            email: 'test.iddoc.paging@example.com',
            external_applicant_name: 'Test ID Doc Paging',
        });
        const idDoc = await cko.identities.createIDDocumentVerification({
            applicant_id: applicant.id,
        });
        const attempts = await cko.identities.listIDDocumentVerificationAttempts(idDoc.id, {
            skip: 0,
            limit: 5,
        });
        expect(attempts.data).to.be.an('array');
        expect(attempts.limit).to.equal(5);
    });
});
