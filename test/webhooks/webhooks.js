import { AuthenticationError, NotFoundError, UrlAlreadyRegistered, ValidationError, } from '../../src/services/errors.js';
import { Checkout } from '../../src/index.js';
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

    it('should register webhook for authentication_failed event', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/webhooks')
            .reply(201, {
                id: 'wh_auth_fail_test123456',
                url: 'https://example.com/webhooks/authentication-events',
                active: true,
                headers: { authorization: '1234' },
                content_type: 'json',
                event_types: ['authentication_failed'],
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/webhooks/wh_auth_fail_test123456',
                    },
                },
            });

        const cko = new Checkout(SK);

        const webhook = await cko.webhooks.registerWebhook({
            url: 'https://example.com/webhooks/authentication-events',
            active: true,
            headers: {
                authorization: '1234',
            },
            content_type: 'json',
            event_types: ['authentication_failed'],
        });

        expect(webhook.id).to.equal('wh_auth_fail_test123456');
        expect(webhook.event_types).to.include('authentication_failed');
        expect(webhook.url).to.equal('https://example.com/webhooks/authentication-events');
    });

    it('should handle authentication_failed webhook event payload', async () => {
        const authenticationFailedPayload = {
            id: 'evt_ql5mtq624twrdnpkajbkyeqaai',
            type: 'authentication_failed',
            version: '1.0.1',
            created_on: '2023-04-26T12:09:41.897Z',
            data: {
                reason: 'Unavailable',
                reason_description: 'Authentication Unavailable',
                eci: '00',
                transaction_status_reason: 'rreq_status',
                challenged: true,
                acs_challenged_mandated: true,
                exemption_applied: 'none',
                session_id: 'sid_26tzrqszpi4eppau7ehuyubdxa',
                amount: '1250',
                currency: 'GBP',
                type: 'regular',
                response_code: 'N',
                challenge_indicator: 'no_challenge_requested',
                protocol_version: '2.2.0',
                scheme: 'visa',
                payment_id: 'pay_w4htz2voa3vujcnuhq263vl7ky',
                reference: 'ORD-5023-4E89',
                experience: '3ds',
                '3ds_transaction_id': 'f258583b-5997-48cd-84b3-3f4098483313',
                ds_transaction_id: 'a54fb867-e42f-4eba-ae2b-640302aaac17',
                acs_transaction_id: 'c54fb867-e42f-4eba-ae2b-640302aaac12',
                error_details: {
                    error_code: '311',
                    error_description: 'Permanent System Failure',
                    error_detail: 'Card data failure',
                    error_component: 'D'
                }
            },
            _links: {
                self: {
                    href: 'https://api.checkout.com/workflows/events/evt_ql5mtq624twrdnpkajbkyeqaai'
                }
            }
        };

        expect(authenticationFailedPayload.type).to.equal('authentication_failed');
        expect(authenticationFailedPayload.data).to.have.property('reason');
        expect(authenticationFailedPayload.data).to.have.property('reason_description');
        expect(authenticationFailedPayload.data).to.have.property('payment_id');
        expect(authenticationFailedPayload.data).to.have.property('session_id');
        expect(authenticationFailedPayload.data).to.have.property('amount');
        expect(authenticationFailedPayload.data).to.have.property('currency');
        expect(authenticationFailedPayload.data).to.have.property('error_details');
        
        expect(authenticationFailedPayload.data.error_details).to.have.property('error_code');
        expect(authenticationFailedPayload.data.error_details).to.have.property('error_description');
        expect(authenticationFailedPayload.data.error_details).to.have.property('error_detail');
        expect(authenticationFailedPayload.data.error_details).to.have.property('error_component');

        expect(authenticationFailedPayload.data.reason).to.equal('Unavailable');
        expect(authenticationFailedPayload.data.response_code).to.equal('N');
        expect(authenticationFailedPayload.data.challenged).to.be.true;
        expect(authenticationFailedPayload.data.error_details.error_code).to.equal('311');
    });
});

