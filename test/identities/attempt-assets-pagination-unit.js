import { expect } from 'chai';
import nock from 'nock';
import Checkout from '../../src/Checkout.js';
import { buildQueryParams } from '../../src/services/utils.js';

// Part A (the two new attempt-assets endpoints) and part F M1 (pagination on all four
// list-attempts endpoints) of the 2026-09-02 swagger delta.
//
// The assets payloads are the swagger examples verbatim, from components.examples, apart from
// shortened hrefs. asset_url is the only link AdvAttemptAsset and IddvAttemptAsset declare, and it
// is required, so using the spec's own example rather than a hand-written fixture is the point.

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';
const BASE = 'https://identity-verification.sandbox.checkout.com';

const ADV_ID = 'adv_tkoi5db4hryu5cei5vwoabr7we';
const ADV_ATTEMPT_ID = 'adva_tkoi5db4hryu5cei5vwoabr7we';
const IDDV_ID = 'iddv_tkoi5db4hryu5cei5vwoabr7we';
const IDDV_ATTEMPT_ID = 'datp_tkoi5db4hryu5cei5vwoabraio';

const ADV_ASSETS = {
    total_count: 1,
    skip: 0,
    limit: 10,
    data: [
        {
            type: 'document',
            _links: {
                asset_url: { href: 'https://storage-b.env.ubble.ai/ubble-ai/NDY/address_document.png' }
            }
        }
    ],
    _links: {
        self: { href: `${BASE}/address-document-verifications/${ADV_ID}/attempts/${ADV_ATTEMPT_ID}/assets` },
        next: { href: `${BASE}/address-document-verifications/${ADV_ID}/attempts/${ADV_ATTEMPT_ID}/assets?skip=10` },
        previous: { href: `${BASE}/address-document-verifications/${ADV_ID}/attempts/${ADV_ATTEMPT_ID}/assets?skip=0` }
    }
};

const IDDV_ASSETS = {
    total_count: 2,
    skip: 0,
    limit: 10,
    data: [
        {
            type: 'document_front_image',
            _links: { asset_url: { href: 'https://storage-b.env.ubble.ai/ubble-ai/NDY/document_front.png' } }
        },
        {
            type: 'document_back_image',
            _links: { asset_url: { href: 'https://storage-b.env.ubble.ai/ubble-ai/NDY/document_back.png' } }
        }
    ],
    _links: {
        self: { href: `${BASE}/id-document-verifications/${IDDV_ID}/attempts/${IDDV_ATTEMPT_ID}/assets` }
    }
};

const cko = () => new Checkout(SK, { subdomain: 'test' });

afterEach(() => {
    nock.cleanAll();
});

describe('Unit::Identities attempt assets', () => {
    it('should get the address document verification attempt assets', async () => {
        nock(BASE)
            .get(`/address-document-verifications/${ADV_ID}/attempts/${ADV_ATTEMPT_ID}/assets`)
            .query({ skip: 0, limit: 10 })
            .reply(200, ADV_ASSETS);

        const result = await cko().identities.addressDocumentVerifications.getAttemptAssets(
            ADV_ID,
            ADV_ATTEMPT_ID,
            { skip: 0, limit: 10 }
        );

        expect(result.total_count).to.equal(1);
        expect(result.data).to.have.lengthOf(1);
        expect(result.data[0].type).to.equal('document');
        expect(result.data[0]._links.asset_url.href).to.contain('address_document.png');
        expect(result.data[0]._links.download).to.be.undefined;
        expect(result._links.next.href).to.contain('skip=10');
    });

    it('should get the address document verification attempt assets without a query', async () => {
        nock(BASE)
            .get(`/address-document-verifications/${ADV_ID}/attempts/${ADV_ATTEMPT_ID}/assets`)
            .reply(200, ADV_ASSETS);

        const result = await cko().identities.addressDocumentVerifications.getAttemptAssets(
            ADV_ID,
            ADV_ATTEMPT_ID
        );

        expect(result.total_count).to.equal(1);
    });

    it('should get the ID document verification attempt assets, both types', async () => {
        nock(BASE)
            .get(`/id-document-verifications/${IDDV_ID}/attempts/${IDDV_ATTEMPT_ID}/assets`)
            .query({ limit: 10 })
            .reply(200, IDDV_ASSETS);

        const result = await cko().identities.idDocumentVerifications.getAttemptAssets(
            IDDV_ID,
            IDDV_ATTEMPT_ID,
            { limit: 10 }
        );

        expect(result.total_count).to.equal(2);
        expect(result.data.map((asset) => asset.type)).to.deep.equal([
            'document_front_image',
            'document_back_image'
        ]);
        expect(result.data[0]._links.asset_url.href).to.contain('document_front.png');
        expect(result.data[1]._links.asset_url.href).to.contain('document_back.png');
        expect(result.data[0]._links.download).to.be.undefined;
    });

    // data declares minItems 0, so an attempt with no assets yet is a legal page.
    it('should handle an empty assets page', async () => {
        nock(BASE)
            .get(`/address-document-verifications/${ADV_ID}/attempts/${ADV_ATTEMPT_ID}/assets`)
            .reply(200, { total_count: 0, skip: 0, limit: 10, data: [], _links: { self: { href: 'x' } } });

        const result = await cko().identities.addressDocumentVerifications.getAttemptAssets(
            ADV_ID,
            ADV_ATTEMPT_ID
        );

        expect(result.total_count).to.equal(0);
        expect(result.data).to.deep.equal([]);
    });

    it('should expose the assets through the backwards-compatible aggregate methods', async () => {
        nock(BASE)
            .get(`/address-document-verifications/${ADV_ID}/attempts/${ADV_ATTEMPT_ID}/assets`)
            .reply(200, ADV_ASSETS)
            .get(`/id-document-verifications/${IDDV_ID}/attempts/${IDDV_ATTEMPT_ID}/assets`)
            .reply(200, IDDV_ASSETS);

        const client = cko();
        const adv = await client.identities.getAddressDocumentVerificationAttemptAssets(ADV_ID, ADV_ATTEMPT_ID);
        const iddv = await client.identities.getIDDocumentVerificationAttemptAssets(IDDV_ID, IDDV_ATTEMPT_ID);

        expect(adv.data[0].type).to.equal('document');
        expect(iddv.data).to.have.lengthOf(2);
    });
});

