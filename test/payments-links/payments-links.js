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

    it('should throw when getting the payment link status', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payment-links')
            .reply(201, {
                id: 'pl_irx_SMlY5RCA',
                expires_on: '2021-02-19T16:54:41.501Z',
                _links: {
                    redirect: { href: 'https://pay.sandbox.checkout.com/link/IT1-wLhj_wM8' },
                },
            });

        nock('https://api.sandbox.checkout.com')
            .get('/payment-links/pl_irx_SMlY5RCA')
            .reply(200, {
                id: 'pl_irx_SMlY5RCA',
                status: 'Active',
                expires_on: '2021-06-24T14:16:35.862Z',
                return_url: 'https://pay.sandbox.checkout.com/link/examples/docs',
                amount: 10359,
                currency: 'EUR',
                billing: { address: { country: 'DE' } },
                products: [
                    {
                        name: 'Moonlight blue lightsaber',
                        discountAmount: 0,
                        type: 'physical',
                        quantity: 2,
                        price: 3999,
                    },
                    {
                        name: 'Stainless steel watch strap',
                        discountAmount: 0,
                        type: 'physical',
                        quantity: 1,
                        price: 2361,
                    },
                ],
                metadata: { correlationId: 'afa2d5d8-6e27-429e-a56a-e9c0a1ce10a9' },
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/payment-links/pl_irx_SMlY5RCA',
                    },
                    redirect: { href: 'https://pay.sandbox.checkout.com/link/pl_irx_SMlY5RCA' },
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

        let getResponse = await cko.paymentLinks.get(linksResponse.id);
    });

    it('should get the payment link status', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payment-links')
            .reply(201, {
                id: 'pl_irx_SMlY5RCA',
                expires_on: '2021-02-19T16:54:41.501Z',
                _links: {
                    redirect: { href: 'https://pay.sandbox.checkout.com/link/IT1-wLhj_wM8' },
                },
            });

        nock('https://api.sandbox.checkout.com').get('/payment-links/pl_irx_SMlY5RCA').reply(404);

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

        try {
            let getResponse = await cko.paymentLinks.get(linksResponse.id);
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
