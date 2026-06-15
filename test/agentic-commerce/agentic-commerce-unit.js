import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('AgenticCommerce', () => {
    afterEach(() => nock.cleanAll());

    it('createDelegatedPaymentToken posts to /agentic_commerce/delegate_payment', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/agentic_commerce/delegate_payment')
            .reply(201, { id: 'dpt_abc123' });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const res = await cko.agenticCommerce.createDelegatedPaymentToken({
            payment_method: { type: 'card', card_number_type: 'fpan', number: '4242424242424242', metadata: {} },
            allowance: {
                reason: 'one_time', max_amount: 1000, currency: 'GBP',
                merchant_id: 'mid_1', checkout_session_id: 'sess_1',
                expires_at: '2026-12-31T23:59:59Z',
            },
            risk_signals: [{ type: 'card_testing', score: 10, action: 'allow' }],
            metadata: { order_id: 'ord_1' },
        });

        expect(res.id).to.equal('dpt_abc123');
    });

    it('forwards an idempotency key when provided', async () => {
        let capturedHeader = null;
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/agentic_commerce/delegate_payment')
            .reply(function () {
                capturedHeader = this.req.headers['cko-idempotency-key'];
                return [201, { id: 'dpt_x' }];
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        await cko.agenticCommerce.createDelegatedPaymentToken({ metadata: {} }, 'idem-001');

        expect(capturedHeader).to.equal('idem-001');
    });
});
