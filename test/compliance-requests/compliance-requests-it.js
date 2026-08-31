import { expect } from 'chai';
import Checkout from '../../src/Checkout.js';

const cko = new Checkout(process.env.CHECKOUT_DEFAULT_SECRET_KEY, {
    pk: process.env.CHECKOUT_DEFAULT_PUBLIC_KEY,
    environment: 'sandbox',
    // The sandbox OAuth clients are not provisioned for the merchant-specific
    // subdomain, so the token request would come back invalid_client. Opting out
    // explicitly until they are.
    useLegacyDomain: true,
});

describe.skip('Integration::ComplianceRequests', () => {
    it('should retrieve a compliance request for a payment', async () => {
        const res = await cko.complianceRequests.getComplianceRequest(process.env.CHECKOUT_COMPLIANCE_PAYMENT_ID);
        expect(res).to.exist;
    });

    it('should respond to a compliance request', async () => {
        const res = await cko.complianceRequests.respondToComplianceRequest(
            process.env.CHECKOUT_COMPLIANCE_PAYMENT_ID,
            {
                fields: {
                    sender: [{ name: 'date_of_birth', value: '1990-01-01', not_available: false }],
                },
                comments: 'Integration test response',
            }
        );
        expect(res).to.exist;
    });
});
