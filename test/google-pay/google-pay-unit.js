import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('GooglePay', () => {
    afterEach(() => nock.cleanAll());

    it('enroll POSTs to /googlepay/enrollments', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/googlepay/enrollments')
            .reply(201, { status: 'enrolled' });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const res = await cko.googlePay.enroll({
            entity_id: 'ent_1',
            email_address: 'platform@example.com',
            accept_terms_of_service: true,
        });
        expect(res.status).to.equal('enrolled');
    });

    it('registerDomain POSTs to /googlepay/enrollments/{id}/domain and accepts the contract 204 no-body response', async () => {
        // Per swagger, success is 204 with no content. buildJsonResponse in
        // services/http.js returns `{}` when the response body is empty.
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/googlepay/enrollments/ent_1/domain')
            .reply(204);

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const res = await cko.googlePay.registerDomain('ent_1', { web_domain: 'example.com' });
        expect(res).to.deep.equal({});
    });

    it('getRegisteredDomains GETs /googlepay/enrollments/{id}/domains', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/googlepay/enrollments/ent_1/domains')
            .reply(200, { domains: ['example.com'] });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const res = await cko.googlePay.getRegisteredDomains('ent_1');
        expect(res.domains).to.deep.equal(['example.com']);
    });

    it('getEnrollmentState GETs /googlepay/enrollments/{id}/state', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/googlepay/enrollments/ent_1/state')
            .reply(200, { state: 'active' });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const res = await cko.googlePay.getEnrollmentState('ent_1');
        expect(res.state).to.equal('active');
    });
});
