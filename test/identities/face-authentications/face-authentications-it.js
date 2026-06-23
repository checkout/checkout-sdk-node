/**
 * Integration tests for Identities Face Authentications API.
 */
import nock from 'nock';
import { expect } from 'chai';
import { NotFoundError } from '../../../src/services/errors.js';
import { cko } from '../identities-common.js';

afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

describe.skip('Integration::Identities::FaceAuthentications', () => {
    it('should create a face authentication', async () => {
        const applicant = await cko.identities.createApplicant({
            external_applicant_id: `ext_${Date.now()}`,
            email: 'test.face@example.com',
            external_applicant_name: 'Test Face',
        });
        const faceAuth = await cko.identities.createFaceAuthentication({
            applicant_id: applicant.id,
        });
        expect(faceAuth.id).to.not.be.null;
    });

    it('should throw NotFoundError when getting non-existent face authentication', async () => {
        try {
            await cko.identities.getFaceAuthentication('fca_nonexistent');
            expect.fail('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should get face authentication attempt assets', async () => {
        const applicant = await cko.identities.createApplicant({
            external_applicant_id: `ext_${Date.now()}`,
            email: 'test.face@example.com',
            external_applicant_name: 'Test Face',
        });
        const faceAuth = await cko.identities.createFaceAuthentication({
            applicant_id: applicant.id,
        });
        const attempt = await cko.identities.createFaceAuthenticationAttempt(faceAuth.id, {});
        const assets = await cko.identities.getFaceAuthenticationAttemptAssets(
            faceAuth.id,
            attempt.id,
            { skip: 0, limit: 10 }
        );
        expect(assets).to.not.be.null;
        expect(assets.data).to.be.an('array');
    });
});
