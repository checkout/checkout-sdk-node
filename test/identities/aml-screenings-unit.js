import { expect } from 'chai';
import nock from 'nock';
import Checkout from '../../src/Checkout.js';
import { AuthenticationError, NotFoundError } from '../../src/services/errors.js';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';

describe('Unit::AML Screenings', () => {
    it('should create an AML screening', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/aml-verifications', {
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                configuration_id: 'cnf_tkoi5db4hryu5cei5vwoabr7we'
            })
            .reply(201, {
                id: 'amlv_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                status: 'pending',
                configuration_id: 'cnf_tkoi5db4hryu5cei5vwoabr7we'
            });

        const cko = new Checkout(SK);
        const result = await cko.identities.amlScreenings.createAMLVerification({
            applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
            configuration_id: 'cnf_tkoi5db4hryu5cei5vwoabr7we'
        });

        expect(result.id).to.equal('amlv_tkoi5db4hryu5cei5vwoabr7we');
        expect(result.status).to.equal('pending');
    });

    it('should get an AML screening', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/aml-verifications/amlv_tkoi5db4hryu5cei5vwoabr7we')
            .reply(200, {
                id: 'amlv_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                status: 'approved',
                configuration_id: 'cnf_tkoi5db4hryu5cei5vwoabr7we',
                results: {
                    overall_result: 'clear'
                }
            });

        const cko = new Checkout(SK);
        const result = await cko.identities.amlScreenings.getAMLScreening(
            'amlv_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(result.id).to.equal('amlv_tkoi5db4hryu5cei5vwoabr7we');
        expect(result.status).to.equal('approved');
        expect(result.results.overall_result).to.equal('clear');
    });

    it('should throw AuthenticationError when creating AML screening with invalid credentials', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/aml-verifications')
            .reply(401);

        const cko = new Checkout('sk_invalid');
        try {
            await cko.identities.amlScreenings.createAMLVerification({
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                configuration_id: 'cnf_tkoi5db4hryu5cei5vwoabr7we'
            });
            throw new Error('Should have thrown AuthenticationError');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw NotFoundError when getting non-existent AML screening', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/aml-verifications/amlv_invalid')
            .reply(404);

        const cko = new Checkout(SK);
        try {
            await cko.identities.amlScreenings.getAMLScreening('amlv_invalid');
            throw new Error('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
