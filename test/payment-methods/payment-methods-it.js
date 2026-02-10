import { expect } from 'chai';
import nock from 'nock';
import Checkout from '../../src/Checkout.js';
import { AuthenticationError, NotFoundError, ValidationError } from '../../src/services/errors.js';

afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

const cko = new Checkout(process.env.CHECKOUT_DEFAULT_SECRET_KEY);

describe('Integration::PaymentMethods', () => {
    it.skip('should get payment methods for a processing channel', async () => {
        const paymentMethods = await cko.paymentMethods.getPaymentMethods(
            'pc_q4dbxom5jbgudnjzjpz7j2z6uq'
        );

        expect(paymentMethods.methods).to.be.an('array');
        expect(paymentMethods.methods.length).to.be.greaterThan(0);
        paymentMethods.methods.forEach((method) => {
            expect(method).to.have.property('type');
            expect(method).to.have.property('enabled');
        });
    });

    it('should throw error when getting payment methods with invalid processing channel', async () => {
        try {
            await cko.paymentMethods.getPaymentMethods('pc_invalid_channel_id');
            expect.fail('Should have thrown an error');
        } catch (err) {
            expect(err).to.exist;
        }
    });
});
