import nock from "nock";
import { expect } from "chai";
import Checkout from "../../../src/Checkout.js";

describe('Unit::Issuing::Disputes', () => {
    it('should create a dispute', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(200, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['issuing:disputes-write']
        });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/disputes')
            .reply(200, {
                id: "dis_abc123",
                status: "pending"
            });

        const cko = new Checkout('test_sk', {
            client: 'ack_test',
            scope: ['issuing:disputes-write'],
            environment: 'sandbox',
            subdomain: 'test',
            subdomain: '123456789'
        });
        const response = await cko.issuing.createDispute({
            transaction_id: "trx_abc123",
            reason: "fraudulent"
        });

        expect(response).to.not.be.null;
        expect(response.id).to.equal("dis_abc123");
    });

    it('should get a dispute', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(200, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['issuing:disputes-write']
        });

        nock('https://123456789.api.sandbox.checkout.com')
            .get('/issuing/disputes/dis_abc123')
            .reply(200, {
                id: "dis_abc123",
                status: "pending"
            });

        const cko = new Checkout('test_sk', {
            client: 'ack_test',
            scope: ['issuing:disputes-write'],
            environment: 'sandbox',
            subdomain: 'test',
            subdomain: '123456789'
        });
        const response = await cko.issuing.getDispute("dis_abc123");

        expect(response).to.not.be.null;
        expect(response.id).to.equal("dis_abc123");
    });

    it('should cancel a dispute', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(200, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['issuing:disputes-write']
        });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/disputes/dis_abc123/cancel')
            .reply(200, {
                id: "dis_abc123",
                status: "cancelled"
            });

        const cko = new Checkout('test_sk', {
            client: 'ack_test',
            scope: ['issuing:disputes-write'],
            environment: 'sandbox',
            subdomain: 'test',
            subdomain: '123456789'
        });
        const response = await cko.issuing.cancelDispute("dis_abc123");

        expect(response).to.not.be.null;
        expect(response.status).to.equal("cancelled");
    });

    it('should escalate a dispute', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(200, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['issuing:disputes-write']
        });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/disputes/dis_abc123/escalate')
            .reply(200, {
                id: "dis_abc123",
                status: "escalated"
            });

        const cko = new Checkout('test_sk', {
            client: 'ack_test',
            scope: ['issuing:disputes-write'],
            environment: 'sandbox',
            subdomain: 'test',
            subdomain: '123456789'
        });
        const response = await cko.issuing.escalateDispute("dis_abc123");

        expect(response).to.not.be.null;
        expect(response.status).to.equal("escalated");
    });

    it('should submit a dispute', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(200, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['issuing:disputes-write']
        });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/disputes/dis_abc123/submit')
            .reply(200, {
                id: "dis_abc123",
                status: "submitted"
            });

        const cko = new Checkout('test_sk', {
            client: 'ack_test',
            scope: ['issuing:disputes-write'],
            environment: 'sandbox',
            subdomain: 'test',
            subdomain: '123456789'
        });
        const response = await cko.issuing.submitDispute("dis_abc123");

        expect(response).to.not.be.null;
        expect(response.status).to.equal("submitted");
    });
});
