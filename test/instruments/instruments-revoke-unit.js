import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Instruments.revoke', () => {
    afterEach(() => nock.cleanAll());

    it('PATCHes /instruments/{id}/revoke and returns {} on 204', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .patch('/instruments/src_abc/revoke')
            .reply(204);

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const res = await cko.instruments.revoke('src_abc');
        expect(res).to.deep.equal({});
    });

    it('PATCHes /instruments/{id}/revoke and returns json on 200', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .patch('/instruments/src_abc/revoke')
            .reply(200, { status: 'revoked' });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const res = await cko.instruments.revoke('src_abc');
        expect(res.status).to.equal('revoked');
    });
});
