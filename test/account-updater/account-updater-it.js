import { expect } from 'chai';
import nock from 'nock';
import Checkout from '../../src/Checkout.js';
import { AuthenticationError } from '../../src/services/errors.js';

afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

const cko = new Checkout(process.env.CHECKOUT_DEFAULT_OAUTH_CLIENT_SECRET, {
    client: process.env.CHECKOUT_DEFAULT_OAUTH_CLIENT_ID,
    scope: ['vault:real-time-account-updater'],
    environment: 'sandbox',
    subdomain: process.env.CHECKOUT_MERCHANT_SUBDOMAIN,
});

describe('Integration::AccountUpdater', () => {
    // Note: This endpoint requires OAuth with scope 'vault:real-time-account-updater'
    it.skip('should retrieve updated card details', async () => {
        const response = await cko.accountUpdater.retrieveUpdatedCardDetails({
            source_options: {
                card: {
                    number: '5436424242424242',
                    expiry_month: 5,
                    expiry_year: 2025
                }
            }
        });

        expect(response).to.not.be.null;
        expect(response.account_update_status).to.exist;
    });

    it('should throw AuthenticationError when using invalid credentials', async () => {
        const invalidCko = new Checkout('invalid_client_secret', {
            client: 'ack_invalid',
            scope: ['vault:real-time-account-updater'],
            environment: 'sandbox',
            subdomain: '12345678',
        });

        try {
            await invalidCko.accountUpdater.retrieveUpdatedCardDetails({
                source_options: {
                    card: {
                        number: '5436424242424242',
                        expiry_month: 5,
                        expiry_year: 2025
                    }
                }
            });
            expect.fail('Should have thrown AuthenticationError');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
