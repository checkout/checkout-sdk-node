import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('ComplianceRequests', () => {
    afterEach(() => nock.cleanAll());

    it('getComplianceRequest GETs /compliance-requests/{paymentId}', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/compliance-requests/pay_abc')
            .reply(200, { id: 'cr_1', fields: {} });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const res = await cko.complianceRequests.getComplianceRequest('pay_abc');
        expect(res.id).to.equal('cr_1');
    });

    it('respondToComplianceRequest POSTs to /compliance-requests/{paymentId} and accepts the contract 202 no-body response', async () => {
        // Per swagger, success is 202 with no content. buildJsonResponse in
        // services/http.js returns `{}` when the response body is empty.
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/compliance-requests/pay_abc')
            .reply(202);

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const res = await cko.complianceRequests.respondToComplianceRequest('pay_abc', {
            fields: {
                sender: [{ name: 'date_of_birth', value: '1990-01-01', not_available: false }],
            },
            comments: 'note',
        });
        expect(res).to.deep.equal({});
    });
});
