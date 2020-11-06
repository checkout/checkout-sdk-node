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
import fetch from 'node-fetch';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Reconciliation', () => {
    it('should get JSON payments report', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/reporting/payments?from=2019-05-17T16:48:52Z')
            .reply(201, {
                count: 1,
                data: {
                    id: 'pay_nezg6bx2k22utmk4xm5s2ughxi',
                    processing_currency: 'USD',
                    payout_currency: 'GBP',
                    requested_on: '2019-03-08T10:29:51.922',
                    channel_name: 'www.example.com',
                    reference: 'ORD-5023-4E89',
                    payment_method: 'VISA',
                    card_type: 'CREDIT',
                    card_category: 'Consumer',
                    issuer_country: 'US',
                    merchant_country: 'SI',
                    mid: '123456',
                    actions: {
                        type: 'Authorization',
                        id: 'act_nezg6bx2k22utmk4xm5s2ughxi',
                        processed_on: '2019-03-08T10:29:51.922',
                        response_code: '10000',
                        response_description: 'Approved',
                        breakdown: {
                            type: 'Gateway Fee Tax ARE USD/GBP@0.7640412612',
                            date: '2019-03-08T10:29:51.922',
                            processing_currency_amount: '-0.003',
                            payout_currency_amount: '-0.00229212',
                        },
                    },
                    _links: {
                        payments: {
                            href:
                                'http://api.checkout.com/reporting/statements/190110B107654/payments',
                        },
                    },
                },
                _links: {
                    next: {
                        href:
                            'http://api.checkout.com/reporting/payments?from=01%2F03%2F2019%2000%3A00%3A00&to=01%2F03%2F2019%2000%3A00%3A00&limit=1&after=11111111',
                    },
                    self: {
                        href:
                            'http://api.checkout.com/reporting/payments?from=01%2F03%2F2019%2000%3A00%3A00&to=01%2F03%2F2019%2000%3A00%3A00&limit=1',
                    },
                },
            });

        const cko = new Checkout(SK);

        const reconciliation = await cko.reconciliation.getPayments({
            from: '2019-05-17T16:48:52Z',
        });

        expect(reconciliation.count).to.equal(1);
    });

    it('should throw Not Found error when trying to get payments', async () => {
        nock('https://api.sandbox.checkout.com').get('/reporting/payments?from=test').reply(404);
        const cko = new Checkout(SK);

        try {
            const reconciliation = await cko.reconciliation.getPayments({
                from: 'test',
            });
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should get JSON for a single payment report', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/reporting/payments/pay_nezg6bx2k22utmk4xm5s2ughxi')
            .reply(201, {
                count: 1,
                data: {
                    id: 'pay_nezg6bx2k22utmk4xm5s2ughxi',
                    processing_currency: 'USD',
                    payout_currency: 'GBP',
                    requested_on: '2019-03-08T10:29:51.922',
                    channel_name: 'www.example.com',
                    reference: 'ORD-5023-4E89',
                    payment_method: 'VISA',
                    card_type: 'CREDIT',
                    card_category: 'Consumer',
                    issuer_country: 'US',
                    merchant_country: 'SI',
                    mid: '123456',
                    actions: {
                        type: 'Authorization',
                        id: 'act_nezg6bx2k22utmk4xm5s2ughxi',
                        processed_on: '2019-03-08T10:29:51.922',
                        response_code: '10000',
                        response_description: 'Approved',
                        breakdown: {
                            type: 'Gateway Fee Tax ARE USD/GBP@0.7640412612',
                            date: '2019-03-08T10:29:51.922',
                            processing_currency_amount: '-0.003',
                            payout_currency_amount: '-0.00229212',
                        },
                    },
                    _links: {
                        payments: {
                            href:
                                'http://api.checkout.com/reporting/statements/190110B107654/payments',
                        },
                    },
                },
                _links: {
                    next: {
                        href:
                            'http://api.checkout.com/reporting/payments?from=01%2F03%2F2019%2000%3A00%3A00&to=01%2F03%2F2019%2000%3A00%3A00&limit=1&after=11111111',
                    },
                    self: {
                        href:
                            'http://api.checkout.com/reporting/payments?from=01%2F03%2F2019%2000%3A00%3A00&to=01%2F03%2F2019%2000%3A00%3A00&limit=1',
                    },
                },
            });

        const cko = new Checkout(SK);

        const reconciliation = await cko.reconciliation.getPayment(
            'pay_nezg6bx2k22utmk4xm5s2ughxi'
        );

        expect(reconciliation.count).to.equal(1);
        expect(reconciliation.data.id).to.equal('pay_nezg6bx2k22utmk4xm5s2ughxi');
    });

    it('should throw Not Found error when trying to get payment', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/reporting/payments/pay_nezg6bx2k22utmk4xm5s2ughxz')
            .reply(404);
        const cko = new Checkout(SK);

        try {
            const reconciliation = await cko.reconciliation.getPayment(
                'pay_nezg6bx2k22utmk4xm5s2ughxz'
            );
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should get CSV payments report', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/reporting/payments/download?from=2019-05-17T16:48:52Z')
            .replyWithFile(200, __dirname + '/report.csv', {
                'Content-Type': 'application/json',
            });

        const cko = new Checkout(SK);

        const reconciliation = await cko.reconciliation.getPaymentsCsv({
            from: '2019-05-17T16:48:52Z',
        });

        expect(reconciliation).to.be.instanceof(Buffer);
    });

    it('should throw Not Found error when trying to get payments csv', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/reporting/payments/download?from=2019-05-17T16:48:52Z')
            .reply(404);
        const cko = new Checkout(SK);

        try {
            const reconciliation = await cko.reconciliation.getPaymentsCsv({
                from: '2019-05-17T16:48:52Z',
            });
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should get JSON statements report', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/reporting/statements?from=2019-05-17T16:48:52Z&to=2019-06-17T16:48:52Z')
            .reply(201, {
                count: 1,
                data: [
                    {
                        id: '155613B100981',
                        period_start: '2019-06-03T00:00:00.000',
                        period_end: '2019-06-09T23:59:59.000',
                        date: '2019-06-13T00:00:00.000',
                        payouts: [
                            {
                                currency: 'USD',
                                carried_forward_amount: 0.0,
                                current_period_amount: 0.0,
                                net_amount: 0.0,
                                date: '2019-06-13T00:00:00.000',
                                period_start: '2019-06-03T00:00:00.000',
                                period_end: '2019-06-09T23:59:59.000',
                                id: 'OYWDV06ZZ',
                                status: 'Paid',
                                payout_fee: 0.0,
                                _links: {
                                    payments: {
                                        href:
                                            'https://api.checkout.com/reporting/statements/155613B100981/payments?payout_id=OYWDV06ZZ',
                                    },
                                    download: {
                                        href:
                                            'https://api.checkout.com/reporting/statements/155613B100981/payments/download?payout_id=OYWDV06ZZ',
                                    },
                                },
                            },
                        ],
                        _links: {
                            payments: {
                                href:
                                    'https://api.checkout.com/reporting/statements/155613B100981/payments',
                            },
                            download: {
                                href:
                                    'https://api.checkout.com/reporting/statements/155613B100981/payments/download',
                            },
                        },
                    },
                ],
                _links: {
                    next: {
                        href:
                            'http://api.checkout.com/reporting/statements?from=01%2F01%2F2019%2000%3A00%3A00&to=01%2F11%2F2019%2000%3A00%3A00&limit=1&skip=1',
                    },
                    self: {
                        href:
                            'http://api.checkout.com/reporting/statements?from=01%2F01%2F2019%2000%3A00%3A00&to=01%2F11%2F2019%2000%3A00%3A00&limit=1',
                    },
                },
            });

        const cko = new Checkout(SK);

        const statements = await cko.reconciliation.getStatements({
            from: '2019-05-17T16:48:52Z',
            to: '2019-06-17T16:48:52Z',
        });

        expect(statements.data.length).to.equal(1);
    });

    it('should throw Not Found error when trying to get statements report', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/reporting/statements?from=2019-05-17T16:48:52Z&to=2019-06-17T16:48:52Z')
            .reply(404);
        const cko = new Checkout(SK);

        try {
            const statements = await cko.reconciliation.getStatements({
                from: '2019-05-17T16:48:52Z',
                to: '2019-06-17T16:48:52Z',
            });
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should get CSV single statement report', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/reporting/statements/155613B100981/payments/download')
            .replyWithFile(200, __dirname + '/report.csv', {
                'Content-Type': 'application/json',
            });

        const cko = new Checkout(SK);

        const statement = await cko.reconciliation.getStatementCsv('155613B100981');

        expect(statement).to.be.instanceof(Buffer);
    });

    it('should throw Not Found error when trying to get statements report csv', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/reporting/statements/155613B100981/payments/download')
            .reply(404);
        const cko = new Checkout(SK);

        try {
            const statement = await cko.reconciliation.getStatementCsv('155613B100981');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should paginate the json payment response', async () => {
        nock('https://api.sandbox.checkout.com')
            .get(
                '/reporting/payments?from=2020-07-07T17:51:42Z&to=2020-07-07T17:51:59Z&limit=3&after=undefined'
            )
            .reply(201, {
                count: 3,
                data: [
                    {
                        id: 'pay_ppxwulsiifeetapzdtladja1234',
                    },
                    {
                        id: 'pay_ppxwulsiifeetapzdtladja1234',
                    },
                    {
                        id: 'pay_ppxwulsiifeetapzdtladja1234',
                    },
                ],
                _links: {
                    next: {
                        href:
                            'https://api.checkout.com/reporting/payments?from=07%2F07%2F2020%2017%3A51%3A42&to=07%2F07%2F2020%2017%3A51%3A59&after=269060358&limit=3',
                    },
                    self: {
                        href:
                            'https://api.checkout.com/reporting/payments?from=07%2F07%2F2020%2017%3A51%3A42&to=07%2F07%2F2020%2017%3A51%3A59&after=269060368&limit=3',
                    },
                },
                page: '269060358',
            });

        nock('https://api.sandbox.checkout.com')
            .get(
                '/reporting/payments?from=2020-07-07T17:51:42Z&to=2020-07-07T17:51:59Z&limit=3&after=269060358'
            )
            .reply(201, {
                count: 2,
                data: [
                    {
                        id: 'pay_ppxwulsiifeetapzdtladja1234',
                    },
                    {
                        id: 'pay_ppxwulsiifeetapzdtladja1234',
                    },
                ],
                _links: {
                    self: {
                        href:
                            'https://api.checkout.com/reporting/payments?from=07%2F07%2F2020%2017%3A51%3A42&to=07%2F07%2F2020%2017%3A51%3A59&after=269060368&limit=3',
                    },
                },
            });

        const cko = new Checkout(SK, {
            timeout: 60000,
        });

        let page;

        // Iterate until there is no longer a page to go to
        do {
            const reconciliation = await cko.reconciliation.getPayments({
                from: '2020-07-07T17:51:42Z',
                to: '2020-07-07T17:51:59Z',
                limit: 3,
                after: page, // In case you saw a page already, skip it
            });
            // The next page you can go to
            page = reconciliation.page;
            expect(reconciliation.count >= 2).to.be.true;
        } while (page);
    });
});
