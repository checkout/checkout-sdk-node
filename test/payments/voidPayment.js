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

describe('Void a payment', () => {
    it('should void payment without a body', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(
                201,
                {
                    id: 'pay_6ndp5facelxurne7gloxkxm57u',
                    action_id: 'act_6ndp5facelxurne7gloxkxm57u',
                    amount: 100,
                    currency: 'USD',
                    approved: true,
                    status: 'Authorized',
                    auth_code: '277368',
                    response_code: '10000',
                    response_summary: 'Approved',
                    '3ds': undefined,
                    risk: { flagged: false },
                    source: {
                        id: 'src_mtagg5kktcoerkwloibzfuilpy',
                        type: 'card',
                        expiry_month: 6,
                        expiry_year: 2029,
                        scheme: 'Visa',
                        last4: '4242',
                        fingerprint:
                            '107A352DFAE35E3EEBA5D0856FCDFB88ECF91E8CFDE4275ABBC791FD9579AB2C',
                        bin: '424242',
                        card_type: 'Credit',
                        card_category: 'Consumer',
                        issuer: 'JPMORGAN CHASE BANK NA',
                        issuer_country: 'US',
                        product_id: 'A',
                        product_type: 'Visa Traditional',
                        avs_check: 'S',
                        cvv_check: 'Y',
                    },
                    customer: { id: 'cus_leu5pp2zshpuvbt6yjxl5xcrdi' },
                    processed_on: '2019-06-09T22:43:54Z',
                    reference: undefined,
                    eci: '05',
                    scheme_id: '638284745624527',
                    _links: {
                        self: {
                            href:
                                'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u',
                        },
                        actions: {
                            href:
                                'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/actions',
                        },
                        capture: {
                            href:
                                'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/captures',
                        },
                        void: {
                            href:
                                'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/voids',
                        },
                    },
                },
                {
                    'cko-request-id': ['1695a930-09cf-4db0-a91e-a772e6ee076g'],
                    'cko-version': ['3.31.4'],
                }
            );

        nock('https://api.sandbox.checkout.com')
            .post(/voids$/)
            .reply(202, {
                action_id: 'act_hvue5c7klzmubkfmxfptldibdi',
                reference: 'ORD-5023-4E89',
                _links: {
                    payment: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_o5z2bssaelbehmhcyh42jvxfo4',
                    },
                },
            });

        const cko = new Checkout(SK);

        const transaction = await cko.payments.request({
            source: {
                number: '4242424242424242',
                expiry_month: 6,
                expiry_year: 2029,
                cvv: '100',
            },
            currency: 'USD',
            capture: false,
            reference: 'ORD-5023-4E89',
            amount: 100,
        });
        const paymentId = transaction.id;
        const refund = await cko.payments.void(paymentId);

        expect(refund.reference).to.equal('ORD-5023-4E89');
    });

    it('should void payment with a body', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(
                201,
                {
                    id: 'pay_6ndp5facelxurne7gloxkxm57u',
                    action_id: 'act_6ndp5facelxurne7gloxkxm57u',
                    amount: 100,
                    currency: 'USD',
                    approved: true,
                    status: 'Authorized',
                    auth_code: '277368',
                    response_code: '10000',
                    response_summary: 'Approved',
                    '3ds': undefined,
                    risk: { flagged: false },
                    source: {
                        id: 'src_mtagg5kktcoerkwloibzfuilpy',
                        type: 'card',
                        expiry_month: 6,
                        expiry_year: 2029,
                        scheme: 'Visa',
                        last4: '4242',
                        fingerprint:
                            '107A352DFAE35E3EEBA5D0856FCDFB88ECF91E8CFDE4275ABBC791FD9579AB2C',
                        bin: '424242',
                        card_type: 'Credit',
                        card_category: 'Consumer',
                        issuer: 'JPMORGAN CHASE BANK NA',
                        issuer_country: 'US',
                        product_id: 'A',
                        product_type: 'Visa Traditional',
                        avs_check: 'S',
                        cvv_check: 'Y',
                    },
                    customer: { id: 'cus_leu5pp2zshpuvbt6yjxl5xcrdi' },
                    processed_on: '2019-06-09T22:43:54Z',
                    reference: undefined,
                    eci: '05',
                    scheme_id: '638284745624527',
                    _links: {
                        self: {
                            href:
                                'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u',
                        },
                        actions: {
                            href:
                                'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/actions',
                        },
                        capture: {
                            href:
                                'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/captures',
                        },
                        void: {
                            href:
                                'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/voids',
                        },
                    },
                },
                {
                    'cko-request-id': ['1695a930-09cf-4db0-a91e-a772e6ee076g'],
                    'cko-version': ['3.31.4'],
                }
            );

        nock('https://api.sandbox.checkout.com')
            .post(/captures$/)
            .reply(202, {
                action_id: 'act_sdsnnv4ehjeujmvgby6rldgmw4',
                reference: 'ORD-5023-4E89',
                _links: {
                    payment: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_gwqbb7qbjiee3edqmyk3dme64i',
                    },
                },
            });

        nock('https://api.sandbox.checkout.com')
            .post(/voids$/)
            .reply(202, {
                action_id: 'act_3cxabwfq4ieu3mn3cuzv7ct6dy',
                reference: 'VOID',
                _links: {
                    payment: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_oac5nzmbcrcu5kfglj4dxwzu6y',
                    },
                },
            });

        const cko = new Checkout(SK);

        const transaction = await cko.payments.request({
            source: {
                number: '4242424242424242',
                expiry_month: 6,
                expiry_year: 2029,
                cvv: '100',
            },
            currency: 'USD',
            capture: false,
            reference: 'ORD-5023-4E89',
            amount: 100,
        });
        const paymentId = transaction.id;
        const refund = await cko.payments.void(paymentId, {
            reference: 'VOID',
        });

        expect(refund.reference).to.equal('VOID');
    });

    it('should throw AuthenticationError', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments/pay_7enxra4adw6evgalvfabl6nbqy/voids')
            .reply(401);

        try {
            const cko = new Checkout('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f809');
            const refund = await cko.payments.void('pay_7enxra4adw6evgalvfabl6nbqy');
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });

    it('should throw Void not allowed error', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(
                201,
                {
                    id: 'pay_6ndp5facelxurne7gloxkxm57z',
                    action_id: 'act_6ndp5facelxurne7gloxkxm57u',
                    amount: 100,
                    currency: 'USD',
                    approved: true,
                    status: 'Authorized',
                    auth_code: '277368',
                    response_code: '10000',
                    response_summary: 'Approved',
                    '3ds': undefined,
                    risk: { flagged: false },
                    source: {
                        id: 'src_mtagg5kktcoerkwloibzfuilpz',
                        type: 'card',
                        expiry_month: 6,
                        expiry_year: 2029,
                        scheme: 'Visa',
                        last4: '4242',
                        fingerprint:
                            '107A352DFAE35E3EEBA5D0856FCDFB88ECF91E8CFDE4275ABBC791FD9579AB2C',
                        bin: '424242',
                        card_type: 'Credit',
                        card_category: 'Consumer',
                        issuer: 'JPMORGAN CHASE BANK NA',
                        issuer_country: 'US',
                        product_id: 'A',
                        product_type: 'Visa Traditional',
                        avs_check: 'S',
                        cvv_check: 'Y',
                    },
                    customer: { id: 'cus_leu5pp2zshpuvbt6yjxl5xcrdi' },
                    processed_on: '2019-06-09T22:43:54Z',
                    reference: undefined,
                    eci: '05',
                    scheme_id: '638284745624527',
                    _links: {
                        self: {
                            href:
                                'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57z',
                        },
                        actions: {
                            href:
                                'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57z/actions',
                        },
                        capture: {
                            href:
                                'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57z/captures',
                        },
                        void: {
                            href:
                                'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57z/voids',
                        },
                    },
                },
                {
                    'cko-request-id': ['3395a930-09cf-4db0-a91e-a772e6ee076g'],
                    'cko-version': ['3.31.4'],
                }
            );

        nock('https://api.sandbox.checkout.com')
            .post(/captures$/)
            .reply(202, {
                action_id: 'act_sdsnnv4ehjeujmvgby6rldgmw5',
                reference: 'ORD-5023-4E10',
                _links: {
                    payment: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57z',
                    },
                },
            });

        nock('https://api.sandbox.checkout.com')
            .post(/voids$/)
            .reply(403);

        const cko = new Checkout(SK);

        const transaction = await cko.payments.request({
            source: {
                number: '4242424242424242',
                expiry_month: 6,
                expiry_year: 2029,
                cvv: '100',
            },
            currency: 'USD',
            capture: false,
            reference: 'ORD-5023-4E10',
            amount: 100,
        });
        const paymentId = transaction.id;

        try {
            const refund = await cko.payments.capture(paymentId);
            const voids = await cko.payments.void(paymentId);
        } catch (err) {
            expect(err.name).to.equal('ActionNotAllowed');
        }
    });

    it('should throw payment not found error', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments/pay_7enxra4adw6evgalvfabl6nbaa/voids')
            .reply(404);

        try {
            const cko = new Checkout(SK);
            const refund = await cko.payments.void('pay_7enxra4adw6evgalvfabl6nbaa');
        } catch (err) {
            expect(err.name).to.equal('NotFoundError');
        }
    });

    it('should throw Validation error', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(
                201,
                {
                    id: 'pay_6ndp5facelxurne7gloxkxm57u',
                    action_id: 'act_6ndp5facelxurne7gloxkxm57u',
                    amount: 100,
                    currency: 'USD',
                    approved: true,
                    status: 'Authorized',
                    auth_code: '277368',
                    response_code: '10000',
                    response_summary: 'Approved',
                    '3ds': undefined,
                    risk: { flagged: false },
                    source: {
                        id: 'src_mtagg5kktcoerkwloibzfuilpy',
                        type: 'card',
                        expiry_month: 6,
                        expiry_year: 2029,
                        scheme: 'Visa',
                        last4: '4242',
                        fingerprint:
                            '107A352DFAE35E3EEBA5D0856FCDFB88ECF91E8CFDE4275ABBC791FD9579AB2C',
                        bin: '424242',
                        card_type: 'Credit',
                        card_category: 'Consumer',
                        issuer: 'JPMORGAN CHASE BANK NA',
                        issuer_country: 'US',
                        product_id: 'A',
                        product_type: 'Visa Traditional',
                        avs_check: 'S',
                        cvv_check: 'Y',
                    },
                    customer: { id: 'cus_leu5pp2zshpuvbt6yjxl5xcrdi' },
                    processed_on: '2019-06-09T22:43:54Z',
                    reference: undefined,
                    eci: '05',
                    scheme_id: '638284745624527',
                    _links: {
                        self: {
                            href:
                                'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u',
                        },
                        actions: {
                            href:
                                'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/actions',
                        },
                        capture: {
                            href:
                                'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/captures',
                        },
                        void: {
                            href:
                                'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/voids',
                        },
                    },
                },
                {
                    'cko-request-id': ['1695a930-09cf-4db0-a91e-a772e6ee076g'],
                    'cko-version': ['3.31.4'],
                }
            );

        nock('https://api.sandbox.checkout.com')
            .post(/captures$/)
            .reply(202, {
                action_id: 'act_sdsnnv4ehjeujmvgby6rldgmw4',
                reference: 'ORD-5023-4E89',
                _links: {
                    payment: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_gwqbb7qbjiee3edqmyk3dme64i',
                    },
                },
            });

        nock('https://api.sandbox.checkout.com')
            .post(/voids$/)
            .reply(422, {
                request_id: '7867a675-deac-4270-a4dc-04fa2ba4fe8d',
                error_type: 'processing_error',
                error_codes: ['amount_exceeds_balance'],
            });

        const cko = new Checkout(SK);

        const transaction = await cko.payments.request({
            source: {
                number: '4242424242424242',
                expiry_month: 6,
                expiry_year: 2029,
                cvv: '100',
            },
            currency: 'USD',
            capture: false,
            reference: 'ORD-5023-4E89',
            amount: 1000,
        });
        const paymentId = transaction.id;
        try {
            const voids = await cko.payments.void(paymentId);
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });

    it('should use the idempotency key', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(201, {
                id: 'pay_3ioomvvwvx2u3na4llqircyui4',
                action_id: 'act_3ioomvvwvx2u3na4llqircyui4',
                amount: 100,
                currency: 'USD',
                approved: true,
                status: 'Authorized',
                auth_code: '729484',
                eci: '05',
                scheme_id: '183423818027975',
                response_code: '10000',
                response_summary: 'Approved',
                risk: { flagged: false },
                source: {
                    id: 'src_mbwdm3kaegrurlc4wkfztkdyqu',
                    type: 'card',
                    expiry_month: 6,
                    expiry_year: 2029,
                    scheme: 'Visa',
                    last4: '4242',
                    fingerprint: '107A352DFAE35E3EEBA5D0856FCDFB88ECF91E8CFDE4275ABBC791FD9579AB2C',
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
                customer: { id: 'cus_juqoyliauvaebg2evkaivvvba4' },
                processed_on: '2020-06-10T14:21:33Z',
                reference: 'ORD-IDM-1',
                processing: {
                    acquirer_transaction_id: '6930041435',
                    retrieval_reference_number: '478433762742',
                },
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_3ioomvvwvx2u3na4llqircyui4',
                    },
                    actions: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_3ioomvvwvx2u3na4llqircyui4/actions',
                    },
                    capture: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_3ioomvvwvx2u3na4llqircyui4/captures',
                    },
                    void: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_3ioomvvwvx2u3na4llqircyui4/voids',
                    },
                },
                requiresRedirect: false,
                redirectLink: undefined,
            });

        nock('https://api.sandbox.checkout.com')
            .post(/voids$/)
            .reply(202, {
                action_id: 'act_sdsnnv4ehjeujmvgby6rldgmw4',
                reference: 'my-idempotent-void',
                _links: {
                    payment: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_gwqbb7qbjiee3edqmyk3dme64i',
                    },
                },
            });
        nock('https://api.sandbox.checkout.com')
            .post(/voids$/)
            .reply(202, {
                action_id: 'act_sdsnnv4ehjeujmvgby6rldgmw4',
                reference: 'my-idempotent-void',
                _links: {
                    payment: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_gwqbb7qbjiee3edqmyk3dme64i',
                    },
                },
            });
        const cko = new Checkout(SK);
        try {
            const transaction = await cko.payments.request({
                source: {
                    number: '4242424242424242',
                    expiry_month: 6,
                    expiry_year: 2029,
                    cvv: '100',
                },
                currency: 'USD',
                capture: false,
                reference: 'ORD-IDM-1',
                amount: 100,
            });
            const paymentId = transaction.id;
            const void1 = await cko.payments.void(
                paymentId,
                {
                    reference: 'my-idempotent-void',
                },
                'loinlpnlujn;j'
            );
            const void2 = await cko.payments.void(
                paymentId,
                {
                    reference: 'other',
                },
                'loinlpnlujn'
            );

            expect(void2.reference).to.equal('my-idempotent-void');
        } catch (error) {
            console.log(error);
        }
    });
});
