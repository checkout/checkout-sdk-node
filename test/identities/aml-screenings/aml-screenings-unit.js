import { expect } from 'chai';
import nock from 'nock';
import Checkout from '../../../src/Checkout.js';
import { AuthenticationError, NotFoundError } from '../../../src/services/errors.js';

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
                status: 'created',
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                search_parameters: {
                    configuration_identifier: '8eb79430-c014-41e5-be73-2c2c091322b8'
                },
                monitored: false,
                _links: {
                    self: {
                        href: 'https://identity-verification.checkout.com/aml-verifications/amlv_tkoi5db4hryu5cei5vwoabr7we'
                    },
                    applicant: {
                        href: 'https://identity-verification.checkout.com/applicants/aplt_tkoi5db4hryu5cei5vwoabr7AE'
                    }
                }
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.amlScreenings.createAMLVerification({
            applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
            configuration_id: 'cnf_tkoi5db4hryu5cei5vwoabr7we'
        });

        expect(result.id).to.equal('amlv_tkoi5db4hryu5cei5vwoabr7we');
        expect(result.status).to.equal('created');
    });

    it('should get an AML screening', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/aml-verifications/amlv_tkoi5db4hryu5cei5vwoabr7we')
            .reply(200, {
                id: 'amlv_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                status: 'created',
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                search_parameters: {
                    configuration_identifier: '8eb79430-c014-41e5-be73-2c2c091322b8'
                },
                monitored: false,
                _links: {
                    self: {
                        href: 'https://identity-verification.checkout.com/aml-verifications/amlv_tkoi5db4hryu5cei5vwoabr7we'
                    },
                    applicant: {
                        href: 'https://identity-verification.checkout.com/applicants/aplt_tkoi5db4hryu5cei5vwoabr7AE'
                    }
                }
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.amlScreenings.getAMLScreening(
            'amlv_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(result.id).to.equal('amlv_tkoi5db4hryu5cei5vwoabr7we');
        expect(result.status).to.equal('created');
        expect(result.search_parameters.configuration_identifier).to.equal('8eb79430-c014-41e5-be73-2c2c091322b8');
    });

    it('should throw AuthenticationError when creating AML screening with invalid credentials', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/aml-verifications')
            .reply(401);

        const cko = new Checkout('sk_invalid', { subdomain: 'test' });
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

        const cko = new Checkout(SK, { subdomain: 'test' });
        try {
            await cko.identities.amlScreenings.getAMLScreening('amlv_invalid');
            throw new Error('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
