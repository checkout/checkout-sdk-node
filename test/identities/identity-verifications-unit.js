import { expect } from 'chai';
import nock from 'nock';
import Checkout from '../../src/Checkout.js';
import { AuthenticationError, NotFoundError } from '../../src/services/errors.js';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';

describe('Unit::Identity Verifications', () => {
    it('should create an identity verification', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/identity-verifications', {
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                declared_data: {
                    name: 'Hannah Bret'
                },
                redirect_url: 'https://example.com?query-param=hello'
            })
            .reply(201, {
                id: 'idv_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                status: 'pending'
            });

        const cko = new Checkout(SK);
        const verification = await cko.identities.identityVerifications.createIdentityVerification({
            applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
            declared_data: {
                name: 'Hannah Bret'
            },
            redirect_url: 'https://example.com?query-param=hello'
        });

        expect(verification.id).to.equal('idv_tkoi5db4hryu5cei5vwoabr7we');
        expect(verification.status).to.equal('pending');
    });

    it('should create and start an identity verification', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/create-and-open-idv', {
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                configuration_id: 'cnf_tkoi5db4hryu5cei5vwoabr7we'
            })
            .reply(201, {
                id: 'idv_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                status: 'pending',
                attempt_url: 'https://identity-verification.api.sandbox.checkout.com/attempt/idv_tkoi5db4hryu5cei5vwoabr7we'
            });

        const cko = new Checkout(SK);
        const verification = await cko.identities.identityVerifications.createAndStartIdentityVerification({
            applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
            configuration_id: 'cnf_tkoi5db4hryu5cei5vwoabr7we'
        });

        expect(verification.id).to.equal('idv_tkoi5db4hryu5cei5vwoabr7we');
        expect(verification.status).to.equal('pending');
        expect(verification.attempt_url).to.be.a('string');
    });

    it('should get an identity verification', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/identity-verifications/idv_tkoi5db4hryu5cei5vwoabr7we')
            .reply(200, {
                id: 'idv_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                status: 'approved'
            });

        const cko = new Checkout(SK);
        const verification = await cko.identities.identityVerifications.getIdentityVerification(
            'idv_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(verification.id).to.equal('idv_tkoi5db4hryu5cei5vwoabr7we');
        expect(verification.status).to.equal('approved');
    });

    it('should create an identity verification attempt', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/identity-verifications/idv_tkoi5db4hryu5cei5vwoabr7we/attempts')
            .reply(201, {
                id: 'att_1',
                created_on: '2025-07-21T17:32:28Z',
                url: 'https://identity-verification.api.sandbox.checkout.com/attempt/att_1'
            });

        const cko = new Checkout(SK);
        const attempt = await cko.identities.identityVerifications.createAttempt(
            'idv_tkoi5db4hryu5cei5vwoabr7we',
            {}
        );

        expect(attempt.id).to.equal('att_1');
        expect(attempt.url).to.be.a('string');
    });

    it('should list identity verification attempts', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/identity-verifications/idv_tkoi5db4hryu5cei5vwoabr7we/attempts')
            .reply(200, {
                data: [
                    {
                        id: 'att_1',
                        created_on: '2025-07-21T17:32:28Z',
                        status: 'completed'
                    }
                ]
            });

        const cko = new Checkout(SK);
        const result = await cko.identities.identityVerifications.listAttempts(
            'idv_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(result.data).to.be.an('array');
        expect(result.data).to.have.lengthOf(1);
        expect(result.data[0].id).to.equal('att_1');
    });

    it('should get a specific identity verification attempt', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/identity-verifications/idv_tkoi5db4hryu5cei5vwoabr7we/attempts/att_1')
            .reply(200, {
                id: 'att_1',
                created_on: '2025-07-21T17:32:28Z',
                status: 'completed'
            });

        const cko = new Checkout(SK);
        const attempt = await cko.identities.identityVerifications.getAttempt(
            'idv_tkoi5db4hryu5cei5vwoabr7we',
            'att_1'
        );

        expect(attempt.id).to.equal('att_1');
        expect(attempt.status).to.equal('completed');
    });

    it('should anonymize an identity verification', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/identity-verifications/idv_tkoi5db4hryu5cei5vwoabr7we/anonymize')
            .reply(200, {
                id: 'idv_tkoi5db4hryu5cei5vwoabr7we',
                status: 'anonymized'
            });

        const cko = new Checkout(SK);
        const result = await cko.identities.identityVerifications.anonymizeIdentityVerification(
            'idv_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(result.id).to.equal('idv_tkoi5db4hryu5cei5vwoabr7we');
        expect(result.status).to.equal('anonymized');
    });

    it('should get identity verification PDF report', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/identity-verifications/idv_tkoi5db4hryu5cei5vwoabr7we/pdf-report')
            .reply(200, Buffer.from('PDF content'), {
                'content-type': 'application/pdf'
            });

        const cko = new Checkout(SK);
        const result = await cko.identities.identityVerifications.getPDFReport(
            'idv_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(result).to.be.an.instanceOf(Buffer);
    });

    it('should throw AuthenticationError when creating identity verification with invalid credentials', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/identity-verifications')
            .reply(401);

        const cko = new Checkout('sk_invalid');
        try {
            await cko.identities.identityVerifications.createIdentityVerification({
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                declared_data: {
                    name: 'Hannah Bret'
                }
            });
            throw new Error('Should have thrown AuthenticationError');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw NotFoundError when getting non-existent identity verification', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/identity-verifications/idv_invalid')
            .reply(404);

        const cko = new Checkout(SK);
        try {
            await cko.identities.identityVerifications.getIdentityVerification('idv_invalid');
            throw new Error('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
