import { expect } from 'chai';
import nock from 'nock';
import Checkout from '../../../src/Checkout.js';
import { AuthenticationError, NotFoundError } from '../../../src/services/errors.js';

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
                user_journey_id: 'usj_tkoi5db4hryu5cei5vwoabr7we',
                status: 'pending',
                response_codes: [],
                risk_labels: [],
                declared_data: {
                    name: 'Hannah Bret'
                },
                documents: [
                    {
                        full_name: 'Hannah Bret',
                        birth_date: '1934-10-02',
                        document_type: 'ID',
                        document_issuing_country: 'US',
                        front_image_signed_url: 'https://storage.example.com/front.png'
                    }
                ],
                _links: {
                    self: {
                        href: 'https://identity-verification.checkout.com/identity-verifications/idv_tkoi5db4hryu5cei5vwoabr7we'
                    },
                    applicant: {
                        href: 'https://identity-verification.checkout.com/applicants/aplt_lkoi5db4hryu5cei5vwoabqere'
                    }
                }
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const verification = await cko.identities.identityVerifications.createIdentityVerification({
            applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
            declared_data: {
                name: 'Hannah Bret'
            },
            redirect_url: 'https://example.com?query-param=hello'
        });

        expect(verification.id).to.equal('idv_tkoi5db4hryu5cei5vwoabr7we');
        expect(verification.status).to.equal('pending');
        expect(verification.user_journey_id).to.equal('usj_tkoi5db4hryu5cei5vwoabr7we');
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
                modified_on: '2025-07-21T17:40:32Z',
                user_journey_id: 'usj_tkoi5db4hryu5cei5vwoabr7we',
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                status: 'pending',
                response_codes: [],
                risk_labels: [],
                declared_data: {
                    name: 'Hannah Bret'
                },
                documents: [],
                redirect_url: 'https://myweb.site?query-param=hello',
                _links: {
                    self: {
                        href: 'https://identity-verification.checkout.com/identity-verifications/idv_tkoi5db4hryu5cei5vwoabr7we'
                    },
                    verification_url: {
                        href: 'https://idv.checkout.com/4hryu5cei5/'
                    }
                }
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const verification = await cko.identities.identityVerifications.createAndStartIdentityVerification({
            applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
            configuration_id: 'cnf_tkoi5db4hryu5cei5vwoabr7we'
        });

        expect(verification.id).to.equal('idv_tkoi5db4hryu5cei5vwoabr7we');
        expect(verification.status).to.equal('pending');
        expect(verification.redirect_url).to.equal('https://myweb.site?query-param=hello');
    });

    it('should get an identity verification', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/identity-verifications/idv_tkoi5db4hryu5cei5vwoabr7we')
            .reply(200, {
                id: 'idv_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                user_journey_id: 'usj_tkoi5db4hryu5cei5vwoabr7we',
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
                verified_identity: {
                    full_name: 'Hannah Bret',
                    birth_date: '1934-10-02'
                },
                declared_data: {
                    name: 'Hannah Bret'
                },
                documents: [
                    {
                        full_name: 'Hannah Bret',
                        birth_date: '1934-10-02',
                        document_type: 'ID',
                        document_issuing_country: 'US',
                        front_image_signed_url: 'https://storage.example.com/front.png'
                    }
                ],
                face: {
                    image_signed_url: 'https://storage.example.com/face.png'
                },
                _links: {
                    self: {
                        href: 'https://identity-verification.checkout.com/identity-verifications/idv_tkoi5db4hryu5cei5vwoabr7we'
                    },
                    applicant: {
                        href: 'https://identity-verification.checkout.com/applicants/aplt_tkoi5db4hryu5cei5vwoabr7ou'
                    }
                }
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const verification = await cko.identities.identityVerifications.getIdentityVerification(
            'idv_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(verification.id).to.equal('idv_tkoi5db4hryu5cei5vwoabr7we');
        expect(verification.status).to.equal('approved');
        expect(verification.user_journey_id).to.equal('usj_tkoi5db4hryu5cei5vwoabr7we');
    });

    it('should create an identity verification attempt', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/identity-verifications/idv_tkoi5db4hryu5cei5vwoabr7we/attempts')
            .reply(201, {
                id: 'iatp_tkoi5db4hryu5cei5vwoabrPoQ',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                client_information: {
                    pre_selected_residence_country: 'FR',
                    pre_selected_language: 'en-US'
                },
                applicant_session_information: {
                    ip_address: '123.123.123.01'
                },
                redirect_url: 'https://myweb.site?query-param=hello',
                status: 'pending_redirection',
                response_codes: [],
                _links: {
                    verification_url: {
                        href: 'https://idv.checkout.com/4hryu5cei5/'
                    },
                    self: {
                        href: 'https://identity-verification.sandbox.checkout.com/identity-verifications/idv_01j58p8rw1hvterhqt66xn6js2/attempts/iatp_tkoi5db4hryu5cei5vwoabrPoQ'
                    }
                }
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const attempt = await cko.identities.identityVerifications.createAttempt(
            'idv_tkoi5db4hryu5cei5vwoabr7we',
            {}
        );

        expect(attempt.id).to.equal('iatp_tkoi5db4hryu5cei5vwoabrPoQ');
        expect(attempt.redirect_url).to.equal('https://myweb.site?query-param=hello');
    });

    it('should list identity verification attempts', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/identity-verifications/idv_tkoi5db4hryu5cei5vwoabr7we/attempts')
            .reply(200, {
                total_count: 2,
                skip: 10,
                limit: 10,
                data: [
                    {
                        id: 'iatp_tkoi5db4hryu5cei5vwoabrPoQ',
                        created_on: '2025-07-21T17:32:28Z',
                        modified_on: '2025-07-21T17:40:32Z',
                        status: 'completed',
                        response_codes: [],
                        applicant_session_information: {
                            ip_address: '123.123.123.01'
                        },
                        redirect_url: 'https://myweb.site?query-param=hello',
                        _links: {
                            verification_url: {
                                href: 'https://idv.checkout.com/4hryu5cei5/'
                            }
                        }
                    }
                ],
                _links: {
                    self: {
                        href: 'https://identity-verification.sandbox.checkout.com/identity-verifications/fav_mtta050yudd54y5iqb5ijh8jtvz/attempts'
                    },
                    next: {
                        href: 'https://identity-verification.sandbox.checkout.com/identity-verifications/fav_mtta050yudd54y5iqb5ijh8jtvz/attempts?...'
                    },
                    previous: {
                        href: 'https://identity-verification.sandbox.checkout.com/identity-verifications/fav_mtta050yudd54y5iqb5ijh8jtvz/attempts?...'
                    }
                }
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.identityVerifications.listAttempts(
            'idv_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(result.data).to.be.an('array');
        expect(result.data).to.have.lengthOf(1);
        expect(result.data[0].id).to.equal('iatp_tkoi5db4hryu5cei5vwoabrPoQ');
    });

    it('should get a specific identity verification attempt', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/identity-verifications/idv_tkoi5db4hryu5cei5vwoabr7we/attempts/iatp_tkoi5db4hryu5cei5vwoabrPoQ')
            .reply(200, {
                id: 'iatp_tkoi5db4hryu5cei5vwoabrPoQ',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                redirect_url: 'https://myweb.site?query-param=hello',
                status: 'capture_in_progress',
                client_information: {
                    pre_selected_residence_country: 'FR',
                    pre_selected_language: 'en-US'
                },
                applicant_session_information: {
                    ip_address: '123.123.123.01',
                    selected_documents: [
                        {
                            country: 'FR',
                            document_type: 'Passport'
                        }
                    ]
                },
                response_codes: [],
                _links: {
                    self: {
                        href: 'https://identity-verification.sandbox.checkout.com/identity-verifications/idv_tkoi5db4hryu5cei5vwoabr7we/attempts/iatp_tkoi5db4hryu5cei5vwoabraio'
                    },
                    verification_url: {
                        href: 'https://idv.checkout.com/4hryu5cei5/'
                    }
                }
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const attempt = await cko.identities.identityVerifications.getAttempt(
            'idv_tkoi5db4hryu5cei5vwoabr7we',
            'iatp_tkoi5db4hryu5cei5vwoabrPoQ'
        );

        expect(attempt.id).to.equal('iatp_tkoi5db4hryu5cei5vwoabrPoQ');
        expect(attempt.status).to.equal('capture_in_progress');
    });

    it('should anonymize an identity verification', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/identity-verifications/idv_tkoi5db4hryu5cei5vwoabr7we/anonymize')
            .reply(200, {
                id: 'idv_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                user_journey_id: 'usj_tkoi5db4hryu5cei5vwoabr7we',
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
                declared_data: {
                    name: 'Hannah Bret'
                },
                documents: [
                    {
                        full_name: 'Hannah Bret',
                        birth_date: '1934-10-02',
                        document_type: 'ID',
                        document_issuing_country: 'US',
                        front_image_signed_url: 'https://storage.example.com/front.png'
                    }
                ],
                _links: {
                    self: {
                        href: 'https://identity-verification.checkout.com/identity-verifications/idv_tkoi5db4hryu5cei5vwoabr7we'
                    },
                    applicant: {
                        href: 'https://identity-verification.checkout.com/applicants/aplt_tkoi5db4hryu5cei5vwoabr7we'
                    }
                }
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.identityVerifications.anonymizeIdentityVerification(
            'idv_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(result.id).to.equal('idv_tkoi5db4hryu5cei5vwoabr7we');
        expect(result.status).to.equal('approved');
        expect(result.applicant_id).to.equal('aplt_tkoi5db4hryu5cei5vwoabr7we');
    });

    it('should get identity verification PDF report', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/identity-verifications/idv_tkoi5db4hryu5cei5vwoabr7we/pdf-report')
            .reply(200, Buffer.from('PDF content'), {
                'content-type': 'application/pdf'
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.identityVerifications.getPDFReport(
            'idv_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(result).to.be.an.instanceOf(Buffer);
    });

    it('should throw AuthenticationError when creating identity verification with invalid credentials', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/identity-verifications')
            .reply(401);

        const cko = new Checkout('sk_invalid', { subdomain: 'test' });
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

        const cko = new Checkout(SK, { subdomain: 'test' });
        try {
            await cko.identities.identityVerifications.getIdentityVerification('idv_invalid');
            throw new Error('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
