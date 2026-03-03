/**
 * Integration tests for Identities Applicants API.
 */
import nock from 'nock';
import { expect } from 'chai';
import Checkout from '../../../src/Checkout.js';
import { AuthenticationError, NotFoundError } from '../../../src/services/errors.js';
import { cko } from '../identities-common.js';

afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

describe.skip('Integration::Identities::Applicants', () => {
    it('should create an applicant', async () => {
        const applicant = await cko.identities.createApplicant({
            external_applicant_id: `ext_${Date.now()}`,
            email: 'test.applicant@example.com',
            external_applicant_name: 'Test Applicant',
        });
        expect(applicant.id).to.not.be.null;
        expect(applicant.email).to.equal('test.applicant@example.com');
    });

    it('should get an applicant', async () => {
        const created = await cko.identities.createApplicant({
            external_applicant_id: `ext_${Date.now()}`,
            email: 'test.get@example.com',
            external_applicant_name: 'Test Get',
        });
        const applicant = await cko.identities.getApplicant(created.id);
        expect(applicant.id).to.equal(created.id);
        expect(applicant.email).to.equal('test.get@example.com');
    });

    it('should update an applicant', async () => {
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
        const invalidCko = new Checkout('sk_sbox_invalid_key', {
            subdomain: '12345678',
        });
        try {
            await invalidCko.identities.createApplicant({
                email: 'test@example.com',
            });
            expect.fail('Should have thrown error');
        } catch (err) {
            expect(err).to.satisfy(
                (e) => e instanceof AuthenticationError || e instanceof NotFoundError
            );
        }
    });
});
