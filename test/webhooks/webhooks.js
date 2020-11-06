import {
    BadGateway,
    TooManyRequestsError,
    ValidationError,
    ValueError,
    AuthenticationError,
    NotFoundError,
    ActionNotAllowed,
    UrlAlreadyRegistered,
} from '../../src/services/errors';
import { Checkout } from '../../src/index';
import { expect } from 'chai';
import nock from 'nock';
import { v1 } from 'uuid';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Webhooks', () => {
    it('should retrieve all webhooks', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/webhooks')
            .reply(200, [
                {
                    id: 'wh_tdt72zlbe7cudogxdgit6nwk6i',
                    url: 'https://webhook.site/e09becba-a86d-46c5-8486-0d4b0c2dd93a',
                    active: true,
                    headers: { authorization: '0362c0ba-1f13-45ee-a165-2bd78cdc2520' },
                    content_type: 'json',
                    event_types: [
                        'dispute_canceled',
                        'dispute_evidence_required',
                        'dispute_expired',
                        'dispute_lost',
                        'dispute_resolved',
                        'dispute_won',
                        'payment_canceled',
                        'payment_capture_declined',
                        'payment_capture_pending',
                        'payment_chargeback',
                        'payment_expired',
                        'payment_paid',
                        'payment_pending',
                        'payment_refund_declined',
                        'payment_refund_pending',
                        'payment_refunded',
                        'payment_retrieval',
                        'payment_void_declined',
                        'payment_voided',
                        'source_updated',
                    ],
                    _links: { self: [Object] },
                },
                {
                    id: 'wh_qxadexh6qyyulb4ve6v5r3fjcy',
                    url: 'http://requestbin.fullcontact.com/rjk50drj',
                    active: true,
                    headers: { Authorization: '3c2fbaf6-34f8-407e-9225-9337b70a1058' },
                    content_type: 'json',
                    event_types: [
                        'dispute_canceled',
                        'dispute_expired',
                        'dispute_lost',
                        'dispute_resolved',
                        'dispute_won',
                        'payment_capture_declined',
                        'payment_chargeback',
                        'payment_refund_declined',
                        'payment_refund_pending',
                        'payment_refunded',
                        'payment_retrieval',
                        'payment_void_declined',
                        'source_updated',
                    ],
                    _links: { self: [Object] },
                },
            ]);

        const cko = new Checkout(SK);

        const webhooks = await cko.webhooks.retrieveWebhooks();
        expect(webhooks[0].active).to.equal(true);
    });

    it('should throw AuthenticationError when trying to retrieve webhooks', async () => {
        nock('https://api.sandbox.checkout.com').get('/webhooks').reply(401);
        const cko = new Checkout(SK);

        try {
            const webhooks = await cko.webhooks.retrieveWebhooks();
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should retrieve all webhooks', async () => {
        nock('https://api.sandbox.checkout.com').get('/webhooks').reply(204, {});

        const cko = new Checkout('sk_test_da688e4d-0086-49a5-85dc-3ac6943adcb2');

        const webhooks = await cko.webhooks.retrieveWebhooks();
        expect(webhooks).to.eqls({});
    });

    it('should register webhook', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/webhooks')
            .reply(201, {
                id: 'wh_twptvjwln4zuzbxbd7v5xyh2kq',
                url: 'https://example.com/webhooks/dcc7f5d0-73ad-11ea-afeb-c586e9750ca7',
                active: true,
                headers: { authorization: '1234' },
                content_type: 'json',
                event_types: ['payment_approved', 'payment_captured'],
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/webhooks/wh_twptvjwln4zuzbxbd7v5xyh2kq',
                    },
                },
            });

        const cko = new Checkout('sk_test_da688e4d-0086-49a5-85dc-3ac6943adcb2');

        const url = `https://example.com/webhooks/${v1()}`;

        const webhook = await cko.webhooks.registerWebhook({
            url,
            active: true,
            headers: {
                authorization: '1234',
            },
            content_type: 'json',
            event_types: ['payment_approved', 'payment_captured'],
        });
        expect(webhook.url).to.contain('https://example.com/webhooks/');
    });

    it('should throw UrlAlreadyRegistered', async () => {
        nock('https://api.sandbox.checkout.com').post('/webhooks').reply(409);

        const cko = new Checkout(SK);

        try {
            const webhook = await cko.webhooks.registerWebhook({
                url: 'https://example.com/webhooks/test',
                active: true,
                headers: {
                    authorization: '1234',
                },
                content_type: 'json',
                event_types: ['payment_approved', 'payment_captured'],
            });
            expect(webhook.url).to.contain('https://example.com/webhooks/');
        } catch (err) {
            expect(err).to.be.instanceOf(UrlAlreadyRegistered);
        }
    });

    it('should retrive webhook', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/webhooks/wh_tdt72zlbe7cudogxdgit6nwk6i')
            .reply(200, {
                id: 'wh_tdt72zlbe7cudogxdgit6nwk6i',
                url: 'https://webhook.site/e09becba-a86d-46c5-8486-0d4b0c2dd93a',
                active: true,
                headers: { authorization: '0362c0ba-1f13-45ee-a165-2bd78cdc2520' },
                content_type: 'json',
                event_types: [
                    'dispute_canceled',
                    'dispute_evidence_required',
                    'dispute_expired',
                    'dispute_lost',
                    'dispute_resolved',
                    'dispute_won',
                    'payment_canceled',
                    'payment_capture_declined',
                    'payment_capture_pending',
                    'payment_chargeback',
                    'payment_expired',
                    'payment_paid',
                    'payment_pending',
                    'payment_refund_declined',
                    'payment_refund_pending',
                    'payment_refunded',
                    'payment_retrieval',
                    'payment_void_declined',
                    'payment_voided',
                    'source_updated',
                ],
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/webhooks/wh_tdt72zlbe7cudogxdgit6nwk6i',
                    },
                },
            });

        const cko = new Checkout(SK);

        const webhook = await cko.webhooks.retrieveWebhook('wh_tdt72zlbe7cudogxdgit6nwk6i');
        expect(webhook.url).to.equal('https://webhook.site/e09becba-a86d-46c5-8486-0d4b0c2dd93a');
    });

    it('should throw ValidationError', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/webhooks')
            .reply(422, {
                request_id: '0HLULE6FQN9M3:00000F03',
                error_type: 'request_invalid',
                error_codes: ['url_required'],
            });

        const cko = new Checkout(SK);

        try {
            const webhook = await cko.webhooks.registerWebhook({
                url: '',
                active: true,
                headers: {
                    authorization: '1234',
                },
                content_type: 'json',
                event_types: ['payment_approved', 'payment_captured'],
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });

    it('should throw NotFownd', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/webhooks/wh_tdt72zlbe7cudogxdgit6nw222')
            .reply(404);

        const cko = new Checkout(SK);

        try {
            const webhook = await cko.webhooks.retrieveWebhook('wh_tdt72zlbe7cudogxdgit6nw222');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should update webhook', async () => {
        nock('https://api.sandbox.checkout.com')
            .put('/webhooks/wh_ahun3lg7bf4e3lohbhni65335u')
            .reply(200, {
                id: 'wh_ahun3lg7bf4e3lohbhni65335u',
                url: 'https://example.com/webhooks/updated',
                active: true,
                headers: { authorization: '1234' },
                content_type: 'json',
                event_types: ['payment_approved', 'payment_captured'],
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/webhooks/wh_ahun3lg7bf4e3lohbhni65335u',
                    },
                },
            });

        const cko = new Checkout(SK);

        const webhook = await cko.webhooks.updateWebhook('wh_ahun3lg7bf4e3lohbhni65335u', {
            url: 'https://example.com/webhooks/updated',
            active: true,
            headers: {
                authorization: '1234',
            },
            content_type: 'json',
            event_types: ['payment_approved', 'payment_captured'],
        });
        expect(webhook.url).to.equal('https://example.com/webhooks/updated');
    });

    it('should throw AuthenticationError when trying to update webhook', async () => {
        nock('https://api.sandbox.checkout.com')
            .put('/webhooks/wh_ahun3lg7bf4e3lohbhni65335u')
            .reply(401);
        const cko = new Checkout(SK);

        try {
            const webhook = await cko.webhooks.updateWebhook('wh_ahun3lg7bf4e3lohbhni65335u', {
                url: 'https://example.com/webhooks/updated',
                active: true,
                headers: {
                    authorization: '1234',
                },
                content_type: 'json',
                event_types: ['payment_approved', 'payment_captured'],
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should partially update webhook', async () => {
        nock('https://api.sandbox.checkout.com')
            .patch('/webhooks/wh_ahun3lg7bf4e3lohbhni65335u')
            .reply(200, {
                id: 'wh_ahun3lg7bf4e3lohbhni65335u',
                url: 'https://example.com/webhooks/updated',
                active: true,
                headers: { authorization: '1234' },
                content_type: 'json',
                event_types: ['payment_approved', 'payment_captured'],
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/webhooks/wh_ahun3lg7bf4e3lohbhni65335u',
                    },
                },
            });

        const cko = new Checkout(SK);

        const webhook = await cko.webhooks.partiallyUpdateWebhook('wh_ahun3lg7bf4e3lohbhni65335u', {
            url: 'https://example.com/webhooks/updated',
        });
        expect(webhook.url).to.equal('https://example.com/webhooks/updated');
    });

    it('should throw AuthenticationError when trying to partially update webhook', async () => {
        nock('https://api.sandbox.checkout.com')
            .patch('/webhooks/wh_ahun3lg7bf4e3lohbhni65335u')
            .reply(401);
        const cko = new Checkout(SK);

        try {
            const webhook = await cko.webhooks.partiallyUpdateWebhook(
                'wh_ahun3lg7bf4e3lohbhni65335u',
                {
                    url: 'https://example.com/webhooks/updated',
                }
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should delete webhook', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/webhooks')
            .reply(200, {
                id: 'wh_ahun3lg7bf4e3lohbhni65335u',
                url: 'https://todelete.com/webhook',
                active: true,
                headers: { authorization: '1234' },
                content_type: 'json',
                event_types: ['payment_approved', 'payment_captured'],
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/webhooks/wh_ahun3lg7bf4e3lohbhni65335u',
                    },
                },
            });

        nock('https://api.sandbox.checkout.com')
            .delete((uri) => uri.includes('/webhooks/wh_'))
            .reply(200, {});

        const cko = new Checkout(SK);

        const webhookToDelete = await cko.webhooks.registerWebhook({
            url: 'https://todelete.com/webhook',
            active: true,
            headers: {
                authorization: '1234',
            },
            content_type: 'json',
            event_types: ['payment_approved', 'payment_captured'],
        });

        const webhook = await cko.webhooks.removeWebhook(webhookToDelete.id);
        expect(webhook).to.eqls({});
    });

    it('should throw AuthenticationError when trying to remove webhook', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/webhooks')
            .reply(200, {
                id: 'wh_ahun3lg7bf4e3lohbhni65335u',
                url: 'https://todelete.com/webhook',
                active: true,
                headers: { authorization: '1234' },
                content_type: 'json',
                event_types: ['payment_approved', 'payment_captured'],
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/webhooks/wh_ahun3lg7bf4e3lohbhni65335u',
                    },
                },
            });

        nock('https://api.sandbox.checkout.com')
            .delete((uri) => uri.includes('/webhooks/wh_'))
            .reply(401);
        const cko = new Checkout(SK);

        const webhookToDelete = await cko.webhooks.registerWebhook({
            url: 'https://todelete.com/webhook',
            active: true,
            headers: {
                authorization: '1234',
            },
            content_type: 'json',
            event_types: ['payment_approved', 'payment_captured'],
        });

        try {
            const webhook = await cko.webhooks.removeWebhook(webhookToDelete.id);
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
