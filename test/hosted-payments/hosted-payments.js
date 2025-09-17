import { AuthenticationError, } from '../../src/services/errors.js';
import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Hosted Payments', () => {
    it('should create a hosted payment link', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/hosted-payments')
            .reply(201, {
                reference: 'ORD-5023-4E89',
                _links: {
                    redirect: {
                        href: 'https://pay.checkout.com/page/d6a471b9430f13b1035072f9ce45a8ce:9e5de0d41e9748cf6bc91e650f2c823845997bc52be6108969b47eedffcd06c57e034af5d3090b6c137a0c5de665e68458db94c95b89e2acf326d1996d71f3e2cb52fbfdcadf505af7f4078ff6135d1ebf20b02543dc78b883a313605684b7544d3a14146961c3c7b7e47145971d2388d62553eacce2176b9604484023db1017',
                    },
                },
            });

        const cko = new Checkout(SK);

        const hostedResponse = await cko.hostedPayments.create({
            amount: 10,
            currency: 'USD',
            billing: {
                address: {
                    address_line1: 'Checkout.com',
                    address_line2: '90 Tottenham Court Road',
                    city: 'London',
                    state: 'London',
                    zip: 'W1T 4TJ',
                    country: 'GB',
                },
            },
            success_url: 'https://example.com/success',
            cancel_url: 'https://example.com/cancel',
            failure_url: 'https://example.com/failure',
        });

        expect(hostedResponse._links.redirect.href).to.equal(
            'https://pay.checkout.com/page/d6a471b9430f13b1035072f9ce45a8ce:9e5de0d41e9748cf6bc91e650f2c823845997bc52be6108969b47eedffcd06c57e034af5d3090b6c137a0c5de665e68458db94c95b89e2acf326d1996d71f3e2cb52fbfdcadf505af7f4078ff6135d1ebf20b02543dc78b883a313605684b7544d3a14146961c3c7b7e47145971d2388d62553eacce2176b9604484023db1017'
        );
    });

    it('should throw Authentication Error', async () => {
        nock('https://api.sandbox.checkout.com').post('/hosted-payments').reply(401);

        try {
            const cko = new Checkout('sk_');

            const hostedResponse = await cko.hostedPayments.create({
                amount: 10,
                currency: 'USD',
                billing: {
                    address: {
                        address_line1: 'Checkout.com',
                        address_line2: '90 Tottenham Court Road',
                        city: 'London',
                        state: 'London',
                        zip: 'W1T 4TJ',
                        country: 'GB',
                    },
                },
                success_url: 'https://example.com/success',
                cancel_url: 'https://example.com/cancel',
                failure_url: 'https://example.com/failure',
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw network error', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/hosted-payments')
            .replyWithError('something happened');

        try {
            const cko = new Checkout('sk_');

            const hostedResponse = await cko.hostedPayments.create({
                amount: 10,
                currency: 'USD',
                billing: {
                    address: {
                        address_line1: 'Checkout.com',
                        address_line2: '90 Tottenham Court Road',
                        city: 'London',
                        state: 'London',
                        zip: 'W1T 4TJ',
                        country: 'GB',
                    },
                },
                success_url: 'https://example.com/success',
                cancel_url: 'https://example.com/cancel',
                failure_url: 'https://example.com/failure',
            });
        } catch (err) {
            expect(err.body).to.be.equal(
                'request to https://api.sandbox.checkout.com/hosted-payments failed, reason: something happened'
            );
        }
    });

    it('should get a hosted payment ', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/hosted-payments')
            .reply(201, {
                id: 'hpp_kQhs_fI9b8oQ',
                reference: 'ORD-5023-4E89',
                _links: {
                    redirect: {
                        href: 'https://pay.checkout.com/page/d6a471b9430f13b1035072f9ce45a8ce:9e5de0d41e9748cf6bc91e650f2c823845997bc52be6108969b47eedffcd06c57e034af5d3090b6c137a0c5de665e68458db94c95b89e2acf326d1996d71f3e2cb52fbfdcadf505af7f4078ff6135d1ebf20b02543dc78b883a313605684b7544d3a14146961c3c7b7e47145971d2388d62553eacce2176b9604484023db1017',
                    },
                },
            });

        nock('https://api.sandbox.checkout.com')
            .get(/.*/)
            .reply(201, {
                id: 'hpp_kQhs_fI9b8oQ',
                status: 'Payment Pending',
                amount: 10,
                currency: 'USD',
                billing: {
                    address: {
                        zip: 'W1T 4TJ',
                        country: 'GB',
                        state: 'London',
                        address_line2: '90 Tottenham Court Road',
                        address_line1: 'Checkout.com',
                        city: 'London',
                    },
                },
                metadata: {},
                success_url: 'https://example.com/success',
                cancel_url: 'https://example.com/cancel',
                failure_url: 'https://example.com/failure',
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/hosted-payments/hpp_kQhs_fI9b8oQ',
                    },
                    redirect: { href: 'https://pay.sandbox.checkout.com/page/hpp_kQhs_fI9b8oQ' },
                },
            });

        const cko = new Checkout(SK);

        const hostedResponse = await cko.hostedPayments.create({
            amount: 10,
            currency: 'USD',
            billing: {
                address: {
                    address_line1: 'Checkout.com',
                    address_line2: '90 Tottenham Court Road',
                    city: 'London',
                    state: 'London',
                    zip: 'W1T 4TJ',
                    country: 'GB',
                },
            },
            success_url: 'https://example.com/success',
            cancel_url: 'https://example.com/cancel',
            failure_url: 'https://example.com/failure',
        });
        let id = hostedResponse.id;
        const hp = await cko.hostedPayments.get(id);

        expect(hp.id).to.equal(id);
    });

    it('should throw Authentication Error', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/hosted-payments/hpp_kQhs_fI9b8oQ')
            .reply(401);

        try {
            const cko = new Checkout();

            const hp = await cko.hostedPayments.get('hpp_kQhs_fI9b8oQ');

            expect(hp.id).to.equal('hpp_kQhs_fI9b8oQ');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
