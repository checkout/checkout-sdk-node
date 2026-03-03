import { expect } from 'chai';
import nock from 'nock';
import Checkout from '../../../src/Checkout.js';
import { AuthenticationError, NotFoundError } from '../../../src/services/errors.js';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';

describe('Unit::ID Document Verifications', () => {
    it('should create an ID document verification', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/id-document-verifications', {
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                configuration_id: 'cnf_tkoi5db4hryu5cei5vwoabr7we'
            })
            .reply(201, {
                id: 'iddv_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                user_journey_id: 'usj_tkoi5db4hryu5cei5vwoabr7we',
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                status: 'approved',
                response_codes: [
                    {
                        code: 10000,
                        summary: 'approved'
                    }
                ],
                declared_data: {
                    name: 'Hannah Bret'
                },
                document: {
                    full_name: 'Hannah Bret',
                    birth_date: '1994-10-15',
                    document_type: 'ID',
                    document_issuing_country: 'US',
                    front_image_signed_url: 'https://storage.example.com/front.png'
                },
                _links: {
                    self: {
                        href: 'https://identity-verification.checkout.com/id-document-verifications/iddv_tkoi5db4hryu5cei5vwoabr7we'
                    },
                    applicant: {
                        href: 'https://identity-verification.checkout.com/applicants/aplt_tkoi5db4hryu5cei5vwoabr7we'
                    }
                }
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.idDocumentVerifications.createIDDocumentVerification({
            applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
            configuration_id: 'cnf_tkoi5db4hryu5cei5vwoabr7we'
        });

        expect(result.id).to.equal('iddv_tkoi5db4hryu5cei5vwoabr7we');
        expect(result.status).to.equal('approved');
    });

    it('should get an ID document verification', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/id-document-verifications/iddv_tkoi5db4hryu5cei5vwoabr7we')
            .reply(200, {
                id: 'iddv_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                user_journey_id: 'usj_tkoi5db4hryu5cei5vwoabr7we',
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                status: 'approved',
                response_codes: [
                    {
                        code: 10000,
                        summary: 'approved'
                    }
                ],
                declared_data: {
                    name: 'Hannah Bret'
                },
                document: {
                    full_name: 'Hannah Bret',
                    birth_date: '1994-10-15',
                    document_type: 'ID',
                    document_issuing_country: 'US',
                    front_image_signed_url: 'https://storage.example.com/front.png'
                },
                _links: {
                    self: {
                        href: 'https://identity-verification.checkout.com/id-document-verifications/iddv_tkoi5db4hryu5cei5vwoabr7we'
                    },
                    applicant: {
                        href: 'https://identity-verification.checkout.com/applicants/aplt_tkoi5db4hryu5cei5vwoabr7we'
                    }
                }
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.idDocumentVerifications.getIDDocumentVerification(
            'iddv_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(result.id).to.equal('iddv_tkoi5db4hryu5cei5vwoabr7we');
        expect(result.status).to.equal('approved');
    });

    it('should list ID document verification attempts', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/id-document-verifications/iddv_tkoi5db4hryu5cei5vwoabr7we/attempts')
            .reply(200, {
                total_count: 2,
                skip: 10,
                limit: 10,
                data: [
                    {
                        id: 'datp_tkoi5db4hryu5cei5vwoabr7we',
                        created_on: '2025-07-21T17:32:28Z',
                        modified_on: '2025-07-21T17:40:32Z',
                        status: 'completed',
                        response_codes: [],
                        _links: {
                            self: {
                                href: 'https://idv.checkout.com/iddv_tkoi5db4hryu5cei5vwoabr7we'
                            }
                        }
                    }
                ],
                _links: {
                    self: {
                        href: 'https://identity-verification.sandbox.checkout.com/id-document-verifications/iddv_tkoi5db4hryu5cei5vwoabr7we/attempts'
                    },
                    next: {
                        href: 'https://identity-verification.sandbox.checkout.com/id-document-verifications/iddv_tkoi5db4hryu5cei5vwoabr7we/attempts?...'
                    },
                    previous: {
                        href: 'https://identity-verification.sandbox.checkout.com/id-document-verifications/iddv_tkoi5db4hryu5cei5vwoabr7we/attempts?...'
                    }
                }
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.idDocumentVerifications.listAttempts(
            'iddv_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(result.data).to.be.an('array');
        expect(result.data).to.have.lengthOf(1);
        expect(result.data[0].id).to.equal('datp_tkoi5db4hryu5cei5vwoabr7we');
    });

    it('should get a specific ID document verification attempt', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/id-document-verifications/iddv_tkoi5db4hryu5cei5vwoabr7we/attempts/datp_tkoi5db4hryu5cei5vwoabr7we')
            .reply(200, {
                id: 'datp_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                status: 'completed',
                response_codes: [],
                _links: {
                    self: {
                        href: 'https://idv.checkout.com/datp_tkoi5db4hryu5cei5vwoabr7we'
                    }
                }
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.idDocumentVerifications.getAttempt(
            'iddv_tkoi5db4hryu5cei5vwoabr7we',
            'datp_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(result.id).to.equal('datp_tkoi5db4hryu5cei5vwoabr7we');
        expect(result.status).to.equal('completed');
    });

    it('should create an ID document verification attempt', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/id-document-verifications/iddv_tkoi5db4hryu5cei5vwoabr7we/attempts', {
                document_front: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
                document_back: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...'
            })
            .reply(201, {
                id: 'datp_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T18:00:00Z',
                modified_on: '2025-07-21T17:40:32Z',
                status: 'completed',
                response_codes: [],
                _links: {
                    self: {
                        href: 'https://identity-verification.sandbox.checkout.com/id-document-verifications/datp_tkoi5db4hryu5cei5vwoabr7we'
                    }
                }
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.idDocumentVerifications.createAttempt(
            'iddv_tkoi5db4hryu5cei5vwoabr7we',
            {
                document_front: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
                document_back: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...'
            }
        );

        expect(result.id).to.equal('datp_tkoi5db4hryu5cei5vwoabr7we');
        expect(result.status).to.equal('completed');
    });

    it('should get ID document verification PDF report', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/id-document-verifications/iddv_tkoi5db4hryu5cei5vwoabr7we/pdf-report')
            .reply(200, {
                pdf_report: 'https://www.example.com/pdf',
                signed_url: 'https://www.example.com/signed/pdf'
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.idDocumentVerifications.getPDFReport(
            'iddv_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(result.pdf_report).to.equal('https://www.example.com/pdf');
        expect(result.signed_url).to.be.a('string');
    });

    it('should anonymize an ID document verification', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/id-document-verifications/iddv_tkoi5db4hryu5cei5vwoabr7we/anonymize')
            .reply(200, {
                id: 'iddv_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                user_journey_id: 'usj_tkoi5db4hryu5cei5vwoabr7we',
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                status: 'approved',
                response_codes: [
                    {
                        code: 10000,
                        summary: 'approved'
                    }
                ],
                declared_data: {
                    name: 'Hannah Bret'
                },
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
        const result = await cko.identities.idDocumentVerifications.anonymizeIDDocumentVerification(
            'iddv_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(result.id).to.equal('iddv_tkoi5db4hryu5cei5vwoabr7we');
        expect(result.status).to.equal('approved');
        expect(result.applicant_id).to.equal('aplt_tkoi5db4hryu5cei5vwoabr7we');
    });

    it('should throw AuthenticationError when creating ID document verification with invalid credentials', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/id-document-verifications')
            .reply(401);

        const cko = new Checkout('sk_invalid', { subdomain: 'test' });
        try {
            await cko.identities.idDocumentVerifications.createIDDocumentVerification({
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                configuration_id: 'cnf_tkoi5db4hryu5cei5vwoabr7we'
            });
            throw new Error('Should have thrown AuthenticationError');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw NotFoundError when getting non-existent ID document verification', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/id-document-verifications/idv_invalid')
            .reply(404);

        const cko = new Checkout(SK, { subdomain: 'test' });
        try {
            await cko.identities.idDocumentVerifications.getIDDocumentVerification('idv_invalid');
            throw new Error('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
