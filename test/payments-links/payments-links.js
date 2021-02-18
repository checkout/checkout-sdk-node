import {
    BadGateway,
    TooManyRequestsError,
    ValidationError,
    ValueError,
    AuthenticationError,
    NotFoundError,
    ActionNotAllowed,
} from '../../src/services/errors';
import { Checkout } from '../../src/index';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Payment Links', () => {
    it('should create a payment link', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payment-links')
            .reply(201, {
                id: 'cid_a8d1120d-db2d-4799-8216-49db594da0a4',
                expires_on: '2021-02-19T16:54:41.501Z',
                _links: {
                    redirect: { href: 'https://pay.sandbox.checkout.com/link/IT1-wLhj_wM8' },
                },
            });

        const cko = new Checkout(SK);

        const linksResponse = await cko.paymentLinks.create({
            amount: 10359,
            currency: 'EUR',
            billing: {
                address: {
                    country: 'DE',
                },
            },
            products: [
                {
                    name: 'Moonlight blue lightsaber',
                    quantity: 2,
                    price: 3999,
                },
                {
                    name: 'Stainless steel watch strap',
                    quantity: 1,
                    price: 2361,
                },
            ],
            return_url: 'https://pay.sandbox.checkout.com/link/examples/docs',
        });

        expect(linksResponse._links.redirect.href).to.equal(
            'https://pay.sandbox.checkout.com/link/IT1-wLhj_wM8'
        );
    });

    it('should throw Authentication Error', async () => {
        nock('https://api.sandbox.checkout.com').post('/payment-links').reply(401);

        try {
            const cko = new Checkout('sk_');

            const linksResponse = await cko.paymentLinks.create({
                amount: 10359,
                currency: 'EUR',
                billing: {
                    address: {
                        country: 'DE',
                    },
                },
                products: [
                    {
                        name: 'Moonlight blue lightsaber',
                        quantity: 2,
                        price: 3999,
                    },
                    {
                        name: 'Stainless steel watch strap',
                        quantity: 1,
                        price: 2361,
                    },
                ],
                return_url: 'https://pay.sandbox.checkout.com/link/examples/docs',
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw network error', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payment-links')
            .replyWithError('something happened');

        try {
            const cko = new Checkout('sk_');

            const linksResponse = await cko.paymentLinks.create({
                amount: 10359,
                currency: 'EUR',
                billing: {
                    address: {
                        country: 'DE',
                    },
                },
                products: [
                    {
                        name: 'Moonlight blue lightsaber',
                        quantity: 2,
                        price: 3999,
                    },
                    {
                        name: 'Stainless steel watch strap',
                        quantity: 1,
                        price: 2361,
                    },
                ],
                return_url: 'https://pay.sandbox.checkout.com/link/examples/docs',
            });
        } catch (err) {
            expect(err.body).to.be.equal(
                'request to https://api.sandbox.checkout.com/payment-links failed, reason: something happened'
            );
        }
    });
});
