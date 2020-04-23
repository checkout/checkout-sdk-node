import {
    BadGateway,
    TooManyRequestsError,
    ValidationError,
    ValueError,
    AuthenticationError,
    NotFoundError,
    ActionNotAllowed
} from '../../src/services/errors';
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
                        'invoice.cancelled'
                    ]
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
                        'source_updated'
                    ]
                }
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
                        'source_updated'
                    ]
                }
            ]);

        const cko = new Checkout(SK);

        const events = await cko.events.retrieveEventTypes('2.0');
        expect(events[0].version).to.equal('2.0');
    });

    it('should throw authentication error', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/event-types')
            .reply(401);

        const cko = new Checkout();
        try {
            const events = await cko.events.retrieveEventTypes();
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