describe('Unit::Identities attempts pagination', () => {
    const ATTEMPTS = { total_count: 25, skip: 5, limit: 25, data: [], _links: { self: { href: 'x' } } };

    it('sends skip and limit on the address document verification attempts', async () => {
        nock(BASE)
            .get(`/address-document-verifications/${ADV_ID}/attempts`)
            .query({ skip: 5, limit: 25 })
            .reply(200, ATTEMPTS);

        const result = await cko().identities.addressDocumentVerifications.listAttempts(ADV_ID, {
            skip: 5,
            limit: 25
        });

        expect(result.total_count).to.equal(25);
    });

    it('sends skip and limit on the ID document verification attempts', async () => {
        nock(BASE)
            .get(`/id-document-verifications/${IDDV_ID}/attempts`)
            .query({ skip: 5, limit: 25 })
            .reply(200, ATTEMPTS);

        const result = await cko().identities.idDocumentVerifications.listAttempts(IDDV_ID, {
            skip: 5,
            limit: 25
        });

        expect(result.total_count).to.equal(25);
    });

    it('sends skip and limit on the identity verification attempts', async () => {
        nock(BASE)
            .get('/identity-verifications/idv_1/attempts')
            .query({ skip: 5, limit: 25 })
            .reply(200, ATTEMPTS);

        const result = await cko().identities.identityVerifications.listAttempts('idv_1', {
            skip: 5,
            limit: 25
        });

        expect(result.total_count).to.equal(25);
    });

    it('sends skip and limit on the face authentication attempts', async () => {
        nock(BASE)
            .get('/face-authentications/fav_1/attempts')
            .query({ skip: 5, limit: 25 })
            .reply(200, ATTEMPTS);

        const result = await cko().identities.faceAuthentications.listAttempts('fav_1', {
            skip: 5,
            limit: 25
        });

        expect(result.total_count).to.equal(25);
    });

    it('sends no query string when no params are passed', async () => {
        nock(BASE)
            .get(`/address-document-verifications/${ADV_ID}/attempts`)
            .reply(200, ATTEMPTS);

        const result = await cko().identities.addressDocumentVerifications.listAttempts(ADV_ID);

        expect(result.total_count).to.equal(25);
    });

    it('forwards params through the backwards-compatible aggregate methods', async () => {
        nock(BASE)
            .get(`/address-document-verifications/${ADV_ID}/attempts`)
            .query({ limit: 1 })
            .reply(200, ATTEMPTS);

        const result = await cko().identities.listAddressDocumentVerificationAttempts(ADV_ID, { limit: 1 });

        expect(result.total_count).to.equal(25);
    });
});

describe('Unit::buildQueryParams', () => {
    it('keeps an explicit zero skip, unlike the PHP and Go filters', () => {
        expect(buildQueryParams('u', { skip: 0, limit: 10 })).to.equal('u?skip=0&limit=10');
    });

    it('adds no query string for undefined params', () => {
        expect(buildQueryParams('u', undefined)).to.equal('u');
    });

    // An empty object used to produce a bare "u?", which the list-attempts endpoints would have
    // started emitting once they began routing through this helper.
    it('adds no bare question mark for an empty params object', () => {
        expect(buildQueryParams('u', {})).to.equal('u');
    });
});
