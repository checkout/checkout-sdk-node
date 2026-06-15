import { expect } from 'chai';
import Checkout from '../../src/Checkout.js';

const cko = new Checkout(process.env.CHECKOUT_DEFAULT_SECRET_KEY, {
    pk: process.env.CHECKOUT_DEFAULT_PUBLIC_KEY,
    environment: 'sandbox',
    subdomain: process.env.CHECKOUT_MERCHANT_SUBDOMAIN,
});

describe.skip('Integration::GooglePay', () => {
    const entityId = process.env.CHECKOUT_GOOGLEPAY_ENTITY_ID;

    it('enrolls an entity', async () => {
        const res = await cko.googlePay.enroll({
            entity_id: entityId,
            email_address: 'platform@example.com',
            accept_terms_of_service: true,
        });
        expect(res).to.exist;
    });

    it('registers a domain', async () => {
        const res = await cko.googlePay.registerDomain(entityId, { web_domain: 'example.com' });
        expect(res).to.exist;
    });

    it('lists registered domains', async () => {
        const res = await cko.googlePay.getRegisteredDomains(entityId);
        expect(res).to.exist;
    });

    it('gets enrollment state', async () => {
        const res = await cko.googlePay.getEnrollmentState(entityId);
        expect(res).to.exist;
    });
});
