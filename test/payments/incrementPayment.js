import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

describe('Increment a payment', () => {
    it('should increment auth with a body', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'gateway',
        });

        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(201, {
                id: 'pay_bvxdyo7xdssuhcx3e74dpcrfmu',
                action_id: 'act_qidsbyywlgeu7hm33lo6rtlfwq',
                amount: 6540,
                currency: 'USD',
                approved: true,
                status: 'Authorized',
                auth_code: '124203',
                response_code: '10000',
                response_summary: 'Approved',
                balances: {
                    total_authorized: 6540,
                    total_voided: 0,
                    available_to_void: 6540,
                    total_captured: 0,
                    available_to_capture: 6540,
                    total_refunded: 0,
                    available_to_refund: 0,
                },
                risk: {
                    flagged: false,
                },
                source: {
                    id: 'src_cgwj5on46njefeqha4z5vlea5m',
                    type: 'card',
                    expiry_month: 7,
                    expiry_year: 2028,
                    scheme: 'Mastercard',
                    last4: '6378',
                    fingerprint: '8277F14DA8B55B098E3CD7311199D81B9BA172A60E047E516F46CAE49E9210B0',
                    bin: '543603',
                    card_type: 'CREDIT',
                    card_category: 'CONSUMER',
                    issuer: 'STATE BANK OF MAURITIUS, LTD.',
                    issuer_country: 'MU',
                    product_id: 'MCC',
                    product_type: 'MasterCard® Credit Card (mixed BIN)',
                    avs_check: 'S',
                    payment_account_reference: '',
                },
                customer: {
                    id: 'cus_3dapnnm2l6ue3eagk5lufxt3am',
                    email: 'johnny.shrewd@gmail.com',
                    name: 'Johnny Shrewd',
                },
                processed_on: '2022-01-02T18:05:36.014323Z',
                scheme_id: '533484667746811',
                processing: {
                    acquirer_transaction_id: '927563475011232961932',
                    retrieval_reference_number: '169943680335',
                },
                expires_on: '2022-01-09T18:05:35.9803885Z',
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_bvxdyo7xdssuhcx3e74dpcrfmu',
                    },
                    actions: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_bvxdyo7xdssuhcx3e74dpcrfmu/actions',
                    },
                    capture: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_bvxdyo7xdssuhcx3e74dpcrfmu/captures',
                    },
                    void: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_bvxdyo7xdssuhcx3e74dpcrfmu/voids',
                    },
                    authorizations: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_bvxdyo7xdssuhcx3e74dpcrfmu/authorizations',
                    },
                },
            });

        nock('https://api.sandbox.checkout.com')
            .post(`/payments/pay_bvxdyo7xdssuhcx3e74dpcrfmu/authorizations`)
            .reply(201, {
                action_id: 'act_lswhshupa76ujol47pnuepswhe',
                amount: 200,
                currency: 'USD',
                approved: true,
                auth_code: '124203',
                scheme_id: '924610940161338',
                response_code: '10000',
                response_summary: 'Approved',
                risk: {
                    flagged: false,
                },
                processed_on: '2022-01-02T18:05:49.944558Z',
                processing: {
                    acquirer_transaction_id: '964357037026614603305',
                    retrieval_reference_number: '268549968019',
                },
                balances: {
                    total_authorized: 6590,
                    total_voided: 0,
                    available_to_void: 6590,
                    total_captured: 0,
                    available_to_capture: 6590,
                    total_refunded: 0,
                    available_to_refund: 0,
                },
                expires_on: '2022-01-09T18:05:49.8993047Z',
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_bvxdyo7xdssuhcx3e74dpcrfmu',
                    },
                    actions: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_bvxdyo7xdssuhcx3e74dpcrfmu/actions',
                    },
                    capture: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_bvxdyo7xdssuhcx3e74dpcrfmu/captures',
                    },
                    void: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_bvxdyo7xdssuhcx3e74dpcrfmu/voids',
                    },
                    authorizations: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_bvxdyo7xdssuhcx3e74dpcrfmu/authorizations',
                    },
                },
            });

        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['gateway'],
                environment: 'sandbox',
            }
        );
        const auth = await cko.payments.request({
            source: {
                number: '4242424242424242',
                expiry_month: 6,
                expiry_year: 2029,
                cvv: '100',
            },
            currency: 'USD',
            capture: false,
            authorization_type: 'Estimated',
            processing_channel_id: 'pc_zs5fqhybzc2e3jmq3efvybybpq',
            amount: 100,
        });

        const increment = await cko.payments.increment(auth.id, {
            amount: 200,
        }, undefined);

        expect(increment.amount).to.equal(200);
    });

    it('should increment auth with a body and static key', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(201, {
                id: 'pay_bvxdyo7xdssuhcx3e74dpcrfmu',
                action_id: 'act_qidsbyywlgeu7hm33lo6rtlfwq',
                amount: 6540,
                currency: 'USD',
                approved: true,
                status: 'Authorized',
                auth_code: '124203',
                response_code: '10000',
                response_summary: 'Approved',
                balances: {
                    total_authorized: 6540,
                    total_voided: 0,
                    available_to_void: 6540,
                    total_captured: 0,
                    available_to_capture: 6540,
                    total_refunded: 0,
                    available_to_refund: 0,
                },
                risk: {
                    flagged: false,
                },
                source: {
                    id: 'src_cgwj5on46njefeqha4z5vlea5m',
                    type: 'card',
                    expiry_month: 7,
                    expiry_year: 2028,
                    scheme: 'Mastercard',
                    last4: '6378',
                    fingerprint: '8277F14DA8B55B098E3CD7311199D81B9BA172A60E047E516F46CAE49E9210B0',
                    bin: '543603',
                    card_type: 'CREDIT',
                    card_category: 'CONSUMER',
                    issuer: 'STATE BANK OF MAURITIUS, LTD.',
                    issuer_country: 'MU',
                    product_id: 'MCC',
                    product_type: 'MasterCard® Credit Card (mixed BIN)',
                    avs_check: 'S',
                    payment_account_reference: '',
                },
                customer: {
                    id: 'cus_3dapnnm2l6ue3eagk5lufxt3am',
                    email: 'johnny.shrewd@gmail.com',
                    name: 'Johnny Shrewd',
                },
                processed_on: '2022-01-02T18:05:36.014323Z',
                scheme_id: '533484667746811',
                processing: {
                    acquirer_transaction_id: '927563475011232961932',
                    retrieval_reference_number: '169943680335',
                },
                expires_on: '2022-01-09T18:05:35.9803885Z',
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_bvxdyo7xdssuhcx3e74dpcrfmu',
                    },
                    actions: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_bvxdyo7xdssuhcx3e74dpcrfmu/actions',
                    },
                    capture: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_bvxdyo7xdssuhcx3e74dpcrfmu/captures',
                    },
                    void: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_bvxdyo7xdssuhcx3e74dpcrfmu/voids',
                    },
                    authorizations: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_bvxdyo7xdssuhcx3e74dpcrfmu/authorizations',
                    },
                },
            });

        nock('https://api.sandbox.checkout.com')
            .post(`/payments/pay_bvxdyo7xdssuhcx3e74dpcrfmu/authorizations`)
            .reply(201, {
                action_id: 'act_lswhshupa76ujol47pnuepswhe',
                amount: 200,
                currency: 'USD',
                approved: true,
                auth_code: '124203',
                scheme_id: '924610940161338',
                response_code: '10000',
                response_summary: 'Approved',
                risk: {
                    flagged: false,
                },
                processed_on: '2022-01-02T18:05:49.944558Z',
                processing: {
                    acquirer_transaction_id: '964357037026614603305',
                    retrieval_reference_number: '268549968019',
                },
                balances: {
                    total_authorized: 6590,
                    total_voided: 0,
                    available_to_void: 6590,
                    total_captured: 0,
                    available_to_capture: 6590,
                    total_refunded: 0,
                    available_to_refund: 0,
                },
                expires_on: '2022-01-09T18:05:49.8993047Z',
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_bvxdyo7xdssuhcx3e74dpcrfmu',
                    },
                    actions: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_bvxdyo7xdssuhcx3e74dpcrfmu/actions',
                    },
                    capture: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_bvxdyo7xdssuhcx3e74dpcrfmu/captures',
                    },
                    void: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_bvxdyo7xdssuhcx3e74dpcrfmu/voids',
                    },
                    authorizations: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_bvxdyo7xdssuhcx3e74dpcrfmu/authorizations',
                    },
                },
            });

        const cko = new Checkout('sk_sbox_n2dvcqjweokrqm4q7hlfcfqtn4m');

        const auth = await cko.payments.request({
            source: {
                number: '4242424242424242',
                expiry_month: 6,
                expiry_year: 2029,
                cvv: '100',
            },
            currency: 'USD',
            capture: false,
            authorization_type: 'Estimated',
            processing_channel_id: 'pc_zs5fqhybzc2e3jmq3efvybybpq',
            amount: 100,
        });

        const increment = await cko.payments.increment(auth.id, {
            amount: 200,
        }, undefined);

        expect(increment.amount).to.equal(200);
    });

    it('should throw AuthenticationError', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'gateway',
        });

        nock('https://api.sandbox.checkout.com')
            .post('/payments/pay_bvxdyo7xdssuhcx3e74dpcrfmu/authorizations')
            .reply(401);

        try {
            let cko = new Checkout(
                '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
                {
                    client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                    scope: ['gateway'],
                    environment: 'sandbox',
                }
            );

            const increment = await cko.payments.increment('pay_bvxdyo7xdssuhcx3e74dpcrfmu', {
                amount: 200,
            }, undefined);
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });
});
