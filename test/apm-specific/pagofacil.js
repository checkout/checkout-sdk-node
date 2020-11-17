import { NotFoundError } from '../../src/services/errors';
import { Checkout } from '../../src/index';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Pago Facil', () => {
    it('should succeed Pago Facil payment', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(201, {
                id: 'pay_b4wrbvczujuujja72omsufguzu',
                action_id: 'act_l5rvkbinxztepjskr7vwlovzsq',
                amount: 1040,
                currency: 'USD',
                approved: true,
                status: 'Authorized',
                auth_code: '015107',
                eci: '05',
                scheme_id: '457027721465486',
                response_code: '10000',
                response_summary: 'Approved',
                risk: { flagged: false },
                source: {
                    id: 'src_sum4kuu2fb3edbn6lws7s6ilsm',
                    type: 'card',
                    expiry_month: 8,
                    expiry_year: 2025,
                    name: 'Sarah Mitchell',
                    scheme: 'Visa',
                    last4: '4242',
                    fingerprint: '5CD3B9CB15338683110959D165562D23084E1FF564F420FE9A990DF0BCD093FC',
                    bin: '424242',
                    card_type: 'Credit',
                    card_category: 'Consumer',
                    issuer: 'JPMORGAN CHASE BANK NA',
                    issuer_country: 'US',
                    product_id: 'A',
                    product_type: 'Visa Traditional',
                    avs_check: 'S',
                    cvv_check: 'Y',
                    payouts: true,
                    fast_funds: 'd',
                },
                customer: { id: 'cus_wwgz2l2ywsiujj25l4tx2xscqy', name: 'Sarah Mitchell' },
                processed_on: '2020-04-26T20:47:30Z',
                reference: 'CB',
                processing: {
                    acquirer_transaction_id: '9576266789',
                    retrieval_reference_number: '989885937118',
                },
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_l5rvkbinxztepjskr7vwlovzsq',
                    },
                    actions: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_l5rvkbinxztepjskr7vwlovzsq/actions',
                    },
                    capture: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_l5rvkbinxztepjskr7vwlovzsq/captures',
                    },
                    void: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_l5rvkbinxztepjskr7vwlovzsq/voids',
                    },
                },
                requiresRedirect: false,
                redirectLink: undefined,
            });

        nock('https://api.sandbox.checkout.com')
            .post('/apms/pagofacil/payments/pay_b4wrbvczujuujja72omsufguzu/succeed')
            .reply(200);

        const cko = new Checkout(SK);

        const payment = await cko.payments.request({
            source: {
                type: 'pagofacil',
                integration_type: 'redirect',
                country: 'AR',
                payer: {
                    name: 'Bruce Wayne',
                    email: 'bruce@wayne-enterprises.com',
                },
                description: 'simulate Pago Fácil Demo Payment',
            },
            amount: 100,
            currency: 'ARS',
        });

        const pagoFacil = await cko.pagoFacil.succeed(payment.id);
    });

    it('should throw NotFoundError trying to succeed Pago Facil payment', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/apms/pagofacil/payments/1234/succeed')
            .reply(404);

        const cko = new Checkout(SK);

        try {
            const pagoFacil = await cko.pagoFacil.succeed('1234');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should expire Pago Facil payment', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(201, {
                id: 'pay_b4wrbvczujuujja72omsufguzu',
                action_id: 'act_l5rvkbinxztepjskr7vwlovzsq',
                amount: 1040,
                currency: 'USD',
                approved: true,
                status: 'Authorized',
                auth_code: '015107',
                eci: '05',
                scheme_id: '457027721465486',
                response_code: '10000',
                response_summary: 'Approved',
                risk: { flagged: false },
                source: {
                    id: 'src_sum4kuu2fb3edbn6lws7s6ilsm',
                    type: 'card',
                    expiry_month: 8,
                    expiry_year: 2025,
                    name: 'Sarah Mitchell',
                    scheme: 'Visa',
                    last4: '4242',
                    fingerprint: '5CD3B9CB15338683110959D165562D23084E1FF564F420FE9A990DF0BCD093FC',
                    bin: '424242',
                    card_type: 'Credit',
                    card_category: 'Consumer',
                    issuer: 'JPMORGAN CHASE BANK NA',
                    issuer_country: 'US',
                    product_id: 'A',
                    product_type: 'Visa Traditional',
                    avs_check: 'S',
                    cvv_check: 'Y',
                    payouts: true,
                    fast_funds: 'd',
                },
                customer: { id: 'cus_wwgz2l2ywsiujj25l4tx2xscqy', name: 'Sarah Mitchell' },
                processed_on: '2020-04-26T20:47:30Z',
                reference: 'CB',
                processing: {
                    acquirer_transaction_id: '9576266789',
                    retrieval_reference_number: '989885937118',
                },
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_l5rvkbinxztepjskr7vwlovzsq',
                    },
                    actions: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_l5rvkbinxztepjskr7vwlovzsq/actions',
                    },
                    capture: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_l5rvkbinxztepjskr7vwlovzsq/captures',
                    },
                    void: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_l5rvkbinxztepjskr7vwlovzsq/voids',
                    },
                },
                requiresRedirect: false,
                redirectLink: undefined,
            });

        nock('https://api.sandbox.checkout.com')
            .post('/apms/pagofacil/payments/pay_b4wrbvczujuujja72omsufguzu/expire')
            .reply(200);

        const cko = new Checkout(SK);

        const payment = await cko.payments.request({
            source: {
                type: 'pagofacil',
                integration_type: 'redirect',
                country: 'AR',
                payer: {
                    name: 'Bruce Wayne',
                    email: 'bruce@wayne-enterprises.com',
                },
                description: 'simulate Pago Fácil Demo Payment',
            },
            amount: 100,
            currency: 'ARS',
        });

        const pagoFacil = await cko.pagoFacil.expire(payment.id);
    });

    it('should throw NotFoundError trying to expire Pago Facil payment', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/apms/pagofacil/payments/1234/expire')
            .reply(404);

        const cko = new Checkout(SK);

        try {
            const pagoFacil = await cko.pagoFacil.expire('1234');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
