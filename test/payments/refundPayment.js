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

describe('Refund a payment', () => {
    it('should refund payment without a body', async () => {
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
            .post(/refunds$/)
            .reply(202, {
                action_id: 'act_3cxabwfq4ieu3mn3cuzv7ct6dy',
                reference: 'ORD-5023-4E89',
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
        const capture = await cko.payments.capture(paymentId);
        const refund = await cko.payments.refund(paymentId);

        expect(refund.reference).to.equal('ORD-5023-4E89');
    });

    it('should refund payment with a body', async () => {
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
            .post(/refunds$/)
            .reply(202, {
                action_id: 'act_3cxabwfq4ieu3mn3cuzv7ct6dy',
                reference: 'REFUND',
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
        const capture = await cko.payments.capture(paymentId);
        const refund = await cko.payments.refund(paymentId, {
            reference: 'REFUND',
        });

        expect(refund.reference).to.equal('REFUND');
    });

    it('should partially refund payment', async () => {
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
            .post(/refunds$/)
            .reply(202, {
                action_id: 'act_3cxabwfq4ieu3mn3cuzv7ct6dy',
                reference: 'REFUND',
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
        const capture = await cko.payments.capture(paymentId);
        const refund = await cko.payments.refund(paymentId, {
            amount: 50,
            reference: 'REFUND',
        });

        expect(refund.reference).to.equal('REFUND');
    });

    it('should throw AuthenticationError', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments/pay_7enxra4adw6evgalvfabl6nbqy/refunds')
            .reply(401);

        try {
            const cko = new Checkout('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f809');
            const refund = await cko.payments.refund('pay_7enxra4adw6evgalvfabl6nbqy');
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });

    it('should throw Capture not allowed error', async () => {
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
            .post(/refunds$/)
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
            reference: 'ORD-5023-4E89',
            amount: 100,
        });
        const paymentId = transaction.id;

        try {
            const refund = await cko.payments.refund(paymentId);
        } catch (err) {
            expect(err.name).to.equal('ActionNotAllowed');
        }
    });

    it('should throw payment not found error', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments/pay_7enxra4adw6evgalvfabl6nbaa/refunds')
            .reply(404);

        try {
            const cko = new Checkout(SK);
            const refund = await cko.payments.refund('pay_7enxra4adw6evgalvfabl6nbaa');
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
            .post(/refunds$/)
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
            capture: true,
            reference: 'ORD-5023-4E89',
            amount: 1000,
        });
        const paymentId = transaction.id;
        const capture = await cko.payments.capture(paymentId);
        try {
            const refund = await cko.payments.refund(paymentId, {
                amount: 100000,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });

    it('should use the idempotency key', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(201, {
                id: 'pay_gm3rx3aniyeufp4oz6bmxy22ci',
                action_id: 'act_gm3rx3aniyeufp4oz6bmxy22ci',
                amount: 100,
                currency: 'USD',
                approved: true,
                status: 'Authorized',
                auth_code: '056939',
                eci: '05',
                scheme_id: '319125255542634',
                response_code: '10000',
                response_summary: 'Approved',
                risk: { flagged: false },
                source: {
                    id: 'src_2af4hwebcqwe7dv2kvzfoee2je',
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
                customer: { id: 'cus_mxv4kalh2xqu3dwdhrzopdugbi' },
                processed_on: '2020-06-10T14:25:11Z',
                reference: 'ORD-IDM-1',
                processing: {
                    acquirer_transaction_id: '9969978832',
                    retrieval_reference_number: '408734141551',
                },
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_gm3rx3aniyeufp4oz6bmxy22ci',
                    },
                    actions: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_gm3rx3aniyeufp4oz6bmxy22ci/actions',
                    },
                    capture: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_gm3rx3aniyeufp4oz6bmxy22ci/captures',
                    },
                    void: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_gm3rx3aniyeufp4oz6bmxy22ci/voids',
                    },
                },
                requiresRedirect: false,
                redirectLink: undefined,
            });

        nock('https://api.sandbox.checkout.com')
            .post(/captures$/)
            .reply(202, {
                action_id: 'act_sdsnnv4ehjeujmvgby6rldgmw4',
                reference: '',
                _links: {
                    payment: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_gwqbb7qbjiee3edqmyk3dme64i',
                    },
                },
            });
        nock('https://api.sandbox.checkout.com')
            .post(/refunds$/)
            .reply(202, {
                action_id: 'act_sdsnnv4ehjeujmvgby6rldgmw4',
                reference: 'my-idempotent-refund',
                _links: {
                    payment: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_gwqbb7qbjiee3edqmyk3dme64i',
                    },
                },
            });
        nock('https://api.sandbox.checkout.com')
            .post(/refunds$/)
            .reply(202, {
                action_id: 'act_sdsnnv4ehjeujmvgby6rldgmw4',
                reference: 'my-idempotent-refund',
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
            const capture = await cko.payments.capture(paymentId);
            const refund1 = await cko.payments.refund(
                paymentId,
                {
                    reference: 'my-idempotent-refund',
                },
                'kjncjnounouwhne'
            );
            const refund2 = await cko.payments.refund(
                paymentId,
                {
                    reference: 'other',
                },
                'kjncjnounouwhne'
            );

            expect(refund2.reference).to.equal('my-idempotent-refund');
        } catch (error) {
            console.log(error);
        }
    });
});
