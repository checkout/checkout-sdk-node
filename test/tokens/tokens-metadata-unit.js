import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Tokens.getTokenMetadata', () => {
    afterEach(() => nock.cleanAll());

    it('GETs /tokens/{id}/metadata using secret key', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/tokens/tok_abc/metadata')
            .reply(200, { billing_address: { country: 'GB' } });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const res = await cko.tokens.getTokenMetadata('tok_abc');
        expect(res.billing_address.country).to.equal('GB');
    });
});
