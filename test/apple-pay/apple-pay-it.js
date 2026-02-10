import { expect } from 'chai';
import nock from 'nock';
import Checkout from '../../src/Checkout.js';
import { AuthenticationError } from '../../src/services/errors.js';

afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

const cko = new Checkout(process.env.CHECKOUT_DEFAULT_SECRET_KEY, {
    pk: process.env.CHECKOUT_PREVIOUS_PUBLIC_KEY,
    environment: 'sandbox',
});

describe('Integration::Apple-Pay', () => {
    it.skip('should enroll a merchant for Apple Pay', async () => {
        const response = await cko.applePay.enroll({
            apple_merchant_id: 'merchant.com.example',
            display_name: 'Example Merchant',
        });

        // 204 returns undefined
        expect(response).to.be.undefined;
    });

    it('should throw AuthenticationError when enrolling with invalid key', async () => {
        const invalidCko = new Checkout('sk_sbox_invalid_key', {
            pk: 'pk_sbox_invalid_key',
        });

        try {
            await invalidCko.applePay.enroll({
                apple_merchant_id: 'merchant.com.example',
                display_name: 'Example Merchant',
            });
            expect.fail('Should have thrown AuthenticationError');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
