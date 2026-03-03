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
});
