import { expect } from 'chai';
import nock from 'nock';
import Checkout from '../../src/Checkout.js';
import { AuthenticationError, NotFoundError } from '../../src/services/errors.js';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';

describe('Unit::ID Document Verifications', () => {
    it('should create an ID document verification', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/id-document-verifications', {
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                configuration_id: 'cnf_tkoi5db4hryu5cei5vwoabr7we'
            })
            .reply(201, {
                id: 'idv_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                status: 'pending',
                configuration_id: 'cnf_tkoi5db4hryu5cei5vwoabr7we'
            });

        const cko = new Checkout(SK);
        const result = await cko.identities.idDocumentVerifications.createIDDocumentVerification({
            applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
            configuration_id: 'cnf_tkoi5db4hryu5cei5vwoabr7we'
        });

        expect(result.id).to.equal('idv_tkoi5db4hryu5cei5vwoabr7we');
        expect(result.status).to.equal('pending');
    });

    it('should get an ID document verification', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/id-document-verifications/idv_tkoi5db4hryu5cei5vwoabr7we')
            .reply(200, {
                id: 'idv_tkoi5db4hryu5cei5vwoabr7we',
                created_on: '2025-07-21T17:32:28Z',
                modified_on: '2025-07-21T17:40:32Z',
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                status: 'approved',
                configuration_id: 'cnf_tkoi5db4hryu5cei5vwoabr7we'
            });

        const cko = new Checkout(SK);
        const result = await cko.identities.idDocumentVerifications.getIDDocumentVerification(
            'idv_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(result.id).to.equal('idv_tkoi5db4hryu5cei5vwoabr7we');
        expect(result.status).to.equal('approved');
    });

    it('should list ID document verification attempts', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/id-document-verifications/idv_tkoi5db4hryu5cei5vwoabr7we/attempts')
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
        const result = await cko.identities.idDocumentVerifications.listAttempts(
            'idv_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(result.data).to.be.an('array');
        expect(result.data).to.have.lengthOf(1);
        expect(result.data[0].id).to.equal('att_1');
    });

    it('should get a specific ID document verification attempt', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/id-document-verifications/idv_tkoi5db4hryu5cei5vwoabr7we/attempts/att_1')
            .reply(200, {
                id: 'att_1',
                created_on: '2025-07-21T17:32:28Z',
                status: 'completed'
            });

        const cko = new Checkout(SK);
        const result = await cko.identities.idDocumentVerifications.getAttempt(
            'idv_tkoi5db4hryu5cei5vwoabr7we',
            'att_1'
        );

        expect(result.id).to.equal('att_1');
        expect(result.status).to.equal('completed');
    });

    it('should create an ID document verification attempt', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/id-document-verifications/idv_tkoi5db4hryu5cei5vwoabr7we/attempts', {
                document_front: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
                document_back: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...'
            })
            .reply(201, {
                id: 'att_2',
                created_on: '2025-07-21T18:00:00Z',
                status: 'processing'
            });

        const cko = new Checkout(SK);
        const result = await cko.identities.idDocumentVerifications.createAttempt(
            'idv_tkoi5db4hryu5cei5vwoabr7we',
            {
                document_front: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
                document_back: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...'
            }
        );

        expect(result.id).to.equal('att_2');
        expect(result.status).to.equal('processing');
    });

    it('should get ID document verification PDF report', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .get('/id-document-verifications/idv_tkoi5db4hryu5cei5vwoabr7we/pdf-report')
            .reply(200, {
                file_id: 'file_tkoi5db4hryu5cei5vwoabr7we',
                download_url: 'https://example.com/download/report.pdf'
            });

        const cko = new Checkout(SK);
        const result = await cko.identities.idDocumentVerifications.getPDFReport(
            'idv_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(result.file_id).to.equal('file_tkoi5db4hryu5cei5vwoabr7we');
        expect(result.download_url).to.be.a('string');
    });

    it('should anonymize an ID document verification', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/id-document-verifications/idv_tkoi5db4hryu5cei5vwoabr7we/anonymize')
            .reply(200, {
                id: 'idv_tkoi5db4hryu5cei5vwoabr7we',
                status: 'anonymized'
            });

        const cko = new Checkout(SK);
        const result = await cko.identities.idDocumentVerifications.anonymizeIDDocumentVerification(
            'idv_tkoi5db4hryu5cei5vwoabr7we'
        );

        expect(result.id).to.equal('idv_tkoi5db4hryu5cei5vwoabr7we');
        expect(result.status).to.equal('anonymized');
    });

    it('should throw AuthenticationError when creating ID document verification with invalid credentials', async () => {
        nock('https://identity-verification.api.sandbox.checkout.com')
            .post('/id-document-verifications')
            .reply(401);

        const cko = new Checkout('sk_invalid');
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

        const cko = new Checkout(SK);
        try {
            await cko.identities.idDocumentVerifications.getIDDocumentVerification('idv_invalid');
            throw new Error('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
