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

describe('Capture a payment', () => {
    it('should capture payment without a body', async () => {
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

        expect(capture.reference).to.equal('ORD-5023-4E89');
    });

    it('should partially capture payment', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(
                201,
                {
                    id: 'pay_gwqbb7qbjiee3edqmyk3dme50p',
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
                    reference: '1234554321',
                    eci: '05',
                    scheme_id: '638284745624527',
                    _links: {
                        self: {
                            href:
                                'https://api.sandbox.checkout.com/payments/pay_gwqbb7qbjiee3edqmyk3dme50p',
                        },
                        actions: {
                            href:
                                'https://api.sandbox.checkout.com/payments/pay_gwqbb7qbjiee3edqmyk3dme50p/actions',
                        },
                        capture: {
                            href:
                                'https://api.sandbox.checkout.com/payments/pay_gwqbb7qbjiee3edqmyk3dme50p/captures',
                        },
                        void: {
                            href:
                                'https://api.sandbox.checkout.com/payments/pay_gwqbb7qbjiee3edqmyk3dme50p/voids',
                        },
                    },
                },
                {
                    'cko-request-id': ['7795a930-09cf-4db0-a91e-a772e6ee076g'],
                    'cko-version': ['3.31.4'],
                }
            );

        nock('https://api.sandbox.checkout.com')
            .post(/captures$/)
            .reply(202, {
                action_id: 'act_sdsnnv4ehjeujmvgby6rldgmw4',
                reference: 'CAPTURE-REF',
                _links: {
                    payment: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_gwqbb7qbjiee3edqmyk3dme50p',
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
            reference: '1234554321',
            amount: 100,
        });
        const paymentId = transaction.id;
        const capture = await cko.payments.capture(paymentId, {
            reference: 'CAPTURE-REF',
        });

        expect(capture.reference).to.equal('CAPTURE-REF');
    });

    it('should capture payment with capture body', async () => {
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
                reference: 'PARTIAL-CAPTURE-REFERENCE',
                _links: {
                    payment: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_gwqbb7qbjiee3edqmyk3dme64i',
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
        const capture = await cko.payments.capture(paymentId, {
            amount: 50,
            reference: 'PARTIAL-CAPTURE-REFERENCE',
        });

        expect(capture.reference).to.equal('PARTIAL-CAPTURE-REFERENCE');
    });

    it('should throw AuthenticationError', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments/pay_7enxra4adw6evgalvfabl6nbqy/captures')
            .reply(401);

        try {
            const cko = new Checkout('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f809');
            const capture = await cko.payments.capture('pay_7enxra4adw6evgalvfabl6nbqy');
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });

    it('should throw Capture not allowed error', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments/pay_fah5j3m2oqdutkd23tq7la42qy/captures')
            .reply(403);

        try {
            const cko = new Checkout(SK);
            const capture = await cko.payments.capture('pay_fah5j3m2oqdutkd23tq7la42qy');
        } catch (err) {
            expect(err.name).to.equal('ActionNotAllowed');
        }
    });

    it('should throw payment not found error', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments/pay_fah5j3m2oqdutkd23tq7la42qp/captures')
            .reply(404);

        try {
            const cko = new Checkout(SK);
            const capture = await cko.payments.capture('pay_fah5j3m2oqdutkd23tq7la42qp');
        } catch (err) {
            expect(err.name).to.equal('NotFoundError');
        }
    });

    it('should throw payment not found error', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments/pay_fah5j3m2oqdutkd23tq7la42qp/captures')
            .reply(404);

        try {
            const cko = new Checkout(SK);
            const capture = await cko.payments.capture('pay_fah5j3m2oqdutkd23tq7la42qp');
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
            .reply(422, {
                request_id: '78ad0456-97da-47b6-8412-5f6fd59630f9',
                error_type: 'processing_error',
                error_codes: ['capture_value_greater_than_authorized'],
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
        try {
            const capture = await cko.payments.capture(paymentId);
        } catch (error) {
            expect(error).to.be.instanceOf(ValidationError);
        }
    });

    it('should use the idempotency key', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(201, {
                id: 'pay_gxjsx4kxgpeeffbknndgqtfutm',
                action_id: 'act_gxjsx4kxgpeeffbknndgqtfutm',
                amount: 100,
                currency: 'USD',
                approved: true,
                status: 'Authorized',
                auth_code: '863171',
                eci: '05',
                scheme_id: '840485025743822',
                response_code: '10000',
                response_summary: 'Approved',
                risk: { flagged: false },
                source: {
                    id: 'src_i4fwato5q2oulhqkyp4uxtjnle',
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
                customer: { id: 'cus_buuk7ahk5e3upaazlbudgzwcti' },
                processed_on: '2020-06-10T13:56:26Z',
                reference: 'ORD-IDM-1',
                processing: {
                    acquirer_transaction_id: '4997375751',
                    retrieval_reference_number: '685722610550',
                },
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_gxjsx4kxgpeeffbknndgqtfutm',
                    },
                    actions: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_gxjsx4kxgpeeffbknndgqtfutm/actions',
                    },
                    capture: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_gxjsx4kxgpeeffbknndgqtfutm/captures',
                    },
                    void: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_gxjsx4kxgpeeffbknndgqtfutm/voids',
                    },
                },
                requiresRedirect: false,
                redirectLink: undefined,
            });

        nock('https://api.sandbox.checkout.com')
            .post(/captures$/)
            .reply(202, {
                action_id: 'act_sdsnnv4ehjeujmvgby6rldgmw4',
                reference: 'my-idempotent-capture',
                _links: {
                    payment: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_gwqbb7qbjiee3edqmyk3dme64i',
                    },
                },
            });
        nock('https://api.sandbox.checkout.com')
            .post(/captures$/)
            .reply(202, {
                action_id: 'act_sdsnnv4ehjeujmvgby6rldgmw4',
                reference: 'my-idempotent-capture',
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
            const capture1 = await cko.payments.capture(
                paymentId,
                {
                    reference: 'my-idempotent-capture',
                },
                'hgavkbsdhnwljnjkn'
            );
            const capture2 = await cko.payments.capture(
                paymentId,
                {
                    reference: 'other',
                },
                'hgavkbsdhnwljnjkn'
            );

            expect(capture2.reference).to.equal('my-idempotent-capture');
        } catch (error) {
            console.log(error);
        }
    });
});
