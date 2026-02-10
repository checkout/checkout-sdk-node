import { expect } from 'chai';
import nock from 'nock';
import Checkout from '../../src/Checkout.js';
import { AuthenticationError, NotFoundError, ValidationError } from '../../src/services/errors.js';

afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

const cko = new Checkout(process.env.CHECKOUT_DEFAULT_SECRET_KEY);

describe('Integration::Identities', () => {
    describe('Applicants', () => {
        it.skip('should create an applicant', async () => {
            const applicant = await cko.identities.createApplicant({
                external_applicant_id: `ext_${Date.now()}`,
                email: 'test.applicant@example.com',
                external_applicant_name: 'Test Applicant',
            });

            expect(applicant.id).to.not.be.null;
            expect(applicant.email).to.equal('test.applicant@example.com');
        });

        it.skip('should get an applicant', async () => {
            const created = await cko.identities.createApplicant({
                external_applicant_id: `ext_${Date.now()}`,
                email: 'test.get@example.com',
                external_applicant_name: 'Test Get',
            });

            const applicant = await cko.identities.getApplicant(created.id);

            expect(applicant.id).to.equal(created.id);
            expect(applicant.email).to.equal('test.get@example.com');
        });

        it.skip('should update an applicant', async () => {
            const created = await cko.identities.createApplicant({
                external_applicant_id: `ext_${Date.now()}`,
                email: 'test.update@example.com',
                external_applicant_name: 'Test Update',
            });

            const updated = await cko.identities.updateApplicant(created.id, {
                email: 'test.updated@example.com',
                external_applicant_name: 'Test Updated',
            });

            expect(updated.email).to.equal('test.updated@example.com');
            expect(updated.external_applicant_name).to.equal('Test Updated');
        });

        it('should throw NotFoundError when getting non-existent applicant', async () => {
            try {
                await cko.identities.getApplicant('aplt_nonexistent');
                expect.fail('Should have thrown NotFoundError');
            } catch (err) {
                expect(err).to.be.instanceOf(NotFoundError);
            }
        });

        it('should throw error with invalid credentials', async () => {
            const invalidCko = new Checkout('sk_sbox_invalid_key');

            try {
                await invalidCko.identities.createApplicant({
                    email: 'test@example.com',
                });
                expect.fail('Should have thrown error');
            } catch (err) {
                // May be AuthenticationError or NotFoundError depending on API response
                expect(err).to.satisfy((e) => 
                    e instanceof AuthenticationError || e instanceof NotFoundError
                );
            }
        });
    });

    describe('Identity Verifications', () => {
        it.skip('should create an identity verification', async () => {
            const applicant = await cko.identities.createApplicant({
                external_applicant_id: `ext_${Date.now()}`,
                email: 'test.verification@example.com',
                external_applicant_name: 'Test Verification',
            });

            const verification = await cko.identities.createIdentityVerification({
                applicant_id: applicant.id,
                declared_data: {
                    name: 'Test Verification',
                },
            });

            expect(verification.id).to.not.be.null;
            expect(verification.applicant_id).to.equal(applicant.id);
        });

        it.skip('should get an identity verification', async () => {
            const applicant = await cko.identities.createApplicant({
                external_applicant_id: `ext_${Date.now()}`,
                email: 'test.verification.get@example.com',
                external_applicant_name: 'Test Verification Get',
            });

            const created = await cko.identities.createIdentityVerification({
                applicant_id: applicant.id,
                declared_data: {
                    name: 'Test Verification Get',
                },
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

    describe('AML Screenings', () => {
        it.skip('should create an AML verification', async () => {
            const applicant = await cko.identities.createApplicant({
                external_applicant_id: `ext_${Date.now()}`,
                email: 'test.aml@example.com',
                external_applicant_name: 'Test AML',
            });

            const aml = await cko.identities.createAMLVerification({
                applicant_id: applicant.id,
            });

            expect(aml.id).to.not.be.null;
        });

        it('should throw NotFoundError when getting non-existent AML screening', async () => {
            try {
                await cko.identities.getAMLScreening('aml_nonexistent');
                expect.fail('Should have thrown NotFoundError');
            } catch (err) {
                expect(err).to.be.instanceOf(NotFoundError);
            }
        });
    });

    describe('Face Authentications', () => {
        it.skip('should create a face authentication', async () => {
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
    });

    describe('ID Document Verifications', () => {
        it.skip('should create an ID document verification', async () => {
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

    describe('Backwards Compatibility', () => {
        it.skip('should delegate createApplicant through main identities class', async () => {
            const applicant = await cko.identities.createApplicant({
                external_applicant_id: `ext_${Date.now()}`,
                email: 'test.compat@example.com',
                external_applicant_name: 'Test Compat',
            });

            expect(applicant.id).to.not.be.null;
        });

        it('should throw proper errors when using backwards compatible methods', async () => {
            try {
                await cko.identities.getApplicant('aplt_nonexistent');
                expect.fail('Should have thrown NotFoundError');
            } catch (err) {
                expect(err).to.be.instanceOf(NotFoundError);
            }
        });
    });
});
