import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Search payments', () => {
    it('should search payments with query', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments/search')
            .reply(200, {
                data: [
                    {
                        id: 'pay_mbabizu24mvu3mela5njyhpit4',
                        requested_on: '2023-08-24T14:15:22Z',
                        source: {
                            type: 'card',
                            expiry_month: '04',
                            expiry_year: '2024',
                            name: 'Jia Tsang',
                            scheme: 'Visa',
                            local_schemes: 'cartes bancaire',
                            last4: '3131',
                            fingerprint: 'B16D9C2EF0C861A8825C9BD59CCE9171D84EBC45E89CC792B5D1D2D0DDE3DAB7',
                            bin: '313131',
                            card_type: 'credit',
                            card_wallet_type: 'googlepay',
                            issuer: 'GE CAPITAL FINANCIAL, INC',
                            issuer_country: 'US',
                            avs_check: 'G'
                        },
                        amount: 10000,
                        amount_requested: 10000,
                        currency: 'GBP',
                        payment_type: 'regular',
                        processing_channel_id: 'pc_vxt6yftthv4e5flqak6w2i7rim',
                        reference: 'ORD-5023-4E89',
                        status: 'captured',
                        balances: {
                            total_authorized: 200,
                            total_captured: 150,
                            total_refunded: 50
                        },
                        '3ds': {
                            eci: '02',
                            version: '2.1.0'
                        },
                        risk: {
                            flagged: false,
                            score: '22'
                        },
                        customer: {
                            email: 'jia.tsang@checkout.com',
                            name: 'Jia Tsang'
                        },
                        billing_descriptor: {
                            name: 'Purchase',
                            city: 'London'
                        },
                        metadata: {},
                        actions: [
                            {
                                id: 'dsp_egiv5753bwmexj6ip3tlpog6gq',
                                type: 'Dispute',
                                processed_on: '2023-08-25T14:15:24.3448464ZZ',
                                status: 'Evidence Required',
                                amount: 1310,
                                reason_code: '13.1'
                            },
                            {
                                id: 'act_i3cd3w3lcooexmyrtlgulk3d7a',
                                type: 'Capture',
                                processed_on: '2023-08-24T14:15:26.3448464+00:00',
                                status: 'Approved',
                                amount: 1310,
                                auth_code: '983647',
                                response_code: '10000',
                                response_summary: 'Approved',
                                reference: 'REF-7HR-IYW',
                                processing: {
                                    acquirer_reference_number: '25651432189281252509653'
                                }
                            },
                            {
                                id: 'act_2uwlm6xyeszerhroqhfnotmiwu',
                                type: 'Authorization',
                                processed_on: '2023-08-24T14:15:25.3448464+00:00',
                                status: 'Approved',
                                amount: 1310,
                                auth_code: '983647',
                                response_code: '10000',
                                response_summary: 'Approved',
                                reference: 'REF-7HR-IYW',
                                processing: {
                                    acquirer_reference_number: '25651432189281252509653'
                                }
                            },
                            {
                                id: 'act_mscwxewzdldefh2rbbnhm6aeqi',
                                type: 'Authorization',
                                processed_on: '2023-08-24T14:15:24.3448464+00:00',
                                status: 'Pending',
                                amount: 1310,
                                reference: 'REF-7HR-IYW'
                            },
                            {
                                id: 'sid_qocmjw6skb4u3c4wd3avpot64y',
                                type: 'Authentication',
                                processed_on: '2023-08-24T14:15:3448464Z',
                                status: 'Approved',
                                authentication_experience: '3ds',
                                authentication_transaction_id: 'f05af960-f718-428d-b856-068f6cb9a3b4'
                            },
                            {
                                id: 'sid_qocmjw6skb4u3c4wd3avpot64y',
                                type: 'Authentication',
                                processed_on: '2023-08-24T14:15:22.3448464+00:00',
                                status: 'Pending',
                                reference: 'REF-7HR-IYW'
                            }
                        ]
                    }
                ],
                _links: {
                    next: {
                        href: 'https://api.checkout.com/payments/search/nGd7-altGkOfSl3fJptLxA?token=MTc0MDUwMjE2MjQxOCxlN2NiNTdmYy04MDA5LTQ3YmMtOTYzNi0zNDEyOWRmZTkwZTI'
                    }
                }
            });

        const cko = new Checkout(SK);

        const search = await cko.payments.search({
            query: "id:'pay_mbabizu24mvu3mela5njyhpit4'",
            limit: 10,
            from: '2023-08-24T14:15:22Z',
            to: '2023-08-24T14:15:22Z'
        });

        expect(search.data[0].id).to.equal('pay_mbabizu24mvu3mela5njyhpit4');
        expect(search.data[0].reference).to.equal('ORD-5023-4E89');
        expect(search.data[0].status).to.equal('captured');
    });

    it('should throw AuthenticationError', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments/search')
            .reply(401);

        try {
            const cko = new Checkout('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f809');
            await cko.payments.search({
                query: "id:'pay_mbabizu24mvu3mela5njyhpit4'",
                limit: 10,
                from: '2023-08-24T14:15:22Z',
                to: '2023-08-24T14:15:22Z'
            });
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });
}); 