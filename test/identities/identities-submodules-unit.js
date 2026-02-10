import { AuthenticationError } from '../../src/services/errors.js';
import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';

describe('Identities - Applicants', () => {
    it('should create an applicant', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/applicants')
            .reply(201, {
                id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                external_applicant_id: 'ext_osdfdfdb4hryu5cei5vwoabrk5k',
                email: 'hannah.bret@example.com',
                external_applicant_name: 'Hannah Bret',
            });

        const cko = new Checkout(SK);

        const applicant = await cko.identities.applicants.createApplicant({
            external_applicant_id: 'ext_osdfdfdb4hryu5cei5vwoabrk5k',
            email: 'hannah.bret@example.com',
            external_applicant_name: 'Hannah Bret',
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
            });

        const cko = new Checkout(SK);

        const applicant = await cko.identities.applicants.getApplicant(
            'aplt_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(applicant.id).to.equal('aplt_tkoi5db4hryu5cei5vwoabr7we');
    });

    it('should update an applicant', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .patch('/applicants/aplt_tkoi5db4hryu5cei5vwoabr7we')
            .reply(200, {
                id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                external_applicant_id: 'ext_osdfdfdb4hryu5cei5vwoabrk5k',
                email: 'hannah.updated@example.com',
                external_applicant_name: 'Hannah Bret Updated',
            });

        const cko = new Checkout(SK);

        const applicant = await cko.identities.applicants.updateApplicant(
            'aplt_tkoi5db4hryu5cei5vwoabr7we',
            {
                email: 'hannah.updated@example.com',
                external_applicant_name: 'Hannah Bret Updated',
            }
        );

        expect(applicant.email).to.equal('hannah.updated@example.com');
    });

    it('should anonymize an applicant', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/applicants/aplt_tkoi5db4hryu5cei5vwoabr7we/anonymize')
            .reply(200, {
                id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                external_applicant_id: 'ext_osdfdfdb4hryu5cei5vwoabrk5k',
            });

        const cko = new Checkout(SK);

        const result = await cko.identities.applicants.anonymizeApplicant(
            'aplt_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(result.id).to.equal('aplt_tkoi5db4hryu5cei5vwoabr7we');
    });

    it('should throw auth error creating applicant', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/applicants')
            .reply(401);

        try {
            const cko = new Checkout(SK);
            await cko.identities.applicants.createApplicant({
                external_applicant_id: 'ext_osdfdfdb4hryu5cei5vwoabrk5k',
                email: 'hannah.bret@example.com',
                external_applicant_name: 'Hannah Bret',
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});

describe('Identities - Identity Verifications', () => {
    it('should create an identity verification', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/identity-verifications')
            .reply(201, {
                id: 'idv_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                status: 'pending',
            });

        const cko = new Checkout(SK);

        const verification = await cko.identities.identityVerifications.createIdentityVerification(
            {
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                declared_data: {
                    name: 'Hannah Bret',
                },
                redirect_url: 'https://example.com?query-param=hello',
            }
        );

        expect(verification.id).to.equal('idv_tkoi5db4hryu5cei5vwoabr7we');
        expect(verification.status).to.equal('pending');
    });

    it('should get an identity verification', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/identity-verifications/idv_tkoi5db4hryu5cei5vwoabr7we')
            .reply(200, {
                id: 'idv_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                status: 'approved',
            });

        const cko = new Checkout(SK);

        const verification = await cko.identities.identityVerifications.getIdentityVerification(
            'idv_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(verification.id).to.equal('idv_tkoi5db4hryu5cei5vwoabr7we');
        expect(verification.status).to.equal('approved');
    });

    it('should throw auth error creating identity verification', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/identity-verifications')
            .reply(401);

        try {
            const cko = new Checkout(SK);
            await cko.identities.identityVerifications.createIdentityVerification({
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                declared_data: {
                    name: 'Hannah Bret',
                },
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
