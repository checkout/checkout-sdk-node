import { expect } from 'chai';
import Checkout from '../../src/Checkout.js';

const cko = new Checkout(process.env.CHECKOUT_DEFAULT_SECRET_KEY, {
    pk: process.env.CHECKOUT_DEFAULT_PUBLIC_KEY,
    environment: 'sandbox',
    subdomain: process.env.CHECKOUT_MERCHANT_SUBDOMAIN,
});

describe.skip('Integration::OnboardingSimulator', () => {
    it('lists available requirements', async () => {
        const res = await cko.onboardingSimulator.getAvailableRequirements();
        expect(res).to.exist;
    });

    it('lists available scenarios', async () => {
        const res = await cko.onboardingSimulator.getAvailableScenarios();
        expect(res).to.exist;
    });

    it('sets requirements due on a sub-entity', async () => {
        const res = await cko.onboardingSimulator.setRequirementsDue(
            process.env.CHECKOUT_ONBOARDING_ENTITY_ID,
            { field_names: ['individual.date_of_birth'] }
        );
        expect(res).to.exist;
    });

    it('runs a scenario on a sub-entity', async () => {
        const res = await cko.onboardingSimulator.runScenario(
            process.env.CHECKOUT_ONBOARDING_ENTITY_ID,
            'scn_pass'
        );
        expect(res).to.exist;
    });

    it('forces an entity status', async () => {
        const res = await cko.onboardingSimulator.setEntityStatus(
            process.env.CHECKOUT_ONBOARDING_ENTITY_ID,
            { status: 'active' }
        );
        expect(res).to.exist;
    });
});
