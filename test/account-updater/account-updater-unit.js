import nock from "nock";
import { expect } from "chai";
import Checkout from "../../src/Checkout.js";
import { NotFoundError } from "../../src/services/errors.js";

describe('Unit::AccountUpdater', () => {
    it('should retrieve updated card details', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(201, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'vault:real-time-account-updater'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/account-updater/cards')
            .reply(200, {
                account_update_status: "CARD_UPDATED",
                card: {
                    encrypted_card_number: "3nCryp73dFPANv4lu3",
                    bin: "543642",
                    last4: "4242",
                    expiry_month: 5,
                    expiry_year: 2025,
                    fingerprint: "abc123fingerprint"
                }
            });

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['vault:real-time-account-updater'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        const response = await cko.accountUpdater.retrieveUpdatedCardDetails({
            source_options: {
                card: {
                    number: "5436424242424242",
                    expiry_month: 5,
                    expiry_year: 2025
                }
            }
        });

        expect(response).to.not.be.null;
        expect(response.account_update_status).to.equal("CARD_UPDATED");
        expect(response.card.last4).to.equal("4242");
        expect(response.card.bin).to.equal("543642");
    });

    it('should throw when retrieving updated card details with invalid token', async () => {
        nock('https://123456789.access.sandbox.checkout.com')
            .post('/connect/token')
            .reply(201, {
                access_token: 'test_access_token',
                expires_in: 3600,
                token_type: 'Bearer',
                scope: 'vault:real-time-account-updater'
            });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/account-updater/cards')
            .reply(404);

        const cko = new Checkout('test_client_secret', {
            client: 'ack_testclie123456',
            scope: ['vault:real-time-account-updater'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        try {
            await cko.accountUpdater.retrieveUpdatedCardDetails({
                source_options: {
                    card: {
                        number: "5436424242424242",
                        expiry_month: 5,
                        expiry_year: 2025
                    }
                }
            });
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
