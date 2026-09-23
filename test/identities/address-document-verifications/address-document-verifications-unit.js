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
            .reply(200, { pdf_report: 'https://www.example.com/reports/adv.pdf' });

        const cko = new Checkout(SK, { subdomain: 'test' });
        const result = await cko.identities.addressDocumentVerifications.getPDFReport(ADV_ID);

        // IdvPdf declares exactly one property, pdf_report, and it is required. The fixture used
        // to return an id, which the schema has no equivalent for, so nothing exercised the
        // property this row renamed.
        expect(result.pdf_report).to.equal('https://www.example.com/reports/adv.pdf');
        expect(result.signed_url).to.be.undefined;
    });

    // The new attempt-assets endpoint.
    //
    // The payload is the swagger example verbatim (components.examples
    // adv_attempt_assets_response_body), apart from shortened hrefs. asset_url is the only link
    // AdvAttemptAsset declares, and it is required, so using the spec's own example rather than a
    // hand-written fixture is the point.
    describe('attempt assets', () => {
        const ASSETS = {
            total_count: 1,
            skip: 0,
            limit: 10,
            data: [
                {
                    type: 'document',
                    _links: {
                        asset_url: {
                            href: 'https://storage-b.env.ubble.ai/ubble-ai/NDY/address_document.png'
                        }
                    }
                }
            ],
            _links: {
                self: { href: `${BASE}/address-document-verifications/${ADV_ID}/attempts/${ATTEMPT_ID}/assets` },
                next: {
                    href: `${BASE}/address-document-verifications/${ADV_ID}/attempts/${ATTEMPT_ID}/assets?skip=10`
                },
                previous: {
                    href: `${BASE}/address-document-verifications/${ADV_ID}/attempts/${ATTEMPT_ID}/assets?skip=0`
                }
            }
        };

        it('should get the attempt assets with skip and limit', async () => {
            nock(BASE)
                .get(`/address-document-verifications/${ADV_ID}/attempts/${ATTEMPT_ID}/assets`)
                .query({ skip: 0, limit: 10 })
                .reply(200, ASSETS);

            const cko = new Checkout(SK, { subdomain: 'test' });
            const result = await cko.identities.addressDocumentVerifications.getAttemptAssets(
                ADV_ID,
                ATTEMPT_ID,
                { skip: 0, limit: 10 }
            );

            expect(result.total_count).to.equal(1);
            expect(result.data).to.have.lengthOf(1);
            expect(result.data[0].type).to.equal('document');
            expect(result.data[0]._links.asset_url.href).to.contain('address_document.png');
            expect(result.data[0]._links.download).to.be.undefined;
        });

        // The schema types _links as IdvSelfLink, which declares self only, but the endpoint's own
        // example returns next and previous too. Reported internally; the example is what a caller
        // actually has to page through, so that is what this asserts.
        it('should expose the pagination links from the example', async () => {
            nock(BASE)
                .get(`/address-document-verifications/${ADV_ID}/attempts/${ATTEMPT_ID}/assets`)
                .reply(200, ASSETS);

            const cko = new Checkout(SK, { subdomain: 'test' });
            const result = await cko.identities.addressDocumentVerifications.getAttemptAssets(
                ADV_ID,
                ATTEMPT_ID
            );

            expect(result._links.self.href).to.contain('/assets');
            expect(result._links.next.href).to.contain('skip=10');
            expect(result._links.previous.href).to.contain('skip=0');
        });

        // data declares minItems 0, so an attempt with no assets yet is a legal page.
        it('should handle an empty assets page', async () => {
            nock(BASE)
                .get(`/address-document-verifications/${ADV_ID}/attempts/${ATTEMPT_ID}/assets`)
                .reply(200, { total_count: 0, skip: 0, limit: 10, data: [], _links: { self: { href: 'x' } } });

            const cko = new Checkout(SK, { subdomain: 'test' });
            const result = await cko.identities.addressDocumentVerifications.getAttemptAssets(
                ADV_ID,
                ATTEMPT_ID
            );

            expect(result.total_count).to.equal(0);
            expect(result.data).to.deep.equal([]);
        });
    });

    // Part F M1: skip and limit on list-attempts, which took no query parameters before this row.
    describe('attempts pagination', () => {
        const ATTEMPTS = { total_count: 25, skip: 5, limit: 25, data: [], _links: { self: { href: 'x' } } };

        it('should send skip and limit', async () => {
            nock(BASE)
                .get(`/address-document-verifications/${ADV_ID}/attempts`)
                .query({ skip: 5, limit: 25 })
                .reply(200, ATTEMPTS);

            const cko = new Checkout(SK, { subdomain: 'test' });
            const result = await cko.identities.addressDocumentVerifications.listAttempts(ADV_ID, {
                skip: 5,
                limit: 25
            });

            expect(result.total_count).to.equal(25);
        });

        it('should send no query string when no params are passed', async () => {
            nock(BASE)
                .get(`/address-document-verifications/${ADV_ID}/attempts`)
                .reply(200, ATTEMPTS);

            const cko = new Checkout(SK, { subdomain: 'test' });
            const result = await cko.identities.addressDocumentVerifications.listAttempts(ADV_ID);

            expect(result.total_count).to.equal(25);
        });
    });
});
