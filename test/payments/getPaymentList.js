import { AuthenticationError, } from '../../src/services/errors.js';
import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';

describe('Get payment list', () => {
    it('should get a payment list with reference', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/payments?reference=1234')
            .reply(200, {
                total_count: 1,
                skip: 0,
                limit: 10,
                data: [
                    {
                        id: 'pay_3lird6z63jpujguvaxnjyqsu4e',
                        requested_on: '2022-11-16T11:49:05.7569066Z',
                        source: {
                            id: 'src_tau2xntwuseurnshye5fp722g4',
                            type: 'card',
                            expiry_month: 11,
                            expiry_year: 2024,
                            scheme: 'Visa',
                            last4: '4242',
                            fingerprint:
                                '0418BC9FAEA9AC9630A54573D5ADEDB324F0255CE620CBA8CA62598726F3E77C',
                            bin: '424242',
                            card_type: 'CREDIT',
                            card_category: 'CONSUMER',
                            issuer_country: 'GB',
                            product_id: 'F',
                            product_type: 'Visa Classic',
                            avs_check: 'G',
                            cvv_check: 'Y',
                            payment_account_reference: 'V001757443972836103',
                        },
                        expires_on: '2022-12-16T11:49:05.867851Z',
                        amount: 1000,
                        currency: 'GBP',
                        payment_type: 'Regular',
                        reference: '1234',
                        status: 'Authorized',
                        approved: true,
                        balances: {
                            total_authorized: 1000,
                            total_voided: 0,
                            available_to_void: 1000,
                            total_captured: 0,
                            available_to_capture: 1000,
                            total_refunded: 0,
                            available_to_refund: 0,
                        },
                        risk: {
                            flagged: false,
                            score: 0.0,
                        },
                        scheme_id: '678355673241835',
                        _links: {
                            self: {
                                href: 'https://api.sandbox.checkout.com/payments/pay_3lird6z63jpujguvaxnjyqsu4e',
                            },
                            actions: {
                                href: 'https://api.sandbox.checkout.com/payments/pay_3lird6z63jpujguvaxnjyqsu4e/actions',
                            },
                            capture: {
                                href: 'https://api.sandbox.checkout.com/payments/pay_3lird6z63jpujguvaxnjyqsu4e/captures',
                            },
                            void: {
                                href: 'https://api.sandbox.checkout.com/payments/pay_3lird6z63jpujguvaxnjyqsu4e/voids',
                            },
                        },
                    },
                ],
            });

        const cko = new Checkout(SK);

        const list = await cko.payments.getPaymentList({
            reference: '1234',
        });

        expect(list.data[0].reference).to.equal('1234');
    });

    it('should throw authentication error', async () => {
        nock('https://api.sandbox.checkout.com').get('/payments?reference=1234').reply(401, {});

        try {
            const cko = new Checkout('test');

            const list = await cko.payments.getPaymentList({
                reference: '1234',
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
