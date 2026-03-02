import nock from "nock";
import { expect } from "chai";
import Checkout from "../../../src/Checkout.js";

describe('Unit::Issuing::Transactions', () => {
    it('should get transactions list', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(200, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['issuing:transactions-read']
        });

        nock('https://123456789.api.sandbox.checkout.com')
            .get('/issuing/transactions')
            .reply(200, {
                data: [
                    {
                        id: "trx_abc123",
                        type: "authorization",
                        amount: 1000
                    }
                ]
            });

        const cko = new Checkout('test_sk', {
            client: 'ack_test',
            scope: ['issuing:transactions-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });
        const response = await cko.issuing.getTransactions();

        expect(response).to.not.be.null;
        expect(response.data).to.be.an('array');
    });

    it('should get a transaction by id', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(200, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['issuing:transactions-read']
        });

        nock('https://123456789.api.sandbox.checkout.com')
            .get('/issuing/transactions/trx_abc123')
            .reply(200, {
                id: "trx_abc123",
                type: "authorization",
                amount: 1000
            });

        const cko = new Checkout('test_sk', {
            client: 'ack_test',
            scope: ['issuing:transactions-read'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });
        const response = await cko.issuing.getTransactionById("trx_abc123");

        expect(response).to.not.be.null;
        expect(response.id).to.equal("trx_abc123");
    });
});
