import { expect } from 'chai';
import nock from 'nock';
import Checkout from '../../../src/Checkout.js';
import { ValidationError } from '../../../src/services/errors.js';

// Part D of the 2026-09-02 swagger delta: the return-encrypted-cvv and Encryption-Key headers on
// PATCH /issuing/cards/{cardId}, and the encrypted_cvv the response then carries.
//
// These assert the headers on the outgoing request, because the header names are case sensitive in
// the spec (return-encrypted-cvv lower case, Encryption-Key title case) and they travel on a copy
// of the config rather than on the body.

const SUBDOMAIN = '123456789';
const ACCESS_BASE = `https://${SUBDOMAIN}.access.sandbox.checkout.com`;
const BASE = `https://${SUBDOMAIN}.api.sandbox.checkout.com`;
const CARD_ID = 'crd_fa6psq42dc0uxl3ct3jryhdo2m';

// Issuing uses OAuth, so every call needs the token endpoint stubbed first.
const cko = () => {
    nock(ACCESS_BASE).post('/connect/token').reply(200, {
        access_token: 'test_access_token',
        expires_in: 3600,
        token_type: 'Bearer',
        scope: 'issuing:card-management-write issuing:card-management-read'
    });

    return new Checkout('test_client_secret', {
        client: 'ack_testclie123456',
        scope: ['issuing:card-management-write', 'issuing:card-management-read'],
        environment: 'sandbox',
        subdomain: SUBDOMAIN
    });
};

afterEach(() => {
    nock.cleanAll();
});

describe('Unit::Issuing card update headers', () => {
    it('sends both headers with their exact swagger spelling', async () => {
        let seen;
        nock(BASE)
            .patch(`/issuing/cards/${CARD_ID}`)
            .reply(200, function () {
                seen = this.req.headers;
                return { last_modified_date: '2026-06-01T10:00:00Z', encrypted_cvv: 'oJMoNMEEUiQKYOsQ4Zd' };
            });

        const result = await cko().issuing.cards.updateCard(
            CARD_ID,
            { reference: 'X-123456-N11' },
            { 'return-encrypted-cvv': 'true', 'Encryption-Key': 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A' }
        );

        // nock lowercases header names when it records them, which is what HTTP does on the wire.
        expect(seen['return-encrypted-cvv']).to.equal('true');
        expect(seen['encryption-key']).to.equal('MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A');
        expect(result.encrypted_cvv).to.equal('oJMoNMEEUiQKYOsQ4Zd');
    });

    it('does not leak the headers into the request body', async () => {
        let body;
        nock(BASE)
            .patch(`/issuing/cards/${CARD_ID}`, (received) => {
                body = received;
                return true;
            })
            .reply(200, { last_modified_date: '2026-06-01T10:00:00Z' });

        await cko().issuing.cards.updateCard(
            CARD_ID,
            { reference: 'X-123456-N11' },
            { 'return-encrypted-cvv': 'true' }
        );

        expect(body).to.deep.equal({ reference: 'X-123456-N11' });
        expect(body['return-encrypted-cvv']).to.be.undefined;
        expect(body.headers).to.be.undefined;
    });

    it('sends no card headers when none are supplied', async () => {
        let seen;
        nock(BASE)
            .patch(`/issuing/cards/${CARD_ID}`)
            .reply(200, function () {
                seen = this.req.headers;
                return { last_modified_date: '2026-06-01T10:00:00Z' };
            });

        const result = await cko().issuing.cards.updateCard(CARD_ID, { reference: 'X-123456-N11' });

        expect(seen['return-encrypted-cvv']).to.be.undefined;
        expect(seen['encryption-key']).to.be.undefined;
        expect(result.encrypted_cvv).to.be.undefined;
    });

    it('sends the encryption key on its own', async () => {
        let seen;
        nock(BASE)
            .patch(`/issuing/cards/${CARD_ID}`)
            .reply(200, function () {
                seen = this.req.headers;
                return { last_modified_date: '2026-06-01T10:00:00Z' };
            });

        await cko().issuing.cards.updateCard(CARD_ID, {}, { 'Encryption-Key': 'MIIBIjAN' });

        expect(seen['encryption-key']).to.equal('MIIBIjAN');
        expect(seen['return-encrypted-cvv']).to.be.undefined;
    });

    it('forwards the headers through the backwards-compatible aggregate method', async () => {
        let seen;
        nock(BASE)
            .patch(`/issuing/cards/${CARD_ID}`)
            .reply(200, function () {
                seen = this.req.headers;
                return { last_modified_date: '2026-06-01T10:00:00Z' };
            });

        await cko().issuing.updateCard(CARD_ID, {}, { 'return-encrypted-cvv': 'true' });

        expect(seen['return-encrypted-cvv']).to.equal('true');
    });

    // The API answers 422 with error code encryption_key_required when the flag is set without a
    // key. The SDK must surface the error body rather than swallowing it.
    it('surfaces the 422 encryption_key_required error', async () => {
        nock(BASE)
            .patch(`/issuing/cards/${CARD_ID}`)
            .reply(422, {
                request_id: '0HLHPN8802NUF:00000003',
                error_type: 'request_invalid',
                error_codes: ['encryption_key_required']
            });

        try {
            await cko().issuing.cards.updateCard(CARD_ID, {}, { 'return-encrypted-cvv': 'true' });
            throw new Error('expected the update to reject');
        } catch (error) {
            expect(error).to.be.instanceOf(ValidationError);
            expect(error.http_code).to.equal(422);
            expect(error.body.error_codes).to.contain('encryption_key_required');
        }
    });

    // Part B: the renamed field is a plain passthrough here, since node models no card fields, but
    // the key still has to reach the wire under its new name.
    it('passes scheduled_activation_date through to the request body', async () => {
        let body;
        nock(BASE)
            .patch(`/issuing/cards/${CARD_ID}`, (received) => {
                body = received;
                return true;
            })
            .reply(200, { last_modified_date: '2026-06-01T10:00:00Z' });

        await cko().issuing.cards.updateCard(CARD_ID, {
            scheduled_activation_date: '2026-06-01T10:00Z',
            revocation_date: '2027-03-12'
        });

        expect(body.scheduled_activation_date).to.equal('2026-06-01T10:00Z');
        expect(body.revocation_date).to.equal('2027-03-12');
        expect(body.activation_date).to.be.undefined;
    });
});
