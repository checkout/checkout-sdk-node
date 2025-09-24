import { expect } from 'chai';
import nock from 'nock';
import { BadGateway, TooManyRequestsError, ValidationError, ValueError, } from '../../src/services/errors.js';
import { Checkout } from '../../src/index.js';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';
const SK_NEW = 'sk_sbox_n2dvcqjweokrqm4q7hlfcfqtn4m';

describe('Request a payment or payout', () => {
    it('should perform normal payment request with a Card Source', async () => {
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
                            href: 'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u',
                        },
                        actions: {
                            href: 'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/actions',
                        },
                        capture: {
                            href: 'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/captures',
                        },
                        void: {
                            href: 'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/voids',
                        },
                    },
                },
                {
                    'cko-request-id': ['1695a930-09cf-4db0-a91e-a772e6ee076g'],
                    'cko-version': ['3.31.4'],
                }
            );

        const cko = new Checkout(SK);

        const transaction = await cko.payments.request({
            source: {
                type: 'card',
                number: '4242424242424242',
                expiry_month: 6,
                expiry_year: 2029,
                cvv: '100',
            },
            currency: 'USD',
            amount: 100,
        });

        /* eslint-disable no-unused-expressions */
        expect(transaction.approved).to.be.true;
        expect(transaction.risk.flagged).to.be.false;
        expect(transaction.requiresRedirect).to.be.false;
    });

    it('should perform normal payment request with a Card Source with NAS oAuth and re-use the access token if not expired', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token:
                'eyJhbGciOiJSUzI1NiIsImtpZCI6ImFybjphd3M6a21zOmV1LXdlc3QtMTo2ODY0OTY3NDc3MTU6a2V5LzAyYThmYWM5LWE5MjItNGNkNy05MDk1LTg0ZjA5YjllNTliZCIsInR5cCI6ImF0K2p3dCJ9.eyJuYmYiOjE2NDA1NTMzNDksImV4cCI6MTY0MDU1Njk0OSwiaXNzIjoiaHR0cHM6Ly9hY2Nlc3Muc2FuZGJveC5jaGVja291dC5jb20iLCJhdWQiOiJnYXRld2F5IiwiY2xpZW50X2lkIjoiYWNrX3Z2emhvYWk0NjZzdTNqM3ZieGI0N3RzNW9lIiwiY2tvX2NsaWVudF9pZCI6ImNsaV9nNnJvZ2IzaGhmZXUzZ2h0eGN2M2J3NHFweSIsImNrb19lbnRpdHlfaWQiOiJlbnRfZGppZ2NxeDRjbG11Zm8yc2FzZ29tZ3Bxc3EiLCJqdGkiOiI3RDRCQTRBNEJBQUYzQ0E5MjYwMzlDRTNGQTc1ODVEMCIsImlhdCI6MTY0MDU1MzM0OSwic2NvcGUiOlsiZ2F0ZXdheSJdfQ.U4S2YQDZtRb5WsKA6P8eiHyoqH_KN_1MabiNG5LAOeyYwRiIdyuzWJlYJg-wJlly84Eo68P1rcEB0Pac90PRiDBfSPNh0rIFJvFrA1fHE95EWjwER8UBvYT6yr-yI4JlrTnjeU6f5mJpxWbuN2ywE36x5eWPBdBs3w_j_x8FU62-UYwPOy5LIyZLR_JRxHMU81r7chOD9113CTGzJG9CGzKDMN53iciLdLPXUCFH2AlLHm9-YFh46WMIz85i4nVG0aKI_fIW9gjsLIvG0j-8shf-k4D1LLP0R3juX6twULVbrDuZqacC0TqGI6bAahVJ37Old74He7Ft6j3cx9Hi8A',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'gateway',
        });

        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .times(2)
            .reply(201, {
                id: 'pay_gjulv7byhhwerb3jyx2547xlme',
                action_id: 'act_t4u4g5ovx5huhk4ljrtyoo7eji',
                amount: 6540,
                currency: 'USD',
                approved: true,
                status: 'Authorized',
                auth_code: '655071',
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
                    id: 'src_d5vdj6uzrktufj7tfzqewapd6u',
                    type: 'card',
                    expiry_month: 7,
                    expiry_year: 2028,
                    scheme: 'Visa',
                    last4: '4242',
                    fingerprint: 'A8E3A7296143D9EFA0DBF46139A0BF3138C5A824072E88C4E0C2033AB40C9A1D',
                    bin: '424242',
                    card_type: 'CREDIT',
                    card_category: 'CONSUMER',
                    issuer: 'JPMORGAN CHASE BANK NA',
                    issuer_country: 'US',
                    product_id: 'A',
                    product_type: 'Visa Traditional',
                    avs_check: 'G',
                    payment_account_reference: 'V001130220276449472',
                },
                customer: {
                    id: 'cus_3dapnnm2l6ue3eagk5lufxt3am',
                    email: 'johnny.shrewd@gmail.com',
                    name: 'Johnny Shrewd',
                },
                processed_on: '2021-12-26T21:16:40.079866Z',
                reference: 'ORD-5023-4E89',
                scheme_id: '204565197912882',
                processing: {
                    acquirer_transaction_id: '191020606571494805360',
                    retrieval_reference_number: '938688307590',
                },
                expires_on: '2022-01-25T21:16:40.079866Z',
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_gjulv7byhhwerb3jyx2547xlme',
                    },
                    actions: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_gjulv7byhhwerb3jyx2547xlme/actions',
                    },
                    capture: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_gjulv7byhhwerb3jyx2547xlme/captures',
                    },
                    void: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_gjulv7byhhwerb3jyx2547xlme/voids',
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

        const transaction = await cko.payments.request({
            source: {
                type: 'card',
                number: '4242424242424242',
                expiry_month: 6,
                expiry_year: 2029,
                cvv: '100',
            },
            currency: 'USD',
            amount: 100,
            processing_channel_id: 'pc_zs5fqhybzc2e3jmq3efvybybpq',
        });

        expect(transaction.approved).to.be.true;
        expect(transaction.risk.flagged).to.be.false;
        expect(transaction.requiresRedirect).to.be.false;

        let accessToken = cko.config.accessToken;

        const transaction2 = await cko.payments.request({
            source: {
                type: 'card',
                number: '4242424242424242',
                expiry_month: 6,
                expiry_year: 2029,
                cvv: '101',
            },
            currency: 'USD',
            amount: 100,
            processing_channel_id: 'pc_zs5fqhybzc2e3jmq3efvybybpq',
        });

        expect(cko.config.accessToken).to.equal(accessToken);
    });

    it('should request a new access token when doing a payment with Card Source, if the previous access token is expired', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').times(2).reply(201, {
            access_token:
                'eyJhbGciOiJSUzI1NiIsImtpZCI6ImFybjphd3M6a21zOmV1LXdlc3QtMTo2ODY0OTY3NDc3MTU6a2V5LzAyYThmYWM5LWE5MjItNGNkNy05MDk1LTg0ZjA5YjllNTliZCIsInR5cCI6ImF0K2p3dCJ9.eyJuYmYiOjE2NDA1NTMzNDksImV4cCI6MTY0MDU1Njk0OSwiaXNzIjoiaHR0cHM6Ly9hY2Nlc3Muc2FuZGJveC5jaGVja291dC5jb20iLCJhdWQiOiJnYXRld2F5IiwiY2xpZW50X2lkIjoiYWNrX3Z2emhvYWk0NjZzdTNqM3ZieGI0N3RzNW9lIiwiY2tvX2NsaWVudF9pZCI6ImNsaV9nNnJvZ2IzaGhmZXUzZ2h0eGN2M2J3NHFweSIsImNrb19lbnRpdHlfaWQiOiJlbnRfZGppZ2NxeDRjbG11Zm8yc2FzZ29tZ3Bxc3EiLCJqdGkiOiI3RDRCQTRBNEJBQUYzQ0E5MjYwMzlDRTNGQTc1ODVEMCIsImlhdCI6MTY0MDU1MzM0OSwic2NvcGUiOlsiZ2F0ZXdheSJdfQ.U4S2YQDZtRb5WsKA6P8eiHyoqH_KN_1MabiNG5LAOeyYwRiIdyuzWJlYJg-wJlly84Eo68P1rcEB0Pac90PRiDBfSPNh0rIFJvFrA1fHE95EWjwER8UBvYT6yr-yI4JlrTnjeU6f5mJpxWbuN2ywE36x5eWPBdBs3w_j_x8FU62-UYwPOy5LIyZLR_JRxHMU81r7chOD9113CTGzJG9CGzKDMN53iciLdLPXUCFH2AlLHm9-YFh46WMIz85i4nVG0aKI_fIW9gjsLIvG0j-8shf-k4D1LLP0R3juX6twULVbrDuZqacC0TqGI6bAahVJ37Old74He7Ft6j3cx9Hi8A',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'gateway',
        });

        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .times(2)
            .reply(201, {
                id: 'pay_gjulv7byhhwerb3jyx2547xlme',
                action_id: 'act_t4u4g5ovx5huhk4ljrtyoo7eji',
                amount: 6540,
                currency: 'USD',
                approved: true,
                status: 'Authorized',
                auth_code: '655071',
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
                    id: 'src_d5vdj6uzrktufj7tfzqewapd6u',
                    type: 'card',
                    expiry_month: 7,
                    expiry_year: 2028,
                    scheme: 'Visa',
                    last4: '4242',
                    fingerprint: 'A8E3A7296143D9EFA0DBF46139A0BF3138C5A824072E88C4E0C2033AB40C9A1D',
                    bin: '424242',
                    card_type: 'CREDIT',
                    card_category: 'CONSUMER',
                    issuer: 'JPMORGAN CHASE BANK NA',
                    issuer_country: 'US',
                    product_id: 'A',
                    product_type: 'Visa Traditional',
                    avs_check: 'G',
                    payment_account_reference: 'V001130220276449472',
                },
                customer: {
                    id: 'cus_3dapnnm2l6ue3eagk5lufxt3am',
                    email: 'johnny.shrewd@gmail.com',
                    name: 'Johnny Shrewd',
                },
                processed_on: '2021-12-26T21:16:40.079866Z',
                reference: 'ORD-5023-4E89',
                scheme_id: '204565197912882',
                processing: {
                    acquirer_transaction_id: '191020606571494805360',
                    retrieval_reference_number: '938688307590',
                },
                expires_on: '2022-01-25T21:16:40.079866Z',
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_gjulv7byhhwerb3jyx2547xlme',
                    },
                    actions: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_gjulv7byhhwerb3jyx2547xlme/actions',
                    },
                    capture: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_gjulv7byhhwerb3jyx2547xlme/captures',
                    },
                    void: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_gjulv7byhhwerb3jyx2547xlme/voids',
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

        const transaction = await cko.payments.request({
            source: {
                type: 'card',
                number: '4242424242424242',
                expiry_month: 6,
                expiry_year: 2029,
                cvv: '100',
            },
            currency: 'USD',
            amount: 100,
            processing_channel_id: 'pc_zs5fqhybzc2e3jmq3efvybybpq',
        });

        expect(transaction.approved).to.be.true;
        expect(transaction.requiresRedirect).to.be.false;

        let token1 = cko.config.access.token;

        //   hardcode the accessToken expiry to be in the past
        cko.config.access.expires = new Date(new Date().getTime() - 3800);
        const transaction2 = await cko.payments.request({
            source: {
                type: 'card',
                number: '4242424242424242',
                expiry_month: 6,
                expiry_year: 2029,
                cvv: '101',
            },
            currency: 'USD',
            amount: 100,
            processing_channel_id: 'pc_zs5fqhybzc2e3jmq3efvybybpq',
        });
        let token2 = cko.config.access.token;
        expect(cko.config.token1).to.not.equals(token2);
    });

    it('should perform normal payment request with a Card Source and idempotencyKey', async () => {
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
                            href: 'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u',
                        },
                        actions: {
                            href: 'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/actions',
                        },
                        capture: {
                            href: 'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/captures',
                        },
                        void: {
                            href: 'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/voids',
                        },
                    },
                },
                {
                    'cko-request-id': ['1695a930-09cf-4db0-a91e-a772e6ee076g'],
                    'cko-version': ['3.31.4'],
                }
            );

        const cko = new Checkout(SK);

        const transaction = await cko.payments.request(
            {
                source: {
                    type: 'card',
                    number: '4242424242424242',
                    expiry_month: 6,
                    expiry_year: 2029,
                    cvv: '100',
                },
                currency: 'USD',
                amount: 100,
            },
            '6ndp5facelxurne7gloxkxm57u'
        );

        /* eslint-disable no-unused-expressions */
        expect(transaction.approved).to.be.true;
        expect(transaction.risk.flagged).to.be.false;
        expect(transaction.requiresRedirect).to.be.false;
    });

    it('should perform an incremental auth with the idempotencyKey', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(201, {
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
                },
                customer: { id: 'cus_leu5pp2zshpuvbt6yjxl5xcrdi' },
                processed_on: '2019-06-09T22:43:54Z',
                reference: undefined,
                eci: '05',
                scheme_id: '638284745624527',
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u',
                    },
                    actions: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/actions',
                    },
                    capture: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/captures',
                    },
                    void: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/voids',
                    },
                },
            });

        nock('https://api.sandbox.checkout.com')
            .post('/payments/pay_6ndp5facelxurne7gloxkxm57u/authorizations')
            .times(2)
            .reply(201, {
                action_id: 'act_ps6ijecais2ehdlmwppbvforga',
                amount: 50,
                currency: 'GBP',
                approved: true,
                auth_code: '765197',
                scheme_id: '719152626983275',
                response_code: '10000',
                response_summary: 'Approved',
                risk: {
                    flagged: false,
                },
                processed_on: '2022-10-26T21:22:34.7788032Z',
                processing: {
                    acquirer_transaction_id: '803585515470323833476',
                    retrieval_reference_number: '513716644287',
                },
                balances: {
                    total_authorized: 160,
                    total_voided: 0,
                    available_to_void: 160,
                    total_captured: 0,
                    available_to_capture: 160,
                    total_refunded: 0,
                    available_to_refund: 0,
                },
                expires_on: '2022-11-02T21:16:44.036567Z',
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_4xwclelllavujdoxfopiuhygou',
                    },
                    actions: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_4xwclelllavujdoxfopiuhygou/actions',
                    },
                    capture: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_4xwclelllavujdoxfopiuhygou/captures',
                    },
                    void: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_4xwclelllavujdoxfopiuhygou/voids',
                    },
                    authorizations: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_4xwclelllavujdoxfopiuhygou/authorizations',
                    },
                },
            });

        const cko = new Checkout(SK_NEW);

        const transaction = await cko.payments.request({
            source: {
                type: 'card',
                number: '42424242424242',
                expiry_month: 11,
                expiry_year: 2024,
                cvv: '100',
            },
            amount: 10,
            currency: 'GBP',
            capture: false,
            payment_type: 'Regular',
            authorization_type: 'Estimated',
            processing_channel_id: 'pc_zs5fqhybzc2e3jmq3efvybybpq',
        });
        const increment1 = await cko.payments.increment(
            transaction.id,
            {
                amount: 50,
            },
            'fuvjukygbkyubhhjb'
        );

        const act = increment1.action_id;

        const increment2 = await cko.payments.increment(
            transaction.id,
            {
                amount: 50,
            },
            'fuvjukygbkyubhhjb'
        );
        expect(act).to.equal(increment2.action_id);
    });

    it('should perform 3DS payment request with a Card Source', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(202, {
                id: 'pay_k72n4u433mierlthuim5oc5syu',
                status: 'Pending',
                customer: { id: 'cus_6artgoevd77u7ojah2wled32sa' },
                '3ds': { downgraded: false, enrolled: 'Y' },
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_k72n4u433mierlthuim5oc5syu',
                    },
                    redirect: {
                        href: 'https://3ds2-sandbox.ckotech.co/interceptor/3ds_a25l6ocl6luebnvyed4s3xvxcu',
                    },
                },
                headers: {
                    'cko-request-id': 'f02e7328-b7fc-4993-b9f6-4c913421f57e',
                    'cko-version': '3.34.5',
                },
                requiresRedirect: true,
            });

        const cko = new Checkout(SK);

        const transaction = await cko.payments.request({
            source: {
                type: 'card',
                number: '4242424242424242',
                expiry_month: 6,
                expiry_year: 2029,
                cvv: '100',
            },
            currency: 'USD',
            '3ds': {
                enabled: true,
            },
            amount: 100,
        });

        /* eslint-disable no-unused-expressions */
        expect(transaction.requiresRedirect).to.be.true;
        expect(transaction.redirectLink).to.be.a('string');
    });

    it('should perform payout with type', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(201, {
                id: 'pay_3a3adlwxdlc43jdhetv3muzf7e',
                action_id: 'act_3a3adlwxdlc43jdhetv3muzf7e',
                amount: 1000,
                currency: 'USD',
                approved: true,
                status: 'Paid',
                auth_code: '011724',
                response_code: '10000',
                response_summary: 'Approved',
                destination: {
                    id: 'src_widnagbskxge5g3soxqto4sf5q',
                    type: 'card',
                    expiry_month: 10,
                    expiry_year: 2025,
                    name: 'Johny Smith',
                    scheme: 'Visa',
                    last4: '4242',
                    fingerprint: 'D3E048C1E888DD2903D37A8EB3BFAC60674754BEE23A3B1C4CF3B8D6D7FFD146',
                    bin: '424242',
                    card_type: 'Credit',
                    card_category: 'Consumer',
                    issuer: 'JPMORGAN CHASE BANK NA',
                    issuer_country: 'US',
                    product_id: 'A',
                    product_type: 'Visa Traditional',
                },
                customer: {
                    id: 'cus_z3ajkz6g5m4efjufbd7i3lxxuu',
                },
                processed_on: '2020-01-29T10:20:21Z',
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_3a3adlwxdlc43jdhetv3muzf7e',
                    },
                    actions: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_3a3adlwxdlc43jdhetv3muzf7e/actions',
                    },
                },
            });

        const cko = new Checkout(SK);

        const transaction = await cko.payments.request({
            destination: {
                number: '4242424242424242',
                expiry_month: 6,
                expiry_year: 2029,
                first_name: 'John',
                last_name: 'Smith',
            },
            currency: 'USD',
            amount: 100,
        });

        /* eslint-disable no-unused-expressions */
        expect(transaction.approved).to.be.true;
        expect(transaction.requiresRedirect).to.be.false;
    });

    it('should perform payout with mentioned type', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(201, {
                id: 'pay_3a3adlwxdlc43jdhetv3muzf7e',
                action_id: 'act_3a3adlwxdlc43jdhetv3muzf7e',
                amount: 1000,
                currency: 'USD',
                approved: true,
                status: 'Paid',
                auth_code: '011724',
                response_code: '10000',
                response_summary: 'Approved',
                destination: {
                    id: 'src_widnagbskxge5g3soxqto4sf5q',
                    type: 'card',
                    expiry_month: 10,
                    expiry_year: 2025,
                    name: 'Johny Smith',
                    scheme: 'Visa',
                    last4: '4242',
                    fingerprint: 'D3E048C1E888DD2903D37A8EB3BFAC60674754BEE23A3B1C4CF3B8D6D7FFD146',
                    bin: '424242',
                    card_type: 'Credit',
                    card_category: 'Consumer',
                    issuer: 'JPMORGAN CHASE BANK NA',
                    issuer_country: 'US',
                    product_id: 'A',
                    product_type: 'Visa Traditional',
                },
                customer: {
                    id: 'cus_z3ajkz6g5m4efjufbd7i3lxxuu',
                },
                processed_on: '2020-01-29T10:20:21Z',
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_3a3adlwxdlc43jdhetv3muzf7e',
                    },
                    actions: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_3a3adlwxdlc43jdhetv3muzf7e/actions',
                    },
                },
            });

        const cko = new Checkout(SK);

        const transaction = await cko.payments.request({
            destination: {
                type: 'card',
                number: '4242424242424242',
                expiry_month: 6,
                expiry_year: 2029,
                first_name: 'John',
                last_name: 'Smith',
            },
            currency: 'USD',
            amount: 100,
        });

        /* eslint-disable no-unused-expressions */
        expect(transaction.approved).to.be.true;
        expect(transaction.requiresRedirect).to.be.false;
    });

    it('should perform payout with dynamically determined token type', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(422, {
                request_id: '8daac099-b8e5-428c-8374-11c9c0f42d2f',
                error_type: 'processing_error',
                error_codes: ['token_expired'],
            });

        try {
            const cko = new Checkout(SK);

            const transaction = await cko.payments.request({
                destination: {
                    token: 'tok_2znmhtc7gybuxanfkqtmrbh26u',
                    first_name: 'John',
                    last_name: 'Smith',
                },
                currency: 'USD',
                amount: 100,
            });
        } catch (error) {
            /* eslint-disable no-unused-expressions */
            expect(error.body.error_codes[0]).to.equal('token_expired');
        }
    });

    it('should perform payout with dynamically determined id type', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(201, {
                id: 'pay_7h44sudteoc4jdu7hjcto6bs6a',
                action_id: 'act_7h44sudteoc4jdu7hjcto6bs6a',
                amount: 1000,
                currency: 'USD',
                approved: true,
                status: 'Paid',
                auth_code: '417361',
                response_code: '10000',
                response_summary: 'Approved',
                destination: {
                    id: 'src_yiorsxzfwy4uzkl5excqum4r6m',
                    type: 'card',
                    expiry_month: 10,
                    expiry_year: 2029,
                    scheme: 'Visa',
                    last4: '4242',
                    fingerprint: '511233E01627B17FB2823C37A8AEFBEB71B673671756B30B646111EAC2A70E86',
                    bin: '424242',
                    card_type: 'Credit',
                    card_category: 'Consumer',
                    issuer: 'JPMORGAN CHASE BANK NA',
                    issuer_country: 'US',
                    product_id: 'A',
                    product_type: 'Visa Traditional',
                },
                customer: {
                    id: 'cus_4tq74vh6u7zuvnnvkzimznkauu',
                },
                processed_on: '2020-01-29T11:45:27Z',
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_7h44sudteoc4jdu7hjcto6bs6a',
                    },
                    actions: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_7h44sudteoc4jdu7hjcto6bs6a/actions',
                    },
                },
            });

        const cko = new Checkout(SK);

        const transaction = await cko.payments.request({
            destination: {
                id: 'src_yiorsxzfwy4uzkl5excqum4r6m',
                first_name: 'John',
                last_name: 'Smith',
            },
            currency: 'USD',
            amount: 100,
        });
        /* eslint-disable no-unused-expressions */
        expect(transaction.approved).to.be.true;
        expect(transaction.requiresRedirect).to.be.false;
    });

    it('should perform normal payment request with Sofort', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(202, {
                id: 'pay_lz7qli3tgjkeza44waf2kqljam',
                status: 'Pending',
                customer: { id: 'cus_un2lucrpzhbutpq6mhmkwshlrm' },
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_lz7qli3tgjkeza44waf2kqljam',
                    },
                    redirect: {
                        href: 'https://sandbox.checkout.com/LP.Core/api/payment/165412',
                    },
                },
                headers: {
                    'cko-request-id': '3e62dcc5-0581-4fdb-a8ca-a62e87466314',
                    'cko-version': '3.34.5',
                },
                requiresRedirect: true,
            });

        const cko = new Checkout(SK);

        const transaction = await cko.payments.request({
            source: {
                type: 'sofort',
            },
            currency: 'EUR',
            amount: 100,
        });
        /* eslint-disable no-unused-expressions */
        expect(transaction.requiresRedirect).to.be.true;
    });

    it('should perform 3dS payment request with a Card Source', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(202, {
                id: 'pay_y3oqhf46pyzuxjbcn2giaqnb44',
                status: 'Pending',
                reference: 'ORD-5023-4E89',
                customer: {
                    id: 'cus_y3oqhf46pyzuxjbcn2giaqnb44',
                    email: 'jokershere@gmail.com',
                    name: 'Jack Napier',
                },
                '3ds': {
                    downgraded: false,
                    enrolled: 'Y',
                },
                _links: {
                    self: {},
                    redirect: {},
                },
            });

        const cko = new Checkout(SK);

        const transaction = await cko.payments.request({
            source: {
                type: 'card',
                number: '4242424242424242',
                expiry_month: 6,
                expiry_year: 2029,
                cvv: '100',
            },
            currency: 'USD',
            amount: 100,
            '3ds': {
                enabled: true,
            },
        });

        expect(transaction.requiresRedirect).to.be.true;
        expect(transaction.status).to.equal('Pending');
    });

    it('should decline payment request with a Card Source', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(201, {
                isPending: [Function],
                id: 'pay_idt2rgacxglehoyhiu7fu3e4we',
                action_id: 'act_idt2rgacxglehoyhiu7fu3e4we',
                amount: 1005,
                currency: 'USD',
                approved: false,
                status: 'Declined',
                auth_code: '000000',
                response_code: '20005',
                response_summary: 'Declined - Do Not Honour',
                '3ds': undefined,
                risk: { flagged: false },
                source: {
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
                },
                customer: { id: 'cus_xthycmncbhmujauqjebmhwkwle' },
                processed_on: '2019-06-09T22:54:00Z',
                reference: undefined,
                eci: '05',
                scheme_id: '638284745624527',
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_idt2rgacxglehoyhiu7fu3e4we',
                    },
                    actions: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_idt2rgacxglehoyhiu7fu3e4we/actions',
                    },
                },
            });

        const cko = new Checkout(SK);

        const transaction = await cko.payments.request({
            source: {
                type: 'card',
                number: '4242424242424242',
                expiry_month: 6,
                expiry_year: 2029,
                cvv: '100',
            },
            currency: 'USD',
            amount: 1005,
        });

        expect(transaction.approved).to.be.false;
        expect(transaction.risk.flagged).to.be.false;
        expect(transaction.requiresRedirect).to.be.false;
        expect(transaction.approved).to.be.false;
        expect(transaction.status).to.equal('Declined');
        expect(transaction.status).to.equal('Declined');
    });

    it('should timeout payment request with a Card Source', async () => {
        nock('https://api.sandbox.checkout.com').post('/payments').delay(20).reply(201, {});

        try {
            const cko = new Checkout(SK, {
                timeout: 10,
            });

            const transaction = await cko.payments.request({
                source: {
                    type: 'card',
                    number: '4242424242424242',
                    expiry_month: 6,
                    expiry_year: 2029,
                    cvv: '100',
                },
                currency: 'USD',
                amount: 100,
            });
        } catch (err) {
            expect(err.name).to.equal('ApiTimeout');
            expect(err.http_code).to.equal(408);
        }
    });

    it('should error out with API Error for payment request with a Card Source', async () => {
        nock('https://api.sandbox.checkout.com').post('/payments').reply(500, {
            error: 'error',
        });
        try {
            const cko = new Checkout(SK);

            const transaction = await cko.payments.request({
                source: {
                    type: 'card',
                    number: '4242424242424242',
                    expiry_month: 6,
                    expiry_year: 2029,
                    cvv: '100',
                },
                currency: 'USD',
                amount: 100,
            });
        } catch (err) {
            expect(err.name).to.equal('API Error');
        }
    });

    it('should throw AuthenticationError', async () => {
        nock('https://api.sandbox.checkout.com').post('/payments').reply(401);
        try {
            const cko = new Checkout('sk_test_43ed9a7f-4799-461d-b201-a70507878000');

            const transaction = await cko.payments.request({
                source: {
                    type: 'card',
                    number: '4242424242424242',
                    expiry_month: 6,
                    expiry_year: 2029,
                    cvv: '100',
                },
                currency: 'USD',
                amount: 100,
            });
        } catch (err) {
            expect(err.name).to.equal('AuthenticationError');
        }
    });

    it('should throw ValidationError', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(422, {
                request_id: '0HL80RJLS76I7',
                error_type: 'request_invalid',
                error_codes: ['payment_source_required'],
            });

        try {
            const cko = new Checkout(SK);

            const transaction = await cko.payments.request({
                source: {
                    type: 'card',
                    number: '4242424242424242',
                    expiry_month: 6,
                    expiry_year: 2000,
                    cvv: '100',
                },
                currency: 'USD',
                amount: 100,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });

    it('should throw TooManyRequestsError', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(429, {
                request_id: '0HL80RJLS76I7',
                error_type: 'request_invalid',
                error_codes: ['payment_source_required'],
            });
        try {
            const cko = new Checkout(SK);

            const transaction = await cko.payments.request({
                source: {
                    type: 'card',
                    number: '4242424242424242',
                    expiry_month: 6,
                    expiry_year: 2029,
                    cvv: '100',
                },
                currency: 'USD',
                amount: 100,
            });
        } catch (err) {
            expect(err.http_code).to.equal(429);
            expect(err).to.be.instanceOf(TooManyRequestsError);
        }
    });

    it('should throw BadGateway', async () => {
        nock('https://api.sandbox.checkout.com').post('/payments').reply(502);

        try {
            const cko = new Checkout(SK);

            const transaction = await cko.payments.request({
                source: {
                    type: 'card',
                    number: '4242424242424242',
                    expiry_month: 6,
                    expiry_year: 2029,
                    cvv: '100',
                },
                currency: 'USD',
                amount: 100,
            });
        } catch (err) {
            expect(err.http_code).to.equal(502);
            expect(err).to.be.instanceOf(BadGateway);
        }
    });

    it('should reject decimal value', async () => {
        try {
            const cko = new Checkout(SK);

            const transaction = await cko.payments.request({
                source: {
                    type: 'card',
                    number: '4242424242424242',
                    expiry_month: 6,
                    expiry_year: 2029,
                    cvv: '100',
                },
                currency: 'USD',
                amount: 12.3,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValueError);
        }
    });

    it('should reject invalid currency', async () => {
        try {
            const cko = new Checkout(SK);

            const transaction = await cko.payments.request({
                source: {
                    type: 'card',
                    number: '4242424242424242',
                    expiry_month: 6,
                    expiry_year: 2029,
                    cvv: '100',
                },
                currency: 'ABC',
                amount: 123,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValueError);
        }
    });

    it('should reject invalid payment type', async () => {
        try {
            const cko = new Checkout(SK);

            const transaction = await cko.payments.request({
                source: {
                    type: 'card',
                    number: '4242424242424242',
                    expiry_month: 6,
                    expiry_year: 2029,
                    cvv: '100',
                },
                currency: 'USD',
                payment_type: 'Nice',
                amount: 123,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValueError);
        }
    });

    it('should reject source type in non string format', async () => {
        try {
            const cko = new Checkout(SK);

            const transaction = await cko.payments.request({
                source: {
                    type: 1,
                    number: '4242424242424242',
                    expiry_month: 6,
                    expiry_year: 2029,
                    cvv: '100',
                },
                currency: 'USD',
                amount: 123,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValueError);
        }
    });

    it('should reject reference in non string format', async () => {
        try {
            const cko = new Checkout(SK);

            const transaction = await cko.payments.request({
                source: {
                    number: '4242424242424242',
                    expiry_month: 6,
                    expiry_year: 2029,
                    cvv: '100',
                },
                currency: 'USD',
                reference: 123456,
                amount: 123,
            });
            throw new Error();
        } catch (err) {
            expect(err).to.be.instanceOf(ValueError);
        }
    });

    it('should dynamically determine source type for full cards', async () => {
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
                            href: 'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u',
                        },
                        actions: {
                            href: 'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/actions',
                        },
                        capture: {
                            href: 'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/captures',
                        },
                        void: {
                            href: 'https://api.sandbox.checkout.com/payments/pay_6ndp5facelxurne7gloxkxm57u/voids',
                        },
                    },
                },
                {
                    'cko-request-id': ['1695a930-09cf-4db0-a91e-a772e6ee076g'],
                    'cko-version': ['3.31.4'],
                }
            );

        const cko = new Checkout(SK);

        const transaction = await cko.payments.request({
            source: {
                number: '4242424242424242',
                expiry_month: 6,
                expiry_year: 2029,
                cvv: '100',
            },
            currency: 'USD',
            reference: 'test',
            amount: 123,
        });
        expect(transaction.approved).to.be.true;
    });

    it('should dynamically determine source type for token', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(422, {
                request_id: '6b3300a8-fe99-4ab3-8332-43cd7ecb58a7',
                error_type: 'processing_error',
                error_codes: ['token_expired'],
            });

        try {
            const cko = new Checkout(SK);

            const transaction = await cko.payments.request({
                source: {
                    token: 'tok_3tcawwfztjfurk53f5cfgrms7i',
                },
                currency: 'USD',
                reference: 'test',
                amount: 123,
            });
        } catch (error) {
            expect(error.body.error_codes[0]).to.equal('token_expired');
        }
    });

    it('should dynamically determine source type for customer', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(201, {
                id: 'pay_p3ikwzsojghe5i6zoilqjqi2nu',
                action_id: 'act_p3ikwzsojghe5i6zoilqjqi2nu',
                amount: 1000,
                currency: 'USD',
                approved: true,
                status: 'Authorized',
                auth_code: '259975',
                eci: '05',
                scheme_id: '350093331672308',
                response_code: '10000',
                response_summary: 'Approved',
                risk: {
                    flagged: false,
                },
                source: {
                    id: 'src_ebcpiv3zdnmejkcgf5mpavla6e',
                    type: 'card',
                    billing_address: {
                        address_line1: 'asdas asd',
                        address_line2: 'fff fff',
                    },
                    expiry_month: 6,
                    expiry_year: 2028,
                    scheme: 'Visa',
                    last4: '4242',
                    fingerprint: '35D40AFFDC82BCAC9890181E14655B05D8924C0B4986D29F99D13946A3B59513',
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
                customer: {
                    id: 'cus_acrd33wxljeunmock26hfglfxq',
                    email: 'aaaaaaa@gmail.com',
                },
                processed_on: '2020-01-29T00:45:49Z',
                processing: {
                    acquirer_transaction_id: '1621525145',
                    retrieval_reference_number: '205732928440',
                },
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_p3ikwzsojghe5i6zoilqjqi2nu',
                    },
                    actions: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_p3ikwzsojghe5i6zoilqjqi2nu/actions',
                    },
                    capture: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_p3ikwzsojghe5i6zoilqjqi2nu/captures',
                    },
                    void: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_p3ikwzsojghe5i6zoilqjqi2nu/voids',
                    },
                },
            });

        const cko = new Checkout(SK);

        const transaction = await cko.payments.request({
            source: {
                id: 'cus_acrd33wxljeunmock26hfglfxq',
            },
            currency: 'USD',
            reference: 'test',
            amount: 123,
        });
        expect(transaction.approved).to.be.true;
    });

    it('should dynamically determine source type for id', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(201, {
                id: 'pay_hwdmkbyibmdezc37pw2ed5uhdi',
                action_id: 'act_hwdmkbyibmdezc37pw2ed5uhdi',
                amount: 1000,
                currency: 'USD',
                approved: true,
                status: 'Authorized',
                auth_code: '929324',
                eci: '05',
                scheme_id: '836659090911452',
                response_code: '10000',
                response_summary: 'Approved',
                risk: {
                    flagged: false,
                },
                source: {
                    id: 'src_ebcpiv3zdnmejkcgf5mpavla6e',
                    type: 'card',
                    billing_address: {
                        address_line1: 'asdas asd',
                        address_line2: 'fff fff',
                    },
                    expiry_month: 6,
                    expiry_year: 2028,
                    scheme: 'Visa',
                    last4: '4242',
                    fingerprint: '35D40AFFDC82BCAC9890181E14655B05D8924C0B4986D29F99D13946A3B59513',
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
                customer: {
                    id: 'cus_acrd33wxljeunmock26hfglfxq',
                    email: 'aaaaaaa@gmail.com',
                },
                processed_on: '2020-01-29T00:48:53Z',
                processing: {
                    acquirer_transaction_id: '9939059520',
                    retrieval_reference_number: '625467819714',
                },
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_hwdmkbyibmdezc37pw2ed5uhdi',
                    },
                    actions: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_hwdmkbyibmdezc37pw2ed5uhdi/actions',
                    },
                    capture: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_hwdmkbyibmdezc37pw2ed5uhdi/captures',
                    },
                    void: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_hwdmkbyibmdezc37pw2ed5uhdi/voids',
                    },
                },
            });

        const cko = new Checkout(SK);

        const transaction = await cko.payments.request({
            source: {
                id: 'src_ebcpiv3zdnmejkcgf5mpavla6e',
            },
            currency: 'USD',
            reference: 'test',
            amount: 123,
        });
        expect(transaction.approved).to.be.true;
    });

    it('should dynamically determine source type for network token', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(201, {
                id: 'pay_pdnmk3wwzbsevhtndac624znii',
                action_id: 'act_pdnmk3wwzbsevhtndac624znii',
                amount: 1000,
                currency: 'USD',
                approved: true,
                status: 'Authorized',
                auth_code: '503417',
                eci: '05',
                scheme_id: '045267405206341',
                response_code: '10000',
                response_summary: 'Approved',
                risk: {
                    flagged: false,
                },
                source: {
                    id: 'src_2lgxhvoueacutmbb6eflqiw27u',
                    type: 'card',
                    expiry_month: 10,
                    expiry_year: 2025,
                    scheme: 'Visa',
                    last4: '4242',
                    fingerprint: 'D3E048C1E888DD2903D37A8EB3BFAC60674754BEE23A3B1C4CF3B8D6D7FFD146',
                    bin: '424242',
                    card_type: 'Credit',
                    card_category: 'Consumer',
                    issuer: 'JPMORGAN CHASE BANK NA',
                    issuer_country: 'US',
                    product_id: 'A',
                    product_type: 'Visa Traditional',
                    avs_check: 'S',
                    cvv_check: 'Y',
                    payment_account_reference: '2FCFE326D92D4C27EDD699560F484',
                    payouts: true,
                    fast_funds: 'd',
                },
                customer: {
                    id: 'cus_ctyooiftpdwupchco7myr66xo4',
                },
                processed_on: '2020-01-29T00:53:33Z',
                processing: {
                    acquirer_transaction_id: '5944337681',
                    retrieval_reference_number: '715132317647',
                },
                _links: {
                    self: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_pdnmk3wwzbsevhtndac624znii',
                    },
                    actions: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_pdnmk3wwzbsevhtndac624znii/actions',
                    },
                    capture: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_pdnmk3wwzbsevhtndac624znii/captures',
                    },
                    void: {
                        href: 'https://api.sandbox.checkout.com/payments/pay_pdnmk3wwzbsevhtndac624znii/voids',
                    },
                },
            });
        const cko = new Checkout(SK);

        const transaction = await cko.payments.request({
            source: {
                token: '4242424242424242',
                token_type: 'vts',
                expiry_month: '10',
                expiry_year: '2025',
                eci: '06',
                cryptogram: 'AgAAAAAAAIR8CQrXcIhbQAAAAAA',
            },
            currency: 'USD',
            reference: 'test',
            amount: 123,
        });
        expect(transaction.approved).to.be.true;
    });

    it('should process a SEPA payment', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/sources')
            .reply(201, {
                id: 'src_ld2ft6czuayejcaxw2kmfk3cvu',
                type: 'Sepa',
                response_code: '10000',
                response_data: {
                    mandate_reference: '7af16f1d04f1486eb2f06269b9735496',
                },
                customer: {
                    id: 'cus_u4cqd7nthbke3emlcybky4aw7a',
                    email: 'sophie.bonneville@ckomail.com',
                },
                _links: {
                    'sepa:mandate-cancel': {
                        href: 'https://sbapi.ckotech.co/ppro-external/sepa/mandates/src_ld2ft6czuayejcaxw2kmfk3cvu/cancel',
                    },
                    'sepa:mandate-get': {
                        href: 'https://sbapi.ckotech.co/ppro-external/sepa/mandates/src_ld2ft6czuayejcaxw2kmfk3cvu',
                    },
                },
            });

        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(201, {
                id: 'pay_6thh5vhggyjudgzfznx2fkuede',
                status: 'Pending',
                reference: 'X-080957-N34',
                customer: {
                    id: 'cus_uhpsey6culvuln3zfzfme7w5ea',
                    email: 'sophie.bonneville@ckomail.com',
                },
                _links: {
                    self: {
                        href: 'https://api.checkout.com/payments/pay_6thh5vhggyjudgzfznx2fkuede',
                    },
                },
            });

        const cko = new Checkout(SK);

        const source = await cko.sources.add({
            type: 'sepa',
            reference: 'X-080957-N34',
            source_data: {
                first_name: 'Sophie',
                last_name: 'Bonneville',
                account_iban: 'DE25100100101234567893',
                bic: 'PBNKDEFFXXX',
                billing_descriptor: 'Thanks for shopping',
                mandate_type: 'single',
            },
            billing_address: {
                address_line1: '101 Avenue de Gaulle',
                city: 'Paris',
                zip: '75013',
                country: 'FR',
            },
            phone: {
                country_code: '+33',
                number: '6 78 91 01 11',
            },
            customer: {
                email: 'sophie.bonneville@ckomail.com',
            },
        });

        const transaction = await cko.payments.request({
            source: {
                id: source.id,
            },
            amount: 5600,
            currency: 'EUR',
            reference: 'X-080957-N34',
        });

        expect(transaction.reference).to.equal('X-080957-N34');
    });
});
