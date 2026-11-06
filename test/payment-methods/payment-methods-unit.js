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

// Query values are percent-encoded by the SDK.
describe('Payment methods - query values', () => {
    let capturedUrl;

    beforeEach(() => {
        capturedUrl = undefined;
        nock('https://123456789.api.sandbox.checkout.com')
            .get(/.*/)
            .reply(function (uri) {
                capturedUrl = uri;
                return [200, {}];
            });
    });

    afterEach(() => nock.cleanAll());

    [
        ['sends a plain value unchanged', 'ORD-123', 'ORD-123'],
        ['encodes & and =', 'a&b=c', 'a%26b%3Dc'],
        ['encodes #', 'INV#42', 'INV%2342'],
    ].forEach(([title, value, encoded]) => {
        it(`getPaymentMethods ${title}`, async () => {
            const cko = new Checkout(SK, { subdomain: '123456789' });
            await cko.paymentMethods.getPaymentMethods(value);
            expect(capturedUrl).to.equal(`/payment-methods?processing_channel_id=${encoded}`);
        });
    });
});
