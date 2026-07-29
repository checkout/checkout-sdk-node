import { expect } from 'chai';
import nock from 'nock';
import Checkout from '../../../src/Checkout.js';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';
const BASE = 'https://identity-verification.sandbox.checkout.com';
const ADV_ID = 'adv_tkoi5db4hryu5cei5vwoabr7we';
const ATTEMPT_ID = 'adva_tkoi5db4hryu5cei5vwoabr7we';

afterEach(() => {
    nock.cleanAll();
});

describe('Unit::Address Document Verifications', () => {
    it('should create an address document verification', async () => {
        nock(BASE)
            .post('/address-document-verifications', {
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                user_journey_id: 'usj_tkoi5db4hryu5cei5vwoabr7we'
            })
            .reply(201, {
                id: ADV_ID,
                applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
                user_journey_id: 'usj_tkoi5db4hryu5cei5vwoabr7we',
                status: 'created',
                response_codes: [],
                _links: { self: { href: `${BASE}/address-document-verifications/${ADV_ID}` } }
            });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.addressDocumentVerifications.createAddressDocumentVerification({
            applicant_id: 'aplt_tkoi5db4hryu5cei5vwoabr7we',
            user_journey_id: 'usj_tkoi5db4hryu5cei5vwoabr7we'
        });

        expect(result.id).to.equal(ADV_ID);
        expect(result.status).to.equal('created');
    });

    it('should get an address document verification', async () => {
        nock(BASE)
            .get(`/address-document-verifications/${ADV_ID}`)
            .reply(200, { id: ADV_ID, status: 'approved' });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.addressDocumentVerifications.getAddressDocumentVerification(ADV_ID);
        expect(result.id).to.equal(ADV_ID);
    });

    it('should anonymize an address document verification', async () => {
        nock(BASE)
            .post(`/address-document-verifications/${ADV_ID}/anonymize`)
            .reply(200, { id: ADV_ID });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.addressDocumentVerifications
            .anonymizeAddressDocumentVerification(ADV_ID);
        expect(result.id).to.equal(ADV_ID);
    });

    it('should create an address document verification attempt', async () => {
        nock(BASE)
            .post(`/address-document-verifications/${ADV_ID}/attempts`)
            .reply(201, { id: ATTEMPT_ID, status: 'checks_in_progress', response_codes: [], _links: {} });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.addressDocumentVerifications
            .createAttempt(ADV_ID, { document: 'base64-data' });
        expect(result.id).to.equal(ATTEMPT_ID);
    });

    it('should list address document verification attempts', async () => {
        nock(BASE)
            .get(`/address-document-verifications/${ADV_ID}/attempts`)
            .reply(200, { total_count: 1, skip: 0, limit: 10, data: [{ id: ATTEMPT_ID }], _links: {} });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.addressDocumentVerifications.listAttempts(ADV_ID);
        expect(result.total_count).to.equal(1);
    });

    it('should get an address document verification attempt', async () => {
        nock(BASE)
            .get(`/address-document-verifications/${ADV_ID}/attempts/${ATTEMPT_ID}`)
            .reply(200, { id: ATTEMPT_ID, status: 'completed' });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.addressDocumentVerifications.getAttempt(ADV_ID, ATTEMPT_ID);
        expect(result.id).to.equal(ATTEMPT_ID);
    });

    it('should get an address document verification pdf report', async () => {
        nock(BASE)
            .get(`/address-document-verifications/${ADV_ID}/pdf-report`)
            .reply(200, { id: ADV_ID });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.addressDocumentVerifications.getPDFReport(ADV_ID);
        expect(result.id).to.equal(ADV_ID);
    });
});
