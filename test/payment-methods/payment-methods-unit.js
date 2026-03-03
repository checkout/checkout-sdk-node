import { AuthenticationError } from '../../src/services/errors.js';
import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';

describe('Payment Methods', () => {
    it('should get payment methods', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/payment-methods')
            .query({ processing_channel_id: 'pc_q4dbxom5jbgudnjzjpz7j2z6uq' })
            .reply(200, {
                methods: [
                    {
                        type: 'card',
                        enabled: true,
                    },
                    {
                        type: 'klarna',
                        enabled: true,
                    },
                ],
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });

        const paymentMethods = await cko.paymentMethods.getPaymentMethods(
            'pc_q4dbxom5jbgudnjzjpz7j2z6uq'
        );

        expect(paymentMethods.methods).to.be.an('array');
        expect(paymentMethods.methods.length).to.be.greaterThan(0);
    });

    it('should throw auth error getting payment methods', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/payment-methods')
            .query({ processing_channel_id: 'pc_q4dbxom5jbgudnjzjpz7j2z6uq' })
            .reply(401);

        try {
            const cko = new Checkout(SK, { subdomain: '123456789' });
            await cko.paymentMethods.getPaymentMethods('pc_q4dbxom5jbgudnjzjpz7j2z6uq');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
