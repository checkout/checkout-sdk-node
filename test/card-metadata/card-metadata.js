import { AuthenticationError, } from '../../src/services/errors.js';
import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';

describe('Card Metadata', () => {
    it('should get card metadata', async () => {
        nock('https://api.sandbox.checkout.com').post('/metadata/card').reply(200, {
            scheme: 'visa',
            card_type: 'credit',
            card_category: 'consumer',
            issuer: 'UNICAJA BANCO',
            issuer_country: 'ES',
            product_type: 'CLASSIC',
            issuer_country_name: 'Spain',
            bin: '453946',
        });

        const cko = new Checkout(SK);

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
        nock('https://api.sandbox.checkout.com').post('/metadata/card').reply(401);

        try {
            const cko = new Checkout(SK);

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
