import { expect } from 'chai';
import Checkout from '../../src/Checkout.js';

const cko = new Checkout(process.env.CHECKOUT_DEFAULT_SECRET_KEY, {
    pk: process.env.CHECKOUT_DEFAULT_PUBLIC_KEY,
    environment: 'sandbox',
    subdomain: process.env.CHECKOUT_MERCHANT_SUBDOMAIN,
});

describe.skip('Integration::AgenticCommerce', () => {
    it('should create a delegated payment token (Beta — requires Agentic Commerce feature)', async () => {
        const res = await cko.agenticCommerce.createDelegatedPaymentToken({
            payment_method: {
                type: 'card',
                card_number_type: 'fpan',
                number: '4242424242424242',
                exp_month: '12',
                exp_year: '2030',
                name: 'Integration Test',
                metadata: { merchant_reference: 'IT-AC-001' },
            },
            allowance: {
                reason: 'one_time',
                max_amount: 1000,
                currency: 'GBP',
                merchant_id: process.env.CHECKOUT_AC_MERCHANT_ID,
                checkout_session_id: process.env.CHECKOUT_AC_SESSION_ID,
                expires_at: '2026-12-31T23:59:59Z',
            },
            billing_address: {
                name: 'Integration Test',
                line_one: '1 Test Street',
                city: 'London',
                postal_code: 'SW1A 1AA',
                country: 'GB',
            },
            risk_signals: [{ type: 'card_testing', score: 10, action: 'allow' }],
            metadata: { order_id: 'IT-AC-001' },
        });
        expect(res).to.exist;
    });
});
