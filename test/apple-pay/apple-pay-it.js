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
    scope: ['vault:apme-enrollment'],
    environment: 'sandbox',
    subdomain: process.env.CHECKOUT_MERCHANT_SUBDOMAIN,
});

describe('Integration::Apple-Pay', () => {
    it.skip('should enroll a merchant for Apple Pay', async () => {
        const response = await cko.applePay.enroll({
            domain: 'https://example.com',
        });

        // 204 returns undefined
        expect(response).to.be.undefined;
    });

    it('should throw AuthenticationError when enrolling with invalid key', async () => {
        const invalidCko = new Checkout('sk_sbox_invalid_key', {
            subdomain: '12345678',
        });

        try {
            await invalidCko.applePay.enroll({
                domain: 'https://example.com',
            });
            expect.fail('Should have thrown AuthenticationError');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
