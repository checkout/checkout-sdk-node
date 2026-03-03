import { expect } from 'chai';
import nock from 'nock';
import Checkout from '../../../src/Checkout.js';
import { AuthenticationError, NotFoundError } from '../../../src/services/errors.js';

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
                user_journey_id: 'usj_tkoi5db4hryu5cei5vwoabr7we',
                status: 'created',
                response_codes: [],
                risk_labels: [],
                _links: {
                    self: {
                        href: 'https://identity-verification.checkout.com/face-authentications/fav_tkoi5db4hryu5cei5vwoabr7we'
                    },
                    applicant: {
                        href: 'https://identity-verification.checkout.com/applicants/aplt_tkoi5db4hryu5cei5vwoabr7we'
                    }
                }
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.faceAuthentications.createFaceAuthentication({
            applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
            configuration_id: 'cnf_tkoi5db4hryu5cei5vwoabr7we'
        });

        expect(result.id).to.equal('fav_tkoi5db4hryu5cei5vwoabr7we');
        expect(result.status).to.equal('created');
    });

    it('should get a face authentication', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/face-authentications/fav_tkoi5db4hryu5cei5vwoabr7we')
            .reply(200, {
                id: 'fav_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                user_journey_id: 'usj_t5bdzsdmi57ehhkrnmp5omjimu',
                status: 'approved',
                response_codes: [
                    {
                        code: 10000,
                        summary: 'approved'
                    }
                ],
                risk_labels: [
                    'multiple_faces_detected'
                ],
                face: {
                    image_signed_url: 'https://storage.example.com/face.png'
                },
                _links: {
                    self: {
                        href: 'https://identity-verification.checkout.com/face-authentications/fav_tkoi5db4hryu5cei5vwoabr7we'
                    },
                    applicant: {
                        href: 'https://identity-verification.checkout.com/applicants/aplt_tkoi5db4hryu5cei5vwoabr7we'
                    }
                }
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.faceAuthentications.getFaceAuthentication(
            'fav_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(result.id).to.equal('fav_tkoi5db4hryu5cei5vwoabr7we');
        expect(result.status).to.equal('approved');
        expect(result.user_journey_id).to.equal('usj_t5bdzsdmi57ehhkrnmp5omjimu');
    });

    it('should list face authentication attempts', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/face-authentications/fav_tkoi5db4hryu5cei5vwoabr7we/attempts')
            .reply(200, {
                total_count: 2,
                skip: 10,
                limit: 10,
                data: [
                    {
                        id: 'fatp_1',
                        created_on: '2025-07-21T17:32:28Z',
                        modified_on: '2025-07-21T17:40:32Z',
                        status: 'completed',
                        response_codes: [],
                        redirect_url: 'https://myweb.site?query-param=hello',
                        _links: {
                            verification_url: {
                                href: 'https://idv.checkout.com/4hryu5cei5/'
                            },
                            self: {
                                href: 'https://identity-verification.sandbox.checkout.com/face-authentications/fav_tkoi5db4hryu5cei5vwoabr7we/attempts/fatp_1'
                            }
                        }
                    }
                ],
                _links: {
                    self: {
                        href: 'https://identity-verification.sandbox.checkout.com/face-authentications/fav_tkoi5db4hryu5cei5vwoabr7we/attempts'
                    },
                    next: {
                        href: 'https://identity-verification.sandbox.checkout.com/face-authentications/fav_tkoi5db4hryu5cei5vwoabr7we/attempts?...'
                    },
                    previous: {
                        href: 'https://identity-verification.sandbox.checkout.com/face-authentications/fav_tkoi5db4hryu5cei5vwoabr7we/attempts?...'
                    }
                }
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.faceAuthentications.listAttempts(
            'fav_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(result.data).to.be.an('array');
        expect(result.data).to.have.lengthOf(1);
        expect(result.data[0].id).to.equal('fatp_1');
    });

    it('should get a specific face authentication attempt', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/face-authentications/fav_tkoi5db4hryu5cei5vwoabr7we/attempts/fatp_nk1wbmmczqumwt95k3v39mhbh2w')
            .reply(200, {
                id: 'fatp_nk1wbmmczqumwt95k3v39mhbh2w',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                redirect_url: 'https://myweb.site?query-param=hello',
                status: 'capture_in_progress',
                client_information: {
                    pre_selected_residence_country: 'FR',
                    pre_selected_language: 'en-US'
                },
                applicant_session_information: {
                    ip_address: '123.123.123.01'
                },
                response_codes: [],
                _links: {
                    verification_url: {
                        href: 'https://idv.checkout.com/4hryu5cei5/'
                    },
                    self: {
                        href: 'https://identity-verification.sandbox.checkout.com/face-authentications/fav_tkoi5db4hryu5cei5vwoabr7we/attempts/fatp_nk1wbmmczqumwt95k3v39mhbh2w'
                    }
                }
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.faceAuthentications.getAttempt(
            'fav_tkoi5db4hryu5cei5vwoabr7we',
            'fatp_nk1wbmmczqumwt95k3v39mhbh2w'
        );

        expect(result.id).to.equal('fatp_nk1wbmmczqumwt95k3v39mhbh2w');
        expect(result.status).to.equal('capture_in_progress');
        expect(result.redirect_url).to.equal('https://myweb.site?query-param=hello');
    });

    it('should create a face authentication attempt', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/face-authentications/fav_tkoi5db4hryu5cei5vwoabr7we/attempts', {
                selfie: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...'
            })
            .reply(201, {
                id: 'fatp_nk1wbmmczqumwt95k3v39mhbh2w',
                created_on: '2025-07-21T18:00:00Z',
                modified_on: '2025-07-21T17:40:32Z',
                client_information: {
                    pre_selected_residence_country: 'FR',
                    pre_selected_language: 'en-US'
                },
                redirect_url: 'https://myweb.site?query-param=hello',
                status: 'pending_redirection',
                response_codes: [],
                _links: {
                    verification_url: {
                        href: 'https://idv.checkout.com/4hryu5cei5/'
                    },
                    self: {
                        href: 'https://identity-verification.sandbox.checkout.com/face-authentications/fav_tkoi5db4hryu5cei5vwoabr7we/attempts/fatp_nk1wbmmczqumwt95k3v39mhbh2w'
                    }
                }
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.faceAuthentications.createAttempt(
            'fav_tkoi5db4hryu5cei5vwoabr7we',
            {
                selfie: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...'
            }
        );

        expect(result.id).to.equal('fatp_nk1wbmmczqumwt95k3v39mhbh2w');
        expect(result.status).to.equal('pending_redirection');
    });

    it('should anonymize a face authentication', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/face-authentications/fav_tkoi5db4hryu5cei5vwoabr7we/anonymize')
            .reply(200, {
                id: 'fav_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                user_journey_id: 'usj_t5bdzsdmi57ehhkrnmp5omjimu',
                status: 'approved',
                response_codes: [
                    {
                        code: 10000,
                        summary: 'approved'
                    }
                ],
                risk_labels: [
                    'multiple_faces_detected'
                ],
                _links: {
                    self: {
                        href: 'https://identity-verification.checkout.com/face-authentications/fav_tkoi5db4hryu5cei5vwoabr7we'
                    },
                    applicant: {
                        href: 'https://identity-verification.checkout.com/applicants/aplt_tkoi5db4hryu5cei5vwoabr7we'
                    }
                }
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.faceAuthentications.anonymizeFaceAuthentication(
            'fav_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(result.id).to.equal('fav_tkoi5db4hryu5cei5vwoabr7we');
        expect(result.status).to.equal('approved');
        expect(result.applicant_id).to.equal('aplt_tkoi5db4hryu5cei5vwoabr7we');
    });

    it('should throw AuthenticationError when creating face authentication with invalid credentials', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/face-authentications')
            .reply(401);

        const cko = new Checkout('sk_invalid', { subdomain: 'test' });
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

        const cko = new Checkout(SK, { subdomain: 'test' });
        try {
            await cko.identities.faceAuthentications.getFaceAuthentication('fav_invalid');
            throw new Error('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
