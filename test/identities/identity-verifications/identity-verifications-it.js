/**
 * Integration tests for Identities Identity Verifications API.
 */
import nock from 'nock';
import { expect } from 'chai';
import { NotFoundError } from '../../../src/services/errors.js';
import { cko } from '../identities-common.js';

afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

describe.skip('Integration::Identities::IdentityVerifications', () => {
    it('should create an identity verification', async () => {
        const applicant = await cko.identities.createApplicant({
            external_applicant_id: `ext_${Date.now()}`,
            email: 'test.verification@example.com',
            external_applicant_name: 'Test Verification',
        });
        const verification = await cko.identities.createIdentityVerification({
            applicant_id: applicant.id,
            declared_data: { name: 'Test Verification' },
        });
        expect(verification.id).to.not.be.null;
        expect(verification.applicant_id).to.equal(applicant.id);
    });

    it('should get an identity verification', async () => {
        const applicant = await cko.identities.createApplicant({
            external_applicant_id: `ext_${Date.now()}`,
            email: 'test.verification.get@example.com',
            external_applicant_name: 'Test Verification Get',
        });
        const created = await cko.identities.createIdentityVerification({
            applicant_id: applicant.id,
            declared_data: { name: 'Test Verification Get' },
        });
        const verification = await cko.identities.getIdentityVerification(created.id);
        expect(verification.id).to.equal(created.id);
        expect(verification.applicant_id).to.equal(applicant.id);
    });

    it('should throw NotFoundError when getting non-existent verification', async () => {
        try {
            await cko.identities.getIdentityVerification('idv_nonexistent');
            expect.fail('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
