import { ValidationError, NotFoundError } from '../../src/services/errors';
import { Checkout } from '../../src/index';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Klarna', () => {
    it('should create session', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/klarna-external/credit-sessions')
            .reply(201, {
                session_id: 'kcs_nogezkjesatuzj3g7ejlkzb66m',
                client_token:
                    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjgyMzA1ZWJjLWI4MTEtMzYzNy1hYTRjLTY2ZWNhMTg3NGYzZCJ9.ewogICJzZXNzaW9uX2lkIiA6ICI5OWE4M2I1Zi0yOTBiLTI4OGMtOTIwMC00MzBhMjY3NTBiZWUiLAogICJiYXNlX3VybCIgOiAiaHR0cHM6Ly9rbGFybmEtcGF5bWVudHMtZXUucGxheWdyb3VuZC5rbGFybmEuY29tL3BheW1lbnRzIiwKICAiZGVzaWduIiA6ICJrbGFybmEiLAogICJsYW5ndWFnZSIgOiAiZW4iLAogICJwdXJjaGFzZV9jb3VudHJ5IiA6ICJHQiIsCiAgInRyYWNlX2Zsb3ciIDogZmFsc2UsCiAgImVudmlyb25tZW50IiA6ICJwbGF5Z3JvdW5kIiwKICAibWVyY2hhbnRfbmFtZSIgOiAiUGxheWdyb3VuZCBEZW1vIE1lcmNoYW50IiwKICAic2Vzc2lvbl90eXBlIiA6ICJQQVlNRU5UUyIsCiAgImNsaWVudF9ldmVudF9iYXNlX3VybCIgOiAiaHR0cHM6Ly9ldS5wbGF5Z3JvdW5kLmtsYXJuYWV2dC5jb20iLAogICJleHBlcmltZW50cyIgOiBbIHsKICAgICJuYW1lIiA6ICJpbi1hcHAtc2RrLW5ldy1pbnRlcm5hbC1icm93c2VyIiwKICAgICJwYXJhbWV0ZXJzIiA6IHsKICAgICAgInZhcmlhdGVfaWQiIDogIm5ldy1pbnRlcm5hbC1icm93c2VyLWVuYWJsZSIKICAgIH0KICB9IF0KfQ.PuPoprscVa6y63tCMJvpurQcCm4-8ou0KTDerRWEY61Zz5d4-KIp-LCvUmU9WAtImigxNN-uFeS6VpFILj2D4rzV3cABli6lz4Rj9OmjX19BSiD8_GIuNkA0hSnE0KRk28AfjUpByb1WF2i_w5V_c6BUEtG-kGcA60YwDUHU9X92nO466Ox3X6NfPNOJAX1uwX8VLUdu7kCwoH5jYUqOn6f4KfMydxYA1XXr3HxvddJDoqPspeLwuFBxGYxPO721lpbYotRWNbYGJM4zLzs0g8_6vqeQ2IUf02HfwjebcwpO7MlVBrZ12L44VMDXHqZN3h2bu1vjpGSCwueEvU8RNg',
                payment_method_categories: [
                    {
                        identifier: 'pay_later',
                        name: 'Pay later in 14 days',
                        asset_urls: {
                            descriptive:
                                'https://x.klarnacdn.net/payment-method/assets/badges/generic/klarna.svg',
                            standard:
                                'https://x.klarnacdn.net/payment-method/assets/badges/generic/klarna.svg',
                        },
                    },
                    {
                        identifier: 'pay_over_time',
                        name: 'Monthly financing',
                        asset_urls: {
                            descriptive:
                                'https://x.klarnacdn.net/payment-method/assets/badges/generic/klarna.svg',
                            standard:
                                'https://x.klarnacdn.net/payment-method/assets/badges/generic/klarna.svg',
                        },
                    },
                ],
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/klarna-external/credit-sessions/kcs_nogezkjesatuzj3g7ejlkzb66m',
                    },
                },
            });

        const cko = new Checkout(SK);

        const session = await cko.klarna.createSession({
            purchase_country: 'GB',
            currency: 'GBP',
            locale: 'en-GB',
            amount: 1000,
            tax_amount: 1,
            products: [
                {
                    name: 'Brown leather belt',
                    quantity: 1,
                    unit_price: 1000,
                    tax_rate: 0,
                    total_amount: 1000,
                    total_tax_amount: 0,
                },
            ],
        });
        expect(session.session_id).to.equal('kcs_nogezkjesatuzj3g7ejlkzb66m');
    });

    it('should create session in prod', async () => {
        nock('https://api.checkout.com')
            .post('/klarna/credit-sessions')
            .reply(201, {
                session_id: 'kcs_nogezkjesatuzj3g7ejlkzb66m',
                client_token:
                    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjgyMzA1ZWJjLWI4MTEtMzYzNy1hYTRjLTY2ZWNhMTg3NGYzZCJ9.ewogICJzZXNzaW9uX2lkIiA6ICI5OWE4M2I1Zi0yOTBiLTI4OGMtOTIwMC00MzBhMjY3NTBiZWUiLAogICJiYXNlX3VybCIgOiAiaHR0cHM6Ly9rbGFybmEtcGF5bWVudHMtZXUucGxheWdyb3VuZC5rbGFybmEuY29tL3BheW1lbnRzIiwKICAiZGVzaWduIiA6ICJrbGFybmEiLAogICJsYW5ndWFnZSIgOiAiZW4iLAogICJwdXJjaGFzZV9jb3VudHJ5IiA6ICJHQiIsCiAgInRyYWNlX2Zsb3ciIDogZmFsc2UsCiAgImVudmlyb25tZW50IiA6ICJwbGF5Z3JvdW5kIiwKICAibWVyY2hhbnRfbmFtZSIgOiAiUGxheWdyb3VuZCBEZW1vIE1lcmNoYW50IiwKICAic2Vzc2lvbl90eXBlIiA6ICJQQVlNRU5UUyIsCiAgImNsaWVudF9ldmVudF9iYXNlX3VybCIgOiAiaHR0cHM6Ly9ldS5wbGF5Z3JvdW5kLmtsYXJuYWV2dC5jb20iLAogICJleHBlcmltZW50cyIgOiBbIHsKICAgICJuYW1lIiA6ICJpbi1hcHAtc2RrLW5ldy1pbnRlcm5hbC1icm93c2VyIiwKICAgICJwYXJhbWV0ZXJzIiA6IHsKICAgICAgInZhcmlhdGVfaWQiIDogIm5ldy1pbnRlcm5hbC1icm93c2VyLWVuYWJsZSIKICAgIH0KICB9IF0KfQ.PuPoprscVa6y63tCMJvpurQcCm4-8ou0KTDerRWEY61Zz5d4-KIp-LCvUmU9WAtImigxNN-uFeS6VpFILj2D4rzV3cABli6lz4Rj9OmjX19BSiD8_GIuNkA0hSnE0KRk28AfjUpByb1WF2i_w5V_c6BUEtG-kGcA60YwDUHU9X92nO466Ox3X6NfPNOJAX1uwX8VLUdu7kCwoH5jYUqOn6f4KfMydxYA1XXr3HxvddJDoqPspeLwuFBxGYxPO721lpbYotRWNbYGJM4zLzs0g8_6vqeQ2IUf02HfwjebcwpO7MlVBrZ12L44VMDXHqZN3h2bu1vjpGSCwueEvU8RNg',
                payment_method_categories: [
                    {
                        identifier: 'pay_later',
                        name: 'Pay later in 14 days',
                        asset_urls: {
                            descriptive:
                                'https://x.klarnacdn.net/payment-method/assets/badges/generic/klarna.svg',
                            standard:
                                'https://x.klarnacdn.net/payment-method/assets/badges/generic/klarna.svg',
                        },
                    },
                    {
                        identifier: 'pay_over_time',
                        name: 'Monthly financing',
                        asset_urls: {
                            descriptive:
                                'https://x.klarnacdn.net/payment-method/assets/badges/generic/klarna.svg',
                            standard:
                                'https://x.klarnacdn.net/payment-method/assets/badges/generic/klarna.svg',
                        },
                    },
                ],
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/klarna-external/credit-sessions/kcs_nogezkjesatuzj3g7ejlkzb66m',
                    },
                },
            });

        const cko = new Checkout('sk_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        const session = await cko.klarna.createSession({
            purchase_country: 'GB',
            currency: 'GBP',
            locale: 'en-GB',
            amount: 1000,
            tax_amount: 1,
            products: [
                {
                    name: 'Brown leather belt',
                    quantity: 1,
                    unit_price: 1000,
                    tax_rate: 0,
                    total_amount: 1000,
                    total_tax_amount: 0,
                },
            ],
        });
        expect(session.session_id).to.equal('kcs_nogezkjesatuzj3g7ejlkzb66m');
    });

    it('should throw ValidationError when trying to create a session', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/klarna-external/credit-sessions')
            .reply(422, {
                request_id: '0HM3MI9LCAB4D:00000003',
                error_type: 'request_invalid',
                error_codes: ['currency_required'],
            });

        try {
            const cko = new Checkout(SK);

            const session = await cko.klarna.createSession({
                purchase_country: 'GB',
                locale: 'en-GB',
                amount: 1000,
                tax_amount: 1,
                products: [
                    {
                        name: 'Brown leather belt',
                        quantity: 1,
                        unit_price: 1000,
                        tax_rate: 0,
                        total_amount: 1000,
                        total_tax_amount: 0,
                    },
                ],
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });

    it('should get session', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/klarna-external/credit-sessions/kcs_nogezkjesatuzj3g7ejlkzb66m')
            .reply(200, {
                client_token:
                    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjgyMzA1ZWJjLWI4MTEtMzYzNy1hYTRjLTY2ZWNhMTg3NGYzZCJ9.ewogICJzZXNzaW9uX2lkIiA6ICI5OWE4M2I1Zi0yOTBiLTI4OGMtOTIwMC00MzBhMjY3NTBiZWUiLAogICJiYXNlX3VybCIgOiAiaHR0cHM6Ly9rbGFybmEtcGF5bWVudHMtZXUucGxheWdyb3VuZC5rbGFybmEuY29tL3BheW1lbnRzIiwKICAiZGVzaWduIiA6ICJrbGFybmEiLAogICJsYW5ndWFnZSIgOiAiZW4iLAogICJwdXJjaGFzZV9jb3VudHJ5IiA6ICJHQiIsCiAgInRyYWNlX2Zsb3ciIDogZmFsc2UsCiAgImVudmlyb25tZW50IiA6ICJwbGF5Z3JvdW5kIiwKICAibWVyY2hhbnRfbmFtZSIgOiAiUGxheWdyb3VuZCBEZW1vIE1lcmNoYW50IiwKICAic2Vzc2lvbl90eXBlIiA6ICJQQVlNRU5UUyIsCiAgImNsaWVudF9ldmVudF9iYXNlX3VybCIgOiAiaHR0cHM6Ly9ldS5wbGF5Z3JvdW5kLmtsYXJuYWV2dC5jb20iLAogICJleHBlcmltZW50cyIgOiBbIHsKICAgICJuYW1lIiA6ICJpbi1hcHAtc2RrLW5ldy1pbnRlcm5hbC1icm93c2VyIiwKICAgICJwYXJhbWV0ZXJzIiA6IHsKICAgICAgInZhcmlhdGVfaWQiIDogIm5ldy1pbnRlcm5hbC1icm93c2VyLWVuYWJsZSIKICAgIH0KICB9IF0KfQ.PuPoprscVa6y63tCMJvpurQcCm4-8ou0KTDerRWEY61Zz5d4-KIp-LCvUmU9WAtImigxNN-uFeS6VpFILj2D4rzV3cABli6lz4Rj9OmjX19BSiD8_GIuNkA0hSnE0KRk28AfjUpByb1WF2i_w5V_c6BUEtG-kGcA60YwDUHU9X92nO466Ox3X6NfPNOJAX1uwX8VLUdu7kCwoH5jYUqOn6f4KfMydxYA1XXr3HxvddJDoqPspeLwuFBxGYxPO721lpbYotRWNbYGJM4zLzs0g8_6vqeQ2IUf02HfwjebcwpO7MlVBrZ12L44VMDXHqZN3h2bu1vjpGSCwueEvU8RNg',
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/klarna-external/credit-sessions/kcs_nogezkjesatuzj3g7ejlkzb66m',
                    },
                },
                purchase_country: 'gb',
                currency: 'gbp',
                locale: 'en-GB',
                amount: 1000,
                tax_amount: 1,
                products: [
                    {
                        type: 'physical',
                        name: 'Brown leather belt',
                        quantity: 1,
                        unit_price: 1000,
                        tax_rate: 0,
                        total_amount: 1000,
                        total_discount_amount: 0,
                        total_tax_amount: 0,
                    },
                ],
            });

        const cko = new Checkout(SK);

        const session = await cko.klarna.getSession('kcs_nogezkjesatuzj3g7ejlkzb66m');
        expect(session.purchase_country).to.equal('gb');
    });

    it('should get live session', async () => {
        nock('https://api.checkout.com')
            .get('/klarna/credit-sessions/kcs_nogezkjesatuzj3g7ejlkzb66m')
            .reply(200, {
                client_token:
                    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjgyMzA1ZWJjLWI4MTEtMzYzNy1hYTRjLTY2ZWNhMTg3NGYzZCJ9.ewogICJzZXNzaW9uX2lkIiA6ICI5OWE4M2I1Zi0yOTBiLTI4OGMtOTIwMC00MzBhMjY3NTBiZWUiLAogICJiYXNlX3VybCIgOiAiaHR0cHM6Ly9rbGFybmEtcGF5bWVudHMtZXUucGxheWdyb3VuZC5rbGFybmEuY29tL3BheW1lbnRzIiwKICAiZGVzaWduIiA6ICJrbGFybmEiLAogICJsYW5ndWFnZSIgOiAiZW4iLAogICJwdXJjaGFzZV9jb3VudHJ5IiA6ICJHQiIsCiAgInRyYWNlX2Zsb3ciIDogZmFsc2UsCiAgImVudmlyb25tZW50IiA6ICJwbGF5Z3JvdW5kIiwKICAibWVyY2hhbnRfbmFtZSIgOiAiUGxheWdyb3VuZCBEZW1vIE1lcmNoYW50IiwKICAic2Vzc2lvbl90eXBlIiA6ICJQQVlNRU5UUyIsCiAgImNsaWVudF9ldmVudF9iYXNlX3VybCIgOiAiaHR0cHM6Ly9ldS5wbGF5Z3JvdW5kLmtsYXJuYWV2dC5jb20iLAogICJleHBlcmltZW50cyIgOiBbIHsKICAgICJuYW1lIiA6ICJpbi1hcHAtc2RrLW5ldy1pbnRlcm5hbC1icm93c2VyIiwKICAgICJwYXJhbWV0ZXJzIiA6IHsKICAgICAgInZhcmlhdGVfaWQiIDogIm5ldy1pbnRlcm5hbC1icm93c2VyLWVuYWJsZSIKICAgIH0KICB9IF0KfQ.PuPoprscVa6y63tCMJvpurQcCm4-8ou0KTDerRWEY61Zz5d4-KIp-LCvUmU9WAtImigxNN-uFeS6VpFILj2D4rzV3cABli6lz4Rj9OmjX19BSiD8_GIuNkA0hSnE0KRk28AfjUpByb1WF2i_w5V_c6BUEtG-kGcA60YwDUHU9X92nO466Ox3X6NfPNOJAX1uwX8VLUdu7kCwoH5jYUqOn6f4KfMydxYA1XXr3HxvddJDoqPspeLwuFBxGYxPO721lpbYotRWNbYGJM4zLzs0g8_6vqeQ2IUf02HfwjebcwpO7MlVBrZ12L44VMDXHqZN3h2bu1vjpGSCwueEvU8RNg',
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/klarna-external/credit-sessions/kcs_nogezkjesatuzj3g7ejlkzb66m',
                    },
                },
                purchase_country: 'gb',
                currency: 'gbp',
                locale: 'en-GB',
                amount: 1000,
                tax_amount: 1,
                products: [
                    {
                        type: 'physical',
                        name: 'Brown leather belt',
                        quantity: 1,
                        unit_price: 1000,
                        tax_rate: 0,
                        total_amount: 1000,
                        total_discount_amount: 0,
                        total_tax_amount: 0,
                    },
                ],
            });

        const cko = new Checkout('sk_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        const session = await cko.klarna.getSession('kcs_nogezkjesatuzj3g7ejlkzb66m');
        expect(session.purchase_country).to.equal('gb');
    });

    it('should throw NotFound error when trying to get session', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/klarna-external/credit-sessions/kcs_nogezkjesatuzj3g7ejlkzb622')
            .reply(404);

        const cko = new Checkout(SK);

        try {
            const session = await cko.klarna.getSession('kcs_nogezkjesatuzj3g7ejlkzb622');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should capture prod', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/klarna-external/orders/pay_ij7kdgw7htredmsyoqt3jn7f3y/captures')
            .reply(202, {
                action_id: 'act_4sz4seltcrzuvcgaetumnlamq4',
            });

        const cko = new Checkout(SK);

        const session = await cko.klarna.capture('pay_ij7kdgw7htredmsyoqt3jn7f3y', {
            amount: 1000,
            reference: 'ORD-5023-4E89',
            metadata: {},
            type: 'klarna',
            klarna: {
                description: 'Your order with Checkout.com',
                products: [
                    {
                        name: 'Battery Power Pack',
                        quantity: 1,
                        unit_price: 1000,
                        tax_rate: 0,
                        total_amount: 1000,
                        total_tax_amount: 0,
                    },
                ],
                shipping_info: [
                    {
                        shipping_company: 'DHL US',
                        shipping_method: 'PickUpStore',
                        tracking_number: '63456415674545679874',
                        tracking_uri: 'http://shipping.example/findmypackage?63456415674545679874',
                        return_shipping_company: 'DHL US',
                        return_tracking_number: '93456415674545679888',
                        return_tracking_uri:
                            'http://shipping.example/findmypackage?93456415674545679888',
                    },
                ],
                shipping_delay: 0,
            },
        });
        expect(session.action_id).to.be.equal('act_4sz4seltcrzuvcgaetumnlamq4');
    });

    it('should capture', async () => {
        nock('https://api.checkout.com')
            .post('/klarna/orders/pay_ij7kdgw7htredmsyoqt3jn7f3y/captures')
            .reply(202, {
                action_id: 'act_4sz4seltcrzuvcgaetumnlamq4',
            });

        const cko = new Checkout('sk_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        const session = await cko.klarna.capture('pay_ij7kdgw7htredmsyoqt3jn7f3y', {
            amount: 1000,
            reference: 'ORD-5023-4E89',
            metadata: {},
            type: 'klarna',
            klarna: {
                description: 'Your order with Checkout.com',
                products: [
                    {
                        name: 'Battery Power Pack',
                        quantity: 1,
                        unit_price: 1000,
                        tax_rate: 0,
                        total_amount: 1000,
                        total_tax_amount: 0,
                    },
                ],
                shipping_info: [
                    {
                        shipping_company: 'DHL US',
                        shipping_method: 'PickUpStore',
                        tracking_number: '63456415674545679874',
                        tracking_uri: 'http://shipping.example/findmypackage?63456415674545679874',
                        return_shipping_company: 'DHL US',
                        return_tracking_number: '93456415674545679888',
                        return_tracking_uri:
                            'http://shipping.example/findmypackage?93456415674545679888',
                    },
                ],
                shipping_delay: 0,
            },
        });
        expect(session.action_id).to.be.equal('act_4sz4seltcrzuvcgaetumnlamq4');
    });

    it('should throw NotFoundError error when trying to capture', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/klarna-external/orders/pay_ij7kdgw7htredmsyoqt3jn7111/captures')
            .reply(404);

        const cko = new Checkout(SK);

        try {
            const session = await cko.klarna.capture('pay_ij7kdgw7htredmsyoqt3jn7111', {
                amount: 1000,
                reference: 'ORD-5023-4E89',
                metadata: {},
                type: 'klarna',
                klarna: {
                    description: 'Your order with Checkout.com',
                    products: [
                        {
                            name: 'Battery Power Pack',
                            quantity: 1,
                            unit_price: 1000,
                            tax_rate: 0,
                            total_amount: 1000,
                            total_tax_amount: 0,
                        },
                    ],
                    shipping_info: [
                        {
                            shipping_company: 'DHL US',
                            shipping_method: 'PickUpStore',
                            tracking_number: '63456415674545679874',
                            tracking_uri:
                                'http://shipping.example/findmypackage?63456415674545679874',
                            return_shipping_company: 'DHL US',
                            return_tracking_number: '93456415674545679888',
                            return_tracking_uri:
                                'http://shipping.example/findmypackage?93456415674545679888',
                        },
                    ],
                    shipping_delay: 0,
                },
            });
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should void', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/klarna-external/orders/pay_ij7kdgw7htredmsyoqt3jn7f3y/voids')
            .reply(202, {
                action_id: 'act_v6572a7elpuupbaljmoi4tk3ma',
            });

        const cko = new Checkout(SK);

        const klarna = await cko.klarna.void('pay_ij7kdgw7htredmsyoqt3jn7f3y', {
            reference: 'ORD-5023-4E89',
            metadata: {},
        });
        expect(klarna.action_id).to.be.equal('act_v6572a7elpuupbaljmoi4tk3ma');
    });

    it('should void prod', async () => {
        nock('https://api.checkout.com')
            .post('/klarna/orders/pay_ij7kdgw7htredmsyoqt3jn7f3y/voids')
            .reply(202, {
                action_id: 'act_v6572a7elpuupbaljmoi4tk3ma',
            });

        const cko = new Checkout('sk_0b9b5db6-f223-49d0-b68f-f6643dd4f808');

        const klarna = await cko.klarna.void('pay_ij7kdgw7htredmsyoqt3jn7f3y', {
            reference: 'ORD-5023-4E89',
            metadata: {},
        });
        expect(klarna.action_id).to.be.equal('act_v6572a7elpuupbaljmoi4tk3ma');
    });

    it('should throw NotFoundError error when trying to void', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/klarna-external/orders/pay_ij7kdgw7htredmsyoqt3jn7111/voids')
            .reply(404);

        const cko = new Checkout(SK);

        try {
            const session = await cko.klarna.void('pay_ij7kdgw7htredmsyoqt3jn7111', {
                reference: 'ORD-5023-4E89',
                metadata: {},
            });
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
