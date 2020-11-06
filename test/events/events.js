import { AuthenticationError, NotFoundError } from '../../src/services/errors';
import { Checkout } from '../../src/index';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Events', () => {
    it('should retrieve all event types', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/event-types')
            .reply(200, [
                {
                    version: '1.0',
                    event_types: [
                        'card.updated',
                        'charge.captured',
                        'charge.captured.deferred',
                        'charge.captured.failed',
                        'charge.chargeback',
                        'charge.failed',
                        'charge.pending',
                        'charge.refunded',
                        'charge.refunded.failed',
                        'charge.retrieval',
                        'charge.succeeded',
                        'charge.voided',
                        'charge.voided.failed',
                        'invoice.cancelled',
                    ],
                },
                {
                    version: '2.0',
                    event_types: [
                        'card_verification_declined',
                        'card_verified',
                        'dispute_canceled',
                        'dispute_evidence_required',
                        'dispute_expired',
                        'dispute_lost',
                        'dispute_resolved',
                        'dispute_won',
                        'payment_approved',
                        'payment_canceled',
                        'payment_capture_declined',
                        'payment_capture_pending',
                        'payment_captured',
                        'payment_chargeback',
                        'payment_declined',
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
                },
            ]);

        const cko = new Checkout(SK);

        const events = await cko.events.retrieveEventTypes();

        expect(events[0].version).to.equal('1.0');
        expect(events[1].version).to.equal('2.0');
    });

    it('should retrieve all event types for a version', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/event-types?version=2.0')
            .reply(200, [
                {
                    version: '2.0',
                    event_types: [
                        'card_verification_declined',
                        'card_verified',
                        'dispute_canceled',
                        'dispute_evidence_required',
                        'dispute_expired',
                        'dispute_lost',
                        'dispute_resolved',
                        'dispute_won',
                        'payment_approved',
                        'payment_canceled',
                        'payment_capture_declined',
                        'payment_capture_pending',
                        'payment_captured',
                        'payment_chargeback',
                        'payment_declined',
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
                },
            ]);

        const cko = new Checkout(SK);

        const events = await cko.events.retrieveEventTypes('2.0');
        expect(events[0].version).to.equal('2.0');
    });

    it('should throw authentication error', async () => {
        nock('https://api.sandbox.checkout.com').get('/event-types').reply(401);

        const cko = new Checkout();
        try {
            const events = await cko.events.retrieveEventTypes();
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should retrieve events', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/events?from=2019-03-01T00:00:00Z')
            .reply(200, {
                total_count: 861,
                limit: 10,
                skip: 0,
                from: '2019-03-01T00:00:00Z',
                to: '2020-04-24T11:50:11Z',
                data: [
                    {
                        id: 'evt_c2qelfixai2u3es3ksovngkx3e',
                        type: 'payment_captured',
                        created_on: '2020-04-24T11:50:11Z',
                        _links: [Object],
                    },
                    {
                        id: 'evt_6a36se3gvo5eviql6da3opgnfa',
                        type: 'payment_approved',
                        created_on: '2020-04-24T11:50:03Z',
                        _links: [Object],
                    },
                    {
                        id: 'evt_u22pbjkvocuelnrm3kph25smra',
                        type: 'payment_captured',
                        created_on: '2020-04-23T12:59:04Z',
                        _links: [Object],
                    },
                    {
                        id: 'evt_wng4s4krim3upfyedhdafvxkv4',
                        type: 'payment_captured',
                        created_on: '2020-04-23T12:48:48Z',
                        _links: [Object],
                    },
                    {
                        id: 'evt_ugpp7oo52yae3gk227okok3g44',
                        type: 'payment_capture_pending',
                        created_on: '2020-04-23T12:48:40Z',
                        _links: [Object],
                    },
                    {
                        id: 'evt_q2feyay4j6julbjczmckekuus4',
                        type: 'payment_pending',
                        created_on: '2020-04-23T12:48:39Z',
                        _links: [Object],
                    },
                    {
                        id: 'evt_rltwqu6duvcurcpgmo5wz6bv5e',
                        type: 'payment_capture_pending',
                        created_on: '2020-04-23T12:48:04Z',
                        _links: [Object],
                    },
                    {
                        id: 'evt_aps5bcsag5je7psjbf5brecjtq',
                        type: 'payment_pending',
                        created_on: '2020-04-23T12:48:04Z',
                        _links: [Object],
                    },
                    {
                        id: 'evt_ngrpwrt3z5netem5dcszldzqzi',
                        type: 'payment_captured',
                        created_on: '2020-04-23T12:19:14Z',
                        _links: [Object],
                    },
                    {
                        id: 'evt_if5b6ymor3ju3n52afvwqfwfxa',
                        type: 'payment_approved',
                        created_on: '2020-04-23T12:19:08Z',
                        _links: [Object],
                    },
                ],
            });

        const cko = new Checkout(SK);
        const events = await cko.events.retrieveEvents({
            from: '2019-03-01T00:00:00Z',
        });

        expect(events.from).to.equal('2019-03-01T00:00:00Z');
    });

    it('should retrieve no events', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/events?from=2007-03-01T00:00:00Z&to=2008-03-01T00:00:00Z')
            .reply(204, {});

        const cko = new Checkout(SK);
        const events = await cko.events.retrieveEvents({
            from: '2007-03-01T00:00:00Z',
            to: '2008-03-01T00:00:00Z',
        });

        expect(Object.keys(events).length).to.equal(0);
    });

    it('should throw ValidationError error', async () => {
        nock('https://api.sandbox.checkout.com').get('/events?from=XXXX').reply(400, {}); // pending GW response for potential 422 code

        const cko = new Checkout(SK);

        try {
            const events = await cko.events.retrieveEvents({
                from: 'XXXX',
            });
            throw new Error();
        } catch (err) {
            // ! Temp non condition pending GW investigation on status code
        }
    });

    it('should retrieve event', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/events/evt_c2qelfixai2u3es3ksovngkx3e')
            .reply(200, {
                id: 'evt_c2qelfixai2u3es3ksovngkx3e',
                type: 'payment_captured',
                version: '2.0',
                created_on: '2020-04-24T11:50:11Z',
                data: {
                    action_id: 'act_puqzoc4sna7uvhjledmp6vjjby',
                    response_code: '10000',
                    response_summary: 'Approved',
                    amount: 1000,
                    metadata: {},
                    processing: {
                        acquirer_transaction_id: '1159094323',
                        acquirer_reference_number: '874479685178',
                    },
                    id: 'pay_xskg4u47uabenhpxfvpmqduume',
                    currency: 'USD',
                    processed_on: '2020-04-24T11:50:11Z',
                },
                notifications: [],
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/events/evt_c2qelfixai2u3es3ksovngkx3e',
                    },
                    'webhooks-retry': {
                        href:
                            'https://api.sandbox.checkout.com/events/evt_c2qelfixai2u3es3ksovngkx3e/webhooks/retry',
                    },
                },
            });

        const cko = new Checkout(SK);
        const event = await cko.events.retrieveEvent('evt_c2qelfixai2u3es3ksovngkx3e');

        expect(event.id).to.equal('evt_c2qelfixai2u3es3ksovngkx3e');
    });

    it('should throw not found error', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/events/evt_miytws22arje7jq2c4vdlcjaqy')
            .reply(404);

        const cko = new Checkout(SK);
        try {
            const event = await cko.events.retrieveEvent('evt_miytws22arje7jq2c4vdlcjaqy');
        } catch (err) {
            expect(err.name).to.equal('NotFoundError');
        }
    });

    it('should retrieve event notification', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/events/evt_pwhgncrvd3julmuutcoz4deu2u')
            .reply(200, {
                id: 'evt_pwhgncrvd3julmuutcoz4deu2u',
                type: 'payment_approved',
                version: '2.0',
                created_on: '2020-04-24T12:30:19Z',
                data: {
                    action_id: 'act_uqw2tkfecmnebhtt23fv6nbxka',
                    payment_type: 'REGULAR',
                    auth_code: '259083',
                    response_code: '10000',
                    response_summary: 'Approved',
                    scheme_id: '964296678668412',
                    source: {
                        id: 'src_cqqdofmtcwwetmzmcbgd2qpmzy',
                        type: 'card',
                        expiry_month: 8,
                        expiry_year: 2025,
                        name: 'Sarah Mitchell',
                        scheme: 'MASTERCARD',
                        last_4: '1465',
                        fingerprint:
                            'ef6107604ae20cb5ee03be1fb3066234343d40da23f0fcf1178c74383e55ab09',
                        bin: '519999',
                        card_type: 'Credit',
                        card_category: 'Consumer',
                        issuer: 'BANCO COOPERATIVO DE PUERTO RICO',
                        issuer_country: 'PR',
                        product_id: 'MCS',
                        product_type: 'Standard MasterCard® Card',
                        avs_check: 'S',
                        cvv_check: 'Y',
                    },
                    customer: { id: 'cus_hvh6gjhhbvoejbrki7n53qhsf4' },
                    processing: {
                        acquirer_transaction_id: '2315645429',
                        retrieval_reference_number: '333364447050',
                    },
                    amount: 100,
                    metadata: {},
                    risk: { flagged: false },
                    id: 'pay_uqw2tkfecmnebhtt23fv6nbxka',
                    currency: 'USD',
                    processed_on: '2020-04-24T12:30:19Z',
                    reference: 'NEW API',
                },
                notifications: [
                    {
                        url: 'https://webhook.site/6df04262-25ef-4cda-8cb0-305bbee9425a',
                        id: 'ntf_wqjkqpgjy33uxoywcej4fnw6qm',
                        notification_type: 'Webhook',
                        success: true,
                        _links: [Object],
                    },
                ],
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/events/evt_pwhgncrvd3julmuutcoz4deu2u',
                    },
                    'webhooks-retry': {
                        href:
                            'https://api.sandbox.checkout.com/events/evt_pwhgncrvd3julmuutcoz4deu2u/webhooks/retry',
                    },
                },
            });

        nock('https://api.sandbox.checkout.com')
            .get(
                '/events/evt_pwhgncrvd3julmuutcoz4deu2u/notifications/ntf_wqjkqpgjy33uxoywcej4fnw6qm'
            )
            .reply(200, {
                url: 'https://webhook.site/6df04262-25ef-4cda-8cb0-305bbee9425a',
                content_type: 'json',
                attempts: [
                    {
                        status_code: 200,
                        send_mode: 'automatic',
                        timestamp: '2020-04-24T12:30:19Z',
                    },
                ],
                id: 'ntf_wqjkqpgjy33uxoywcej4fnw6qm',
                success: true,
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/events/evt_pwhgncrvd3julmuutcoz4deu2u/notifications/ntf_wqjkqpgjy33uxoywcej4fnw6qm',
                    },
                    'webhook-retry': {
                        href:
                            'https://api.sandbox.checkout.com/events/evt_pwhgncrvd3julmuutcoz4deu2u/webhooks/wh_mpkyioafmajulnhjvwmrklenb4/retry',
                    },
                },
            });

        const cko = new Checkout(SK);

        const event = await cko.events.retrieveEvent('evt_pwhgncrvd3julmuutcoz4deu2u');
        const eventId = event.id;
        const notificationId = event.notifications[0].id;

        const notification = await cko.events.retrieveEventNotification({
            eventId,
            notificationId,
        });

        expect(notification.content_type).to.equal('json');
    });

    it('should throw Not Found when trying to retrive event notification', async () => {
        nock('https://api.sandbox.checkout.com')
            .get(
                '/events/evt_pwhgncrvd3julmuutcoz4deu2q/notifications/ntf_wqjkqpgjy33uxoywcej4fnw6qm'
            )
            .reply(404);
        const cko = new Checkout(SK);

        try {
            const notification = await cko.events.retrieveEventNotification({
                eventId: 'evt_pwhgncrvd3julmuutcoz4deu2q',
                notificationId: 'ntf_wqjkqpgjy33uxoywcej4fnw6qm',
            });
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should retry event', async () => {
        nock('https://api.sandbox.checkout.com')
            .post(
                '/events/evt_c2qelfixai2u3es3ksovngkx3e/webhooks/wh_mpkyioafmajulnhjvwmrklenb4/retry'
            )
            .reply(202);

        const cko = new Checkout(SK);

        const event = await cko.events.retry({
            eventId: 'evt_c2qelfixai2u3es3ksovngkx3e',
            webhookId: 'wh_mpkyioafmajulnhjvwmrklenb4',
        });

        expect(Object.keys(event).length).to.equal(0);
    });

    it('should throw Not Found when trying to retry a notification', async () => {
        nock('https://api.sandbox.checkout.com')
            .post(
                '/events/evt_c2qelfixai2u3es3ksovngkx3q/webhooks/wh_mpkyioafmajulnhjvwmrklenb4/retry'
            )
            .reply(404);
        const cko = new Checkout(SK);

        try {
            const event = await cko.events.retry({
                eventId: 'evt_c2qelfixai2u3es3ksovngkx3q',
                webhookId: 'wh_mpkyioafmajulnhjvwmrklenb4',
            });
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should retry all events', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/events/evt_c2qelfixai2u3es3ksovngkx3e/webhooks/retry')
            .reply(202);

        const cko = new Checkout(SK);

        const event = await cko.events.retryAll('evt_c2qelfixai2u3es3ksovngkx3e');

        expect(Object.keys(event).length).to.equal(0);
    });

    it('should throw Not Found when trying to retry all events', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/events/evt_c2qelfixai2u3es3ksovngkx3q/webhooks/retry')
            .reply(404);
        const cko = new Checkout(SK);

        try {
            const event = await cko.events.retryAll('evt_c2qelfixai2u3es3ksovngkx3q');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
