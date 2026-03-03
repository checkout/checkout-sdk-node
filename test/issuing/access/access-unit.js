import nock from "nock";
import { expect } from "chai";
import Checkout from "../../../src/Checkout.js";

describe('Unit::Issuing::Access', () => {
    it('should simulate OOB authentication', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(200, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['issuing:card-management-read']
        });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/simulate/oob/authentication')
            .reply(200, {
                status: "authenticated"
            });

        const cko = new Checkout('test_sk', {
            client: 'ack_test',
            scope: ['issuing:card-management-read'],
            environment: 'sandbox',
            subdomain: 'test',
            subdomain: '123456789'
        });
        const response = await cko.issuing.simulateOobAuthentication({
            cardholder_id: "crh_123",
            authentication_type: "sms"
        });

        expect(response).to.not.be.null;
        expect(response.status).to.equal("authenticated");
    });

    it('should request cardholder access token', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(200, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: []
        });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/issuing/access/connect/token')
            .reply(200, {
                access_token: "token_abc123",
                expires_in: 3600
            });

        const cko = new Checkout('test_sk', {
            client: 'ack_test',
            scope: [],
            environment: 'sandbox',
            subdomain: 'test',
            subdomain: '123456789'
        });
        const response = await cko.issuing.requestCardholderAccessToken({
            cardholder_id: "crh_123"
        });

        expect(response).to.not.be.null;
        expect(response.access_token).to.equal("token_abc123");
    });
});
