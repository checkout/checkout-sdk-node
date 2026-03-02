/**
 * Shared setup for Identities integration tests.
 *
 * Requires: CHECKOUT_DEFAULT_OAUTH_CLIENT_ID, CHECKOUT_DEFAULT_OAUTH_CLIENT_SECRET
 * Optional: CHECKOUT_MERCHANT_SUBDOMAIN
 */
import Checkout from '../../src/Checkout.js';

export const cko = new Checkout(process.env.CHECKOUT_DEFAULT_OAUTH_CLIENT_SECRET, {
    client: process.env.CHECKOUT_DEFAULT_OAUTH_CLIENT_ID,
    scope: ['identity-verification'],
    environment: 'sandbox',
    subdomain: process.env.CHECKOUT_MERCHANT_SUBDOMAIN,
});
