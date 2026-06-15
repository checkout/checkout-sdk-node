import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('OnboardingSimulator', () => {
    afterEach(() => nock.cleanAll());

    it('getAvailableRequirements GETs /simulate/requirements-due', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/simulate/requirements-due')
            .reply(200, { fields: [] });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const res = await cko.onboardingSimulator.getAvailableRequirements();
        expect(res).to.deep.equal({ fields: [] });
    });

    it('getAvailableScenarios GETs /simulate/scenarios', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/simulate/scenarios')
            .reply(200, { scenarios: [] });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const res = await cko.onboardingSimulator.getAvailableScenarios();
        expect(res).to.deep.equal({ scenarios: [] });
    });

    it('setRequirementsDue POSTs /simulate/entities/{id}/requirements-due', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/simulate/entities/ent_1/requirements-due')
            .reply(200, { ok: true });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const res = await cko.onboardingSimulator.setRequirementsDue('ent_1', { field_names: ['individual.date_of_birth'] });
        expect(res.ok).to.equal(true);
    });

    it('runScenario POSTs /simulate/entities/{id}/scenarios/{scenarioId}', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/simulate/entities/ent_1/scenarios/scn_pass')
            .reply(200, { status: 'completed' });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const res = await cko.onboardingSimulator.runScenario('ent_1', 'scn_pass');
        expect(res.status).to.equal('completed');
    });

    it('setEntityStatus POSTs /simulate/entities/{id}/status', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/simulate/entities/ent_1/status')
            .reply(200, { status: 'active' });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const res = await cko.onboardingSimulator.setEntityStatus('ent_1', { status: 'active' });
        expect(res.status).to.equal('active');
    });
});
