import { AuthenticationError, } from '../../src/services/errors.js';
import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';

describe('Card Metadata', () => {
    it('should get card metadata', async () => {
        nock('https://123456789.api.sandbox.checkout.com').post('/metadata/card').reply(200, {
            bin: '453946',
            scheme: 'visa',
            card_type: 'CREDIT',
            card_category: 'CONSUMER',
            issuer: 'UNICAJA BANCO',
            issuer_country: 'ES',
            issuer_country_name: 'Spain',
            product_type: 'CLASSIC',
        });

        const cko = new Checkout(SK, { subdomain: '123456789' });

        const metadata = await cko.cardMetadata.get({
            source: {
                type: 'card',
                number: '4539467987109256',
            },
            format: 'basic',
        });

        expect(metadata.scheme).to.equal('visa');
    });

    it('should throw auth error getting card metadata', async () => {
        nock('https://123456789.api.sandbox.checkout.com').post('/metadata/card').reply(401);

        try {
            const cko = new Checkout(SK, { subdomain: '123456789' });

            const metadata = await cko.cardMetadata.get({
                source: {
                    type: 'card',
                    number: '4539467987109256',
                },
                format: 'basic',
            });

            expect(metadata.scheme).to.equal('visa');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
