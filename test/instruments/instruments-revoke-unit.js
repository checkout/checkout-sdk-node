import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Instruments.revoke', () => {
    afterEach(() => nock.cleanAll());

    it('PATCHes /instruments/{id}/revoke and returns {} on the contract 200 no-body response', async () => {
        // Per swagger, success is 200 with no content. buildJsonResponse in
        // services/http.js returns `{}` when the response body is empty.
        nock('https://123456789.api.sandbox.checkout.com')
            .patch('/instruments/src_abc/revoke')
            .reply(200);

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const res = await cko.instruments.revoke('src_abc');
        expect(res).to.deep.equal({});
    });
});
