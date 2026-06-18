import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Platforms — entity-requirements endpoints', () => {
    afterEach(() => nock.cleanAll());

    it('getEntityRequirements GETs /accounts/entities/{id}/requirements', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/accounts/entities/ent_1/requirements')
            .reply(200, { data: [] });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const res = await cko.platforms.getEntityRequirements('ent_1');
        expect(res.data).to.deep.equal([]);
    });

    it('getEntityRequirementDetails GETs /accounts/entities/{id}/requirements/{reqId}', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/accounts/entities/ent_1/requirements/req_1')
            .reply(200, { id: 'req_1', priority: 'urgent' });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const res = await cko.platforms.getEntityRequirementDetails('ent_1', 'req_1');
        expect(res.id).to.equal('req_1');
    });

    it('updateEntityRequirement PUTs /accounts/entities/{id}/requirements/{reqId}', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .put('/accounts/entities/ent_1/requirements/req_1')
            .reply(200, { status: 'pending_review' });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const res = await cko.platforms.updateEntityRequirement('ent_1', 'req_1', {
            value: { file_id: 'file_abc' },
        });
        expect(res.status).to.equal('pending_review');
    });

    it('exposes the entityRequirements sub-client as well', async () => {
        const cko = new Checkout(SK, { subdomain: '123456789' });
        expect(cko.platforms.entityRequirements).to.exist;
        expect(typeof cko.platforms.entityRequirements.getEntityRequirements).to.equal('function');
    });
});
