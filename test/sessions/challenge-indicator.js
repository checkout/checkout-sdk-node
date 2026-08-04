import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const ACCESS_HOST = 'https://123456789.access.sandbox.checkout.com';
const API_HOST = 'https://123456789.api.sandbox.checkout.com';

const SECRET =
    '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg';

// The nine values accepted by POST /sessions, per the API Reference ChallengeIndicator schema.
const SESSION_VALUES = [
    'no_preference',
    'no_challenge_requested',
    'challenge_requested',
    'challenge_requested_mandate',
    'low_value',
    'trusted_listing',
    'trusted_listing_prompt',
    'transaction_risk_assessment',
    'data_share',
];

// The four values accepted by the 3ds.challenge_indicator field on the payments family.
const PAYMENT_VALUES = [
    'no_preference',
    'no_challenge_requested',
    'challenge_requested',
    'challenge_requested_mandate',
];

const client = () =>
    new Checkout(SECRET, {
        client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
        scope: ['sessions:browser'],
        environment: 'sandbox',
        subdomain: '123456789',
    });

const mockToken = () =>
    nock(ACCESS_HOST).post('/connect/token').reply(201, {
        access_token: '1234',
        expires_in: 3600,
        token_type: 'Bearer',
        scope: 'sessions:browser',
    });

const sessionBody = (challengeIndicator) => ({
    source: {
        type: 'card',
        number: '4485040371536584',
        expiry_month: 1,
        expiry_year: 2030,
    },
    amount: 100,
    currency: 'USD',
    authentication_type: 'regular',
    authentication_category: 'payment',
    challenge_indicator: challengeIndicator,
    reference: 'ORD-5023-4E89',
    completion: {
        type: 'non_hosted',
        callback_url: 'https://example.com/sessions/callback',
    },
});

/**
 * The SDK is untyped and forwards the request body verbatim, so nothing constrains
 * challenge_indicator at the client. These tests capture the body that actually reaches the wire,
 * which is what makes them meaningful: they fail if a future change starts validating, rewriting or
 * dropping the field — in particular the five exemption values, which only POST /sessions accepts.
 */
describe('Sessions challenge_indicator', () => {
    afterEach(() => nock.cleanAll());

    SESSION_VALUES.forEach((value) => {
        it(`should send challenge_indicator "${value}" to /sessions unchanged`, async () => {
            mockToken();

            let sent;
            nock(API_HOST)
                .post('/sessions', (body) => {
                    sent = body;
                    return true;
                })
                .reply(201, { id: 'sid_jlfm4ithpgpefdxgzzdnc3xrc4', status: 'pending' });

            await client().sessions.request(sessionBody(value));

            expect(sent.challenge_indicator).to.equal(value);
        });
    });

    it('should not strip or rewrite the five exemption values', async () => {
        const exemptions = SESSION_VALUES.filter((value) => !PAYMENT_VALUES.includes(value));

        expect(exemptions).to.have.lengthOf(5);

        for (const value of exemptions) {
            mockToken();

            let sent;
            nock(API_HOST)
                .post('/sessions', (body) => {
                    sent = body;
                    return true;
                })
                .reply(201, { id: 'sid_jlfm4ithpgpefdxgzzdnc3xrc4', status: 'pending' });

            await client().sessions.request(sessionBody(value));

            expect(sent).to.have.property('challenge_indicator', value);
            nock.cleanAll();
        }
    });

    PAYMENT_VALUES.forEach((value) => {
        it(`should send 3ds.challenge_indicator "${value}" to /payment-sessions unchanged`, async () => {
            mockToken();

            let sent;
            nock(API_HOST)
                .post('/payment-sessions', (body) => {
                    sent = body;
                    return true;
                })
                .reply(201, { id: 'ps_2adCU4m0Q1WMlM6Pqu3ilRvUUwr' });

            await client().paymentSessions.request({
                amount: 100,
                currency: 'USD',
                reference: 'ORD-123A',
                billing: { address: { country: 'GB' } },
                success_url: 'https://example.com/success',
                failure_url: 'https://example.com/failure',
                '3ds': { enabled: true, challenge_indicator: value },
            });

            expect(sent['3ds'].challenge_indicator).to.equal(value);
        });
    });
});
