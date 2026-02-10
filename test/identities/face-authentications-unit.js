import { expect } from 'chai';
import nock from 'nock';
import Checkout from '../../src/Checkout.js';
import { AuthenticationError, NotFoundError } from '../../src/services/errors.js';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';

describe('Unit::Face Authentications', () => {
    it('should create a face authentication', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/face-authentications', {
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                configuration_id: 'cnf_tkoi5db4hryu5cei5vwoabr7we'
            })
            .reply(201, {
                id: 'fav_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                status: 'pending',
                configuration_id: 'cnf_tkoi5db4hryu5cei5vwoabr7we'
            });

        const cko = new Checkout(SK);
        const result = await cko.identities.faceAuthentications.createFaceAuthentication({
            applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
            configuration_id: 'cnf_tkoi5db4hryu5cei5vwoabr7we'
        });

        expect(result.id).to.equal('fav_tkoi5db4hryu5cei5vwoabr7we');
        expect(result.status).to.equal('pending');
    });

    it('should get a face authentication', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/face-authentications/fav_tkoi5db4hryu5cei5vwoabr7we')
            .reply(200, {
                id: 'fav_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                status: 'approved',
                configuration_id: 'cnf_tkoi5db4hryu5cei5vwoabr7we'
            });

        const cko = new Checkout(SK);
        const result = await cko.identities.faceAuthentications.getFaceAuthentication(
            'fav_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(result.id).to.equal('fav_tkoi5db4hryu5cei5vwoabr7we');
        expect(result.status).to.equal('approved');
    });

    it('should list face authentication attempts', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/face-authentications/fav_tkoi5db4hryu5cei5vwoabr7we/attempts')
            .reply(200, {
                data: [
                    {
                        id: 'att_1',
                        created_on: '2025-07-21T17:32:28Z',
                        status: 'completed'
                    },
                    {
                        id: 'att_2',
                        created_on: '2025-07-21T17:35:28Z',
                        status: 'completed'
                    }
                ]
            });

        const cko = new Checkout(SK);
        const result = await cko.identities.faceAuthentications.listAttempts(
            'fav_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(result.data).to.be.an('array');
        expect(result.data).to.have.lengthOf(2);
        expect(result.data[0].id).to.equal('att_1');
    });

    it('should get a specific face authentication attempt', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/face-authentications/fav_tkoi5db4hryu5cei5vwoabr7we/attempts/att_1')
            .reply(200, {
                id: 'att_1',
                created_on: '2025-07-21T17:32:28Z',
                status: 'completed',
                result: 'approved'
            });

        const cko = new Checkout(SK);
        const result = await cko.identities.faceAuthentications.getAttempt(
            'fav_tkoi5db4hryu5cei5vwoabr7we',
            'att_1'
        );

        expect(result.id).to.equal('att_1');
        expect(result.status).to.equal('completed');
        expect(result.result).to.equal('approved');
    });

    it('should create a face authentication attempt', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/face-authentications/fav_tkoi5db4hryu5cei5vwoabr7we/attempts', {
                selfie: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...'
            })
            .reply(201, {
                id: 'att_3',
                created_on: '2025-07-21T18:00:00Z',
                status: 'processing'
            });

        const cko = new Checkout(SK);
        const result = await cko.identities.faceAuthentications.createAttempt(
            'fav_tkoi5db4hryu5cei5vwoabr7we',
            {
                selfie: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...'
            }
        );

        expect(result.id).to.equal('att_3');
        expect(result.status).to.equal('processing');
    });

    it('should anonymize a face authentication', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/face-authentications/fav_tkoi5db4hryu5cei5vwoabr7we/anonymize')
            .reply(200, {
                id: 'fav_tkoi5db4hryu5cei5vwoabr7we',
                status: 'anonymized'
            });

        const cko = new Checkout(SK);
        const result = await cko.identities.faceAuthentications.anonymizeFaceAuthentication(
            'fav_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(result.id).to.equal('fav_tkoi5db4hryu5cei5vwoabr7we');
        expect(result.status).to.equal('anonymized');
    });

    it('should throw AuthenticationError when creating face authentication with invalid credentials', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/face-authentications')
            .reply(401);

        const cko = new Checkout('sk_invalid');
        try {
            await cko.identities.faceAuthentications.createFaceAuthentication({
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                configuration_id: 'cnf_tkoi5db4hryu5cei5vwoabr7we'
            });
            throw new Error('Should have thrown AuthenticationError');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw NotFoundError when getting non-existent face authentication', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/face-authentications/fav_invalid')
            .reply(404);

        const cko = new Checkout(SK);
        try {
            await cko.identities.faceAuthentications.getFaceAuthentication('fav_invalid');
            throw new Error('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