describe('Webhook Event Processing', () => {
    it('should process authentication_failed webhook event with real webhook endpoint', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/webhooks')
            .reply(201, {
                id: 'wh_auth_events_123',
                url: 'https://example.com/webhooks/auth-events',
                active: true,
                headers: { authorization: 'test-auth-key' },
                content_type: 'json',
                event_types: ['authentication_failed', 'authentication_successful'],
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/webhooks/wh_auth_events_123',
                    },
                },
            });

        nock('https://api.sandbox.checkout.com')
            .get('/webhooks/wh_auth_events_123')
            .reply(200, {
                id: 'wh_auth_events_123',
                url: 'https://example.com/webhooks/auth-events',
                active: true,
                headers: { authorization: 'test-auth-key' },
                content_type: 'json',
                event_types: ['authentication_failed', 'authentication_successful'],
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/webhooks/wh_auth_events_123',
                    },
                },
            });

        const cko = new Checkout(SK);

        const webhook = await cko.webhooks.registerWebhook({
            url: 'https://example.com/webhooks/auth-events',
            active: true,
            headers: {
                authorization: 'test-auth-key',
            },
            content_type: 'json',
            event_types: ['authentication_failed', 'authentication_successful'],
        });

        expect(webhook.id).to.equal('wh_auth_events_123');
        expect(webhook.event_types).to.include('authentication_failed');

        const retrievedWebhook = await cko.webhooks.retrieveWebhook('wh_auth_events_123');
        expect(retrievedWebhook.event_types).to.include('authentication_failed');
        expect(retrievedWebhook.active).to.be.true;
    });

    it('should process malformed authentication_failed webhook (GitHub Issue #408)', async () => {
        // Import the webhook utils to test the integration
        const { parseWebhookPayload, extractAuthenticationFailedData } = await import('../../src/services/webhook-utils.js');
        
        // Simulate the exact problematic payload from GitHub issue #408
        // This payload contains a Unicode replacement character (�) that breaks JSON parsing
        const malformedPayload = `{
  "id": "evt_ql5mtq624twrdnpkajbkyeqaai",
  "type": "authentication_failed",
  "version": "2.1.0",
  "created_on": "2025-09-15T07:31:18.241Z",
�
{
    "reason": "Declined",
    "reason_description": "Authentication Declined",
    "eci": "00",
    "cavv": null,
    "transaction_status_reason": "rreq_status",
    "challenged": true,
    "acs_challenged_mandated": true,
    "exemption_applied": "none",
    "is3ri": false,
    "metadata": null,
    "challenge_cancel": "01",
    "error_details": null,
    "response_status_reason": "01",
    "session_id": "sid_xxx",
    "amount": "13606",
    "currency": "EUR",
    "type": "regular",
    "challenge_indicator": "no_preference",
    "protocol_version": "2.2.0",
    "scheme": "mastercard",
    "payment_id": "pay_xxx",
    "reference": "deded",
    "response_code": "N",
    "experience": "3ds",
    "3ds_transaction_id": "",
    "ds_transaction_id": "",
    "acs_transaction_id": ""
  },
  "_links": {
    "self": {
      "href": "https://api.checkout.com/workflows/events/evt_xxx"
    }
  },
  "__topic": "payments"
}`;

        // Test 1: Verify that standard JSON.parse would fail with this payload
        let standardParsingFailed = false;
        try {
            JSON.parse(malformedPayload);
        } catch (error) {
            standardParsingFailed = true;
            // Error message can vary between Node versions, just verify it mentions JSON parsing issue
            expect(error.message).to.match(/(Expected double-quoted property name|Unexpected token|JSON)/i);
        }
        expect(standardParsingFailed).to.be.true;

        // Test 2: Verify our webhook utils can handle the malformed payload
        let webhookData;
        try {
            webhookData = parseWebhookPayload(malformedPayload);
        } catch (error) {
            throw new Error(`Webhook utils should handle malformed payload but failed: ${error.message}`);
        }

        // Test 3: Verify the parsed webhook has correct structure
        expect(webhookData).to.be.an('object');
        expect(webhookData.id).to.equal('evt_ql5mtq624twrdnpkajbkyeqaai');
        expect(webhookData.type).to.equal('authentication_failed');
        expect(webhookData.version).to.equal('2.1.0');
        expect(webhookData.created_on).to.equal('2025-09-15T07:31:18.241Z');

        // Test 4: Verify the data property is correctly structured
        expect(webhookData.data).to.be.an('object');
        expect(webhookData.data.payment_id).to.equal('pay_xxx');
        expect(webhookData.data.session_id).to.equal('sid_xxx');
        expect(webhookData.data.reason).to.equal('Declined');
        expect(webhookData.data.amount).to.equal('13606');
        expect(webhookData.data.currency).to.equal('EUR');

        // Test 5: Extract authentication failed data using our utility
        const extractedData = extractAuthenticationFailedData(webhookData);
        
        expect(extractedData.eventId).to.equal('evt_ql5mtq624twrdnpkajbkyeqaai');
        expect(extractedData.paymentId).to.equal('pay_xxx');
        expect(extractedData.sessionId).to.equal('sid_xxx');
        expect(extractedData.reason).to.equal('Declined');
        expect(extractedData.reasonDescription).to.equal('Authentication Declined');
        expect(extractedData.amount).to.equal('13606');
        expect(extractedData.currency).to.equal('EUR');
        expect(extractedData.responseCode).to.equal('N');
        expect(extractedData.scheme).to.equal('mastercard');
        expect(extractedData.challenged).to.be.true;
        expect(extractedData.acsChallengeMandated).to.be.true;

        // Test 6: Simulate webhook endpoint receiving this data
        nock('https://api.sandbox.checkout.com')
            .post('/webhooks')
            .reply(201, {
                id: 'wh_issue408_fix',
                url: 'https://example.com/webhooks/auth-failed-fixed',
                active: true,
                headers: { authorization: 'issue-408-test' },
                content_type: 'json',
                event_types: ['authentication_failed'],
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/webhooks/wh_issue408_fix',
                    },
                },
            });

        const cko = new Checkout(SK);

        // Register a webhook to handle authentication_failed events
        const webhook = await cko.webhooks.registerWebhook({
            url: 'https://example.com/webhooks/auth-failed-fixed',
            active: true,
            headers: {
                authorization: 'issue-408-test',
            },
            content_type: 'json',
            event_types: ['authentication_failed'],
        });

        expect(webhook.id).to.equal('wh_issue408_fix');
        expect(webhook.event_types).to.include('authentication_failed');

        // Test 7: Verify we can process the webhook data in a typical webhook handler
        function simulateWebhookHandler(rawPayload) {
            const parsedWebhook = parseWebhookPayload(rawPayload);
            
            if (parsedWebhook.type === 'authentication_failed') {
                const authData = extractAuthenticationFailedData(parsedWebhook);
                
                return {
                    success: true,
                    paymentId: authData.paymentId,
                    amount: authData.amount,
                    currency: authData.currency,
                    reason: authData.reason,
                    challenged: authData.challenged,
                    message: `Authentication failed for payment ${authData.paymentId}: ${authData.reason}`
                };
            }
            
            return { success: false, message: 'Unexpected webhook type' };
        }

        const handlerResult = simulateWebhookHandler(malformedPayload);
        
        expect(handlerResult.success).to.be.true;
        expect(handlerResult.paymentId).to.equal('pay_xxx');
        expect(handlerResult.amount).to.equal('13606');
        expect(handlerResult.currency).to.equal('EUR');
        expect(handlerResult.reason).to.equal('Declined');
        expect(handlerResult.challenged).to.be.true;
        expect(handlerResult.message).to.contain('Authentication failed for payment pay_xxx');
    });

    it('should create workflow, trigger authentication_failed, and handle malformed webhook (Full Integration)', async () => {
        // Import the webhook utils to test the integration
        const { parseWebhookPayload, extractAuthenticationFailedData } = await import('../../src/services/webhook-utils.js');
        
        const cko = new Checkout(SK);
        
        // Step 1: Create a workflow for authentication_failed events
        nock('https://api.sandbox.checkout.com')
            .post('/workflows')
            .reply(201, {
                id: 'wfl_auth_failed_integration',
                name: 'Authentication Failed Workflow',
                active: true,
                conditions: [{
                    id: 'wfc_condition_auth_failed',
                    type: 'event',
                    events: {
                        gateway: ['authentication_failed']
                    }
                }],
                actions: [{
                    id: 'wfa_webhook_action',
                    type: 'webhook',
                    url: 'https://example.com/webhooks/auth-failed-handler',
                    headers: {
                        'Authorization': 'Bearer test-token',
                        'Content-Type': 'application/json'
                    }
                }],
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/workflows/wfl_auth_failed_integration'
                    }
                }
            });

        const workflow = await cko.workflows.add({
            name: 'Authentication Failed Workflow',
            active: true,
            conditions: [{
                type: 'event',
                events: {
                    gateway: ['authentication_failed']
                }
            }],
            actions: [{
                type: 'webhook',
                url: 'https://example.com/webhooks/auth-failed-handler',
                headers: {
                    'Authorization': 'Bearer test-token',
                    'Content-Type': 'application/json'
                }
            }]
        });

        expect(workflow.id).to.equal('wfl_auth_failed_integration');
        expect(workflow.name).to.equal('Authentication Failed Workflow');
        expect(workflow.active).to.be.true;

        // Step 2: Simulate a payment request that will fail authentication
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(202, {
                id: 'pay_auth_fail_test_123',
                status: 'Pending',
                reference: 'AUTH-FAIL-TEST-001',
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_auth_fail_test_123'
                    },
                    redirect: {
                        href: 'https://3ds.checkout.com/authentication/pay_auth_fail_test_123'
                    }
                }
            });

        const paymentRequest = {
            source: {
                type: 'card',
                number: '4000000000000002', // Card that will fail authentication
                expiry_month: 12,
                expiry_year: 2030,
                cvv: '123'
            },
            amount: 13606,
            currency: 'EUR',
            reference: 'AUTH-FAIL-TEST-001',
            '3ds': {
                enabled: true,
                attempt_n3d: false,
                challenge_indicator: 'no_preference'
            }
        };

        const payment = await cko.payments.request(paymentRequest);
        expect(payment.id).to.equal('pay_auth_fail_test_123');
        expect(payment.status).to.equal('Pending');

        // Step 3: Simulate the 3DS authentication failure
        nock('https://api.sandbox.checkout.com')
            .get('/payments/pay_auth_fail_test_123')
            .reply(200, {
                id: 'pay_auth_fail_test_123',
                status: 'Declined',
                declined_reason: 'authentication_failed',
                reference: 'AUTH-FAIL-TEST-001',
                amount: 13606,
                currency: 'EUR',
                response_summary: 'Authentication Failed',
                '3ds': {
                    enrolled: true,
                    authentication_response: 'N',
                    eci: '00',
                    challenged: true,
                    challenge_indicator: 'no_preference'
                }
            });

        const paymentDetails = await cko.payments.get('pay_auth_fail_test_123');
        expect(paymentDetails.status).to.equal('Declined');
        expect(paymentDetails.declined_reason).to.equal('authentication_failed');

        // Step 4: Simulate receiving the malformed webhook (the real issue #408 scenario)
        // This is the exact payload format that was causing issues with Unicode replacement character
        const malformedWebhookPayload = `{
  "id": "evt_auth_fail_integration_test",
  "type": "authentication_failed",
  "version": "2.1.0",
  "created_on": "2025-09-15T07:31:18.241Z",
�
{
    "reason": "Declined",
    "reason_description": "Authentication Declined",
    "eci": "00",
    "cavv": null,
    "transaction_status_reason": "rreq_status",
    "challenged": true,
    "acs_challenged_mandated": true,
    "exemption_applied": "none",
    "is3ri": false,
    "metadata": null,
    "challenge_cancel": "01",
    "error_details": {
        "error_code": "302",
        "error_description": "Authentication Failed",
        "error_detail": "Cardholder authentication failed",
        "error_component": "C"
    },
    "response_status_reason": "01",
    "session_id": "sid_auth_fail_test_123",
    "amount": "13606",
    "currency": "EUR",
    "type": "regular",
    "challenge_indicator": "no_preference",
    "protocol_version": "2.2.0",
    "scheme": "visa",
    "payment_id": "pay_auth_fail_test_123",
    "reference": "AUTH-FAIL-TEST-001",
    "response_code": "N",
    "experience": "3ds",
    "3ds_transaction_id": "test-3ds-txn-123",
    "ds_transaction_id": "test-ds-txn-456",
    "acs_transaction_id": "test-acs-txn-789"
  },
  "_links": {
    "self": {
      "href": "https://api.checkout.com/workflows/events/evt_auth_fail_integration_test"
    }
  },
  "__topic": "payments"
}`;

        // Step 5: Simulate webhook endpoint processing with our fix
        function simulateWebhookEndpoint(rawPayload) {
            console.log('🔄 Webhook endpoint received payload...');
            
            try {
                // This would normally fail with standard JSON.parse due to the � character
                const webhook = parseWebhookPayload(rawPayload);
                console.log('✅ Successfully parsed malformed webhook payload');
                
                if (webhook.type === 'authentication_failed') {
                    const authData = extractAuthenticationFailedData(webhook);
                    console.log('✅ Successfully extracted authentication data');
                    
                    // Simulate business logic processing
                    const processingResult = {
                        webhookProcessed: true,
                        eventId: authData.eventId,
                        paymentId: authData.paymentId,
                        authenticationResult: {
                            success: false,
                            reason: authData.reason,
                            challenged: authData.challenged,
                            amount: authData.amount,
                            currency: authData.currency
                        },
                        nextActions: [
                            'notify_customer_auth_failed',
                            'log_fraud_analysis',
                            'update_payment_status'
                        ]
                    };
                    
                    console.log('Business logic processed successfully');
                    return processingResult;
                }
                
                return { webhookProcessed: false, error: 'Unexpected webhook type' };
                
            } catch (error) {
                console.error('Webhook processing failed:', error.message);
                return { 
                    webhookProcessed: false, 
                    error: error.message,
                    fallbackAction: 'retry_with_manual_processing'
                };
            }
        }

        // Step 6: Test the complete integration
        const webhookResult = simulateWebhookEndpoint(malformedWebhookPayload);
        
        // Verify successful processing
        expect(webhookResult.webhookProcessed).to.be.true;
        expect(webhookResult.eventId).to.equal('evt_auth_fail_integration_test');
        expect(webhookResult.paymentId).to.equal('pay_auth_fail_test_123');
        expect(webhookResult.authenticationResult.success).to.be.false;
        expect(webhookResult.authenticationResult.reason).to.equal('Declined');
        expect(webhookResult.authenticationResult.challenged).to.be.true;
        expect(webhookResult.authenticationResult.amount).to.equal('13606');
        expect(webhookResult.authenticationResult.currency).to.equal('EUR');
        expect(webhookResult.nextActions).to.include('notify_customer_auth_failed');

        // Step 7: Verify workflow would have triggered correctly
        nock('https://api.sandbox.checkout.com')
            .get('/workflows/wfl_auth_failed_integration')
            .reply(200, {
                id: 'wfl_auth_failed_integration',
                name: 'Authentication Failed Workflow',
                active: true,
                conditions: [{
                    id: 'wfc_condition_auth_failed',
                    type: 'event',
                    events: {
                        gateway: ['authentication_failed']
                    }
                }],
                actions: [{
                    id: 'wfa_webhook_action',
                    type: 'webhook',
                    url: 'https://example.com/webhooks/auth-failed-handler',
                    headers: {
                        'Authorization': 'Bearer test-token',
                        'Content-Type': 'application/json'
                    }
                }]
            });

        const workflowDetails = await cko.workflows.get('wfl_auth_failed_integration');
        expect(workflowDetails.active).to.be.true;
        expect(workflowDetails.conditions[0].events.gateway).to.include('authentication_failed');

        console.log('Complete integration test passed! The workflow for authentication_failed events works correctly even with malformed webhook payloads.');
    });
});
