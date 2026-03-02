import { expect } from 'chai';
import nock from 'nock';
import Checkout from '../../../src/Checkout.js';
import { AuthenticationError, NotFoundError } from '../../../src/services/errors.js';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';

describe('Unit::Applicants', () => {
    it('should create an applicant', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/applicants', {
                external_applicant_id: 'ext_osdfdfdb4hryu5cei5vwoabrk5k',
                email: 'hannah.bret@example.com',
                external_applicant_name: 'Hannah Bret'
            })
            .reply(201, {
                id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                external_applicant_id: 'ext_osdfdfdb4hryu5cei5vwoabrk5k',
                email: 'hannah.bret@example.com',
                external_applicant_name: 'Hannah Bret',
                _links: {
                    self: {
                        href: 'https://identity-verification.checkout.com/applicants/aplt_tkoi5db4hryu5cei5vwoabr7we'
                    }
                }
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const applicant = await cko.identities.applicants.createApplicant({
            external_applicant_id: 'ext_osdfdfdb4hryu5cei5vwoabrk5k',
            email: 'hannah.bret@example.com',
            external_applicant_name: 'Hannah Bret'
        });

        expect(applicant.id).to.equal('aplt_tkoi5db4hryu5cei5vwoabr7we');
        expect(applicant.email).to.equal('hannah.bret@example.com');
    });

    it('should get an applicant', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/applicants/aplt_tkoi5db4hryu5cei5vwoabr7we')
            .reply(200, {
                id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                external_applicant_id: 'ext_osdfdfdb4hryu5cei5vwoabrk5k',
                email: 'hannah.bret@example.com',
                external_applicant_name: 'Hannah Bret',
                _links: {
                    self: {
                        href: 'https://identity-verification.checkout.com/applicants/aplt_tkoi5db4hryu5cei5vwoabr7we'
                    }
                }
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const applicant = await cko.identities.applicants.getApplicant(
            'aplt_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(applicant.id).to.equal('aplt_tkoi5db4hryu5cei5vwoabr7we');
        expect(applicant.email).to.equal('hannah.bret@example.com');
    });

    it('should update an applicant', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .patch('/applicants/aplt_tkoi5db4hryu5cei5vwoabr7we', {
                email: 'hannah.updated@example.com',
                external_applicant_name: 'Hannah Bret Updated'
            })
            .reply(200, {
                id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                external_applicant_id: 'ext_osdfdfdb4hryu5cei5vwoabrk5k',
                email: 'hannah.updated@example.com',
                external_applicant_name: 'Hannah Bret Updated',
                _links: {
                    self: {
                        href: 'https://identity-verification.checkout.com/applicants/aplt_tkoi5db4hryu5cei5vwoabr7we'
                    }
                }
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const applicant = await cko.identities.applicants.updateApplicant(
            'aplt_tkoi5db4hryu5cei5vwoabr7we',
            {
                email: 'hannah.updated@example.com',
                external_applicant_name: 'Hannah Bret Updated'
            }
        );

        expect(applicant.email).to.equal('hannah.updated@example.com');
        expect(applicant.external_applicant_name).to.equal('Hannah Bret Updated');
    });

    it('should anonymize an applicant', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/applicants/aplt_tkoi5db4hryu5cei5vwoabr7we/anonymize')
            .reply(200, {
                id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                external_applicant_id: 'ext_osdfdfdb4hryu5cei5vwoabrk5k',
                _links: {
                    self: {
                        href: 'https://identity-verification.checkout.com/applicants/aplt_tkoi5db4hryu5cei5vwoabr7we'
                    }
                }
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.applicants.anonymizeApplicant(
            'aplt_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(result.id).to.equal('aplt_tkoi5db4hryu5cei5vwoabr7we');
        expect(result.external_applicant_id).to.equal('ext_osdfdfdb4hryu5cei5vwoabrk5k');
    });

    it('should throw AuthenticationError when creating applicant with invalid credentials', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/applicants')
            .reply(401);

        const cko = new Checkout('sk_invalid', { subdomain: 'test' });
        try {
            await cko.identities.applicants.createApplicant({
                external_applicant_id: 'ext_osdfdfdb4hryu5cei5vwoabrk5k',
                email: 'hannah.bret@example.com',
                external_applicant_name: 'Hannah Bret'
            });
            throw new Error('Should have thrown AuthenticationError');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw NotFoundError when getting non-existent applicant', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/applicants/aplt_invalid')
            .reply(404);

        const cko = new Checkout(SK, { subdomain: 'test' });
        try {
            await cko.identities.applicants.getApplicant('aplt_invalid');
            throw new Error('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
