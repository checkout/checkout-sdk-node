import nock from "nock";
import { expect } from "chai";
import Checkout from "../../../src/Checkout.js";

describe('Unit::Issuing::DigitalCards', () => {
    it('should get a digital card', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(200, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['issuing:card-management-read']
        });

        nock('https://123456789.api.sandbox.checkout.com')
            .get('/issuing/digital-cards/dgc_abc123')
            .reply(200, {
                id: "dgc_abc123",
                card_id: "crd_fa6psq242dcd6fdn5gifcq1491",
                wallet: "apple_pay",
                status: "active"
            });

        const cko = new Checkout('test_sk', {
            client: 'ack_test',
            scope: ['issuing:card-management-read'],
            environment: 'sandbox',
            subdomain: 'test',
            subdomain: '123456789'
        });
        const response = await cko.issuing.getDigitalCard("dgc_abc123");

        expect(response).to.not.be.null;
        expect(response.id).to.equal("dgc_abc123");
        expect(response.wallet).to.equal("apple_pay");
    });
});
