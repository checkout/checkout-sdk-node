import { AuthenticationError } from '../../src/services/errors.js';
import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';

describe('Network Tokens', () => {
    it('should provision a network token', async () => {
        nock('https://api.sandbox.checkout.com').post('/network-tokens').reply(201, {
            card: {
                last4: '6378',
                expiry_month: '5',
                expiry_year: '2025',
            },
            network_token: {
                token: 'tok_ubfj2q76miwundwlk72vxt2i7q',
                expiry_month: '5',
                expiry_year: '2025',
                token_type: 'network',
            },
        });

        const cko = new Checkout(SK);

        const networkToken = await cko.networkTokens.provisionNetworkToken({
            source: {
                type: 'id',
                id: 'src_wmlfc3zyhqzehihu7giusaaawu',
            },
        });

        expect(networkToken.network_token).to.exist;
        expect(networkToken.network_token.token_type).to.equal('network');
    });

    it('should get a network token', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/network-tokens/tok_ubfj2q76miwundwlk72vxt2i7q')
            .reply(200, {
                token: 'tok_ubfj2q76miwundwlk72vxt2i7q',
                expiry_month: '5',
                expiry_year: '2025',
                token_type: 'network',
                state: 'active',
            });

        const cko = new Checkout(SK);

        const networkToken = await cko.networkTokens.getNetworkToken(
            'tok_ubfj2q76miwundwlk72vxt2i7q'
        );

        expect(networkToken.token).to.equal('tok_ubfj2q76miwundwlk72vxt2i7q');
        expect(networkToken.state).to.equal('active');
    });

    it('should request a cryptogram', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/network-tokens/tok_ubfj2q76miwundwlk72vxt2i7q/cryptograms')
            .reply(201, {
                cryptogram: 'AhJ3hnYAoAbVz5zg1e17MAACAAA=',
                eci: '7',
            });

        const cko = new Checkout(SK);

        const cryptogram = await cko.networkTokens.provisionCryptogram(
            'tok_ubfj2q76miwundwlk72vxt2i7q',
            { transaction_type: 'ecom' }
        );

        expect(cryptogram.cryptogram).to.exist;
        expect(cryptogram.eci).to.exist;
    });

    it('should throw auth error provisioning network token', async () => {
        nock('https://api.sandbox.checkout.com').post('/network-tokens').reply(401);

        try {
            const cko = new Checkout(SK);
            await cko.networkTokens.provisionNetworkToken({
                source: {
                    type: 'id',
                    id: 'src_wmlfc3zyhqzehihu7giusaaawu',
                },
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should delete a network token', async () => {
        nock('https://api.sandbox.checkout.com')
            .patch('/network-tokens/ntk_abc123/delete')
            .reply(200, {
                id: "ntk_abc123",
                status: "deleted"
            });

        const cko = new Checkout(SK);
        const response = await cko.networkTokens.deleteNetworkToken("ntk_abc123");

        expect(response).to.not.be.null;
        expect(response.status).to.equal("deleted");
    });

    it('should throw auth error getting network token', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/network-tokens/tok_ubfj2q76miwundwlk72vxt2i7q')
            .reply(401);

        try {
            const cko = new Checkout(SK);
            await cko.networkTokens.getNetworkToken('tok_ubfj2q76miwundwlk72vxt2i7q');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw auth error provisioning cryptogram', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/network-tokens/tok_ubfj2q76miwundwlk72vxt2i7q/cryptograms')
            .reply(401);

        try {
            const cko = new Checkout(SK);
            await cko.networkTokens.provisionCryptogram(
                'tok_ubfj2q76miwundwlk72vxt2i7q',
                { transaction_type: 'ecom' }
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw auth error deleting network token', async () => {
        nock('https://api.sandbox.checkout.com')
            .patch('/network-tokens/ntk_abc123/delete')
            .reply(401);

        try {
            const cko = new Checkout(SK);
            await cko.networkTokens.deleteNetworkToken('ntk_abc123');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
