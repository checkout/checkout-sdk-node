/**
 * Integration tests for Identities AML Screenings API.
 */
import nock from 'nock';
import { expect } from 'chai';
import { NotFoundError } from '../../../src/services/errors.js';
import { cko } from '../identities-common.js';

afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

describe.skip('Integration::Identities::AMLScreenings', () => {
    it('should create an AML verification', async () => {
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
