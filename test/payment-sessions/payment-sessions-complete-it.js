import { expect } from 'chai';
import nock from 'nock';
import Checkout from '../../src/Checkout.js';
import { ValueError } from '../../src/services/errors.js';
import { commonRequest } from './payment-sessions-common.js';

afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

const cko = new Checkout(process.env.CHECKOUT_DEFAULT_SECRET_KEY, {
    subdomain: process.env.CHECKOUT_MERCHANT_SUBDOMAIN,
});

describe('Integration::Payment-Sessions::Complete', () => {
    it.skip('should complete a payment session', async () => {
        const paymentResponse = await cko.paymentSessions.complete({
            amount: 1000,
            currency: 'GBP',
            reference: 'ORD-123A',
            billing: {
                address: {
                    country: 'GB',
                },
            },
            customer: {
                name: 'John Smith',
                email: 'john.smith@example.com',
            },
            success_url: 'https://example.com/payments/success',
            failure_url: 'https://example.com/payments/failure',
            payment_method: {
                type: 'card',
                number: '4242424242424242',
                expiry_month: 12,
                expiry_year: 2025,
                cvv: '100',
            },
        });

        expect(paymentResponse).to.not.be.null;
        expect(paymentResponse.id).to.not.be.null;
        expect(paymentResponse.status).to.not.be.null;
    });

    it('should throw ValueError when completing with invalid data', async () => {
        try {
            await cko.paymentSessions.complete({
                amount: -100,
                currency: 'INVALID',
            });
            expect.fail('Should have thrown ValueError');
        } catch (err) {
            expect(err).to.be.instanceOf(ValueError);
        }
    });
});
