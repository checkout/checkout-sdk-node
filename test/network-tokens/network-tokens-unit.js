import { AuthenticationError } from '../../src/services/errors.js';
import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

describe('Network Tokens', () => {
    it('should provision a network token', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['vault:network-tokens']
        });

        nock('https://123456789.api.sandbox.checkout.com').post('/network-tokens').reply(201, {
            card: {
                last4: '6378',
                expiry_month: '5',
                expiry_year: '2025',
            },
            network_token: {
                id: 'nt_xgu3isllqfyu7ktpk5z2yxbwna',
                state: 'active',
                number: '5436424242424242',
                expiry_month: '5',
                expiry_year: '2025',
                type: 'vts',
                payment_account_reference: '5001a9f027e5629d11e3949a0800a',
                created_on: '2020-02-11T15:57:32.435+00:00',
                modified_on: '2020-02-11T15:57:32.435+00:00',
            },
            token_requestor_id: '1234567890',
            token_scheme_id: 'scheme_visa_001',
            _links: {
                self: {
                    href: 'https://123456789.api.sandbox.checkout.com/network-tokens/nt_xgu3isllqfyu7ktpk5z2yxbwna'
                },
                cryptogram: {
                    href: 'https://123456789.api.sandbox.checkout.com/network-tokens/nt_xgu3isllqfyu7ktpk5z2yxbwna/cryptograms'
                },
                'card-art': {
                    href: 'https://card-art.checkout.com/00340aa7bd3de35cb1048369450d8df4'
                }
            },
        });

        const cko = new Checkout('test_sk', {
            client: 'ack_test',
            scope: ['vault:network-tokens'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        const networkToken = await cko.networkTokens.provisionNetworkToken({
            source: {
                type: 'id',
                id: 'src_wmlfc3zyhqzehihu7giusaaawu',
            },
        });

        expect(networkToken.network_token).to.exist;
        expect(networkToken.network_token.id).to.equal('nt_xgu3isllqfyu7ktpk5z2yxbwna');
        expect(networkToken.network_token.state).to.equal('active');
        expect(networkToken.network_token.type).to.equal('vts');
    });

    it('should get a network token', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['vault:network-tokens']
        });

        nock('https://123456789.api.sandbox.checkout.com')
            .get('/network-tokens/tok_ubfj2q76miwundwlk72vxt2i7q')
            .reply(200, {
                card: {
                    last4: '6378',
                    expiry_month: '5',
                    expiry_year: '2025',
                },
                network_token: {
                    id: 'tok_ubfj2q76miwundwlk72vxt2i7q',
                    state: 'active',
                    number: '5436424242424242',
                    expiry_month: '5',
                    expiry_year: '2025',
                    type: 'vts',
                    payment_account_reference: '5001a9f027e5629d11e3949a0800a',
                    created_on: '2020-02-11T15:57:32.435+00:00',
                    modified_on: '2020-02-11T15:57:32.435+00:00',
                },
                token_requestor_id: '1234567890',
                token_scheme_id: 'scheme_visa_001',
                _links: {
                    self: {
                        href: 'https://123456789.api.sandbox.checkout.com/network-tokens/tok_ubfj2q76miwundwlk72vxt2i7q'
                    },
                    cryptogram: {
                        href: 'https://123456789.api.sandbox.checkout.com/network-tokens/tok_ubfj2q76miwundwlk72vxt2i7q/cryptograms'
                    },
                    'card-art': {
                        href: 'https://card-art.checkout.com/00340aa7bd3de35cb1048369450d8df4'
                    }
                },
            });

        const cko = new Checkout('test_sk', {
            client: 'ack_test',
            scope: ['vault:network-tokens'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        const networkToken = await cko.networkTokens.getNetworkToken(
            'tok_ubfj2q76miwundwlk72vxt2i7q'
        );

        expect(networkToken.network_token).to.exist;
        expect(networkToken.network_token.id).to.equal('tok_ubfj2q76miwundwlk72vxt2i7q');
        expect(networkToken.network_token.state).to.equal('active');
        expect(networkToken.card).to.exist;
        expect(networkToken.card.last4).to.equal('6378');
    });

    it('should request a cryptogram', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['vault:network-tokens']
        });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/network-tokens/tok_ubfj2q76miwundwlk72vxt2i7q/cryptograms')
            .reply(201, {
                cryptogram: 'AhJ3hnYAoAbVz5zg1e17MAACAAA=',
                eci: '7',
                _links: {
                    self: {
                        href: 'https://123456789.api.sandbox.checkout.com/network-tokens/nt_xgu3isllqfyu7ktpk5z2yxbwna/cryptograms'
                    },
                    'network-token': {
                        href: 'https://123456789.api.sandbox.checkout.com/network-tokens/nt_xgu3isllqfyu7ktpk5z2yxbwna'
                    }
                },
            });

        const cko = new Checkout('test_sk', {
            client: 'ack_test',
            scope: ['vault:network-tokens'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });

        const cryptogram = await cko.networkTokens.provisionCryptogram(
            'tok_ubfj2q76miwundwlk72vxt2i7q',
            { transaction_type: 'ecom' }
        );

        expect(cryptogram.cryptogram).to.exist;
        expect(cryptogram.eci).to.exist;
    });

    it('should throw auth error provisioning network token', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['vault:network-tokens']
        });

        nock('https://123456789.api.sandbox.checkout.com').post('/network-tokens').reply(401);

        try {
            const cko = new Checkout('test_sk', {
                client: 'ack_test',
                scope: ['vault:network-tokens'],
                environment: 'sandbox',
            subdomain: '123456789'
            });
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
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['vault:network-tokens']
        });

        nock('https://123456789.api.sandbox.checkout.com')
            .patch('/network-tokens/ntk_abc123/delete')
            .reply(204);

        const cko = new Checkout('test_sk', {
            client: 'ack_test',
            scope: ['vault:network-tokens'],
            subdomain: 'test',
            environment: 'sandbox',
            subdomain: '123456789'
        });
        const response = await cko.networkTokens.deleteNetworkToken("ntk_abc123");

        expect(response).to.not.be.null;
    });

    it('should throw auth error getting network token', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['vault:network-tokens']
        });

        nock('https://123456789.api.sandbox.checkout.com')
            .get('/network-tokens/tok_ubfj2q76miwundwlk72vxt2i7q')
            .reply(401);

        try {
            const cko = new Checkout('test_sk', {
                client: 'ack_test',
                scope: ['vault:network-tokens'],
                environment: 'sandbox',
            subdomain: '123456789'
            });
            await cko.networkTokens.getNetworkToken('tok_ubfj2q76miwundwlk72vxt2i7q');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw auth error provisioning cryptogram', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['vault:network-tokens']
        });

        nock('https://123456789.api.sandbox.checkout.com')
            .post('/network-tokens/tok_ubfj2q76miwundwlk72vxt2i7q/cryptograms')
            .reply(401);

        try {
            const cko = new Checkout('test_sk', {
                client: 'ack_test',
                scope: ['vault:network-tokens'],
                environment: 'sandbox',
            subdomain: '123456789'
            });
            await cko.networkTokens.provisionCryptogram(
                'tok_ubfj2q76miwundwlk72vxt2i7q',
                { transaction_type: 'ecom' }
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw auth error deleting network token', async () => {
        nock('https://123456789.access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: ['vault:network-tokens']
        });

        nock('https://123456789.api.sandbox.checkout.com')
            .patch('/network-tokens/ntk_abc123/delete')
            .reply(401);

        try {
            const cko = new Checkout('test_sk', {
                client: 'ack_test',
                scope: ['vault:network-tokens'],
                environment: 'sandbox',
            subdomain: '123456789'
            });
            await cko.networkTokens.deleteNetworkToken('ntk_abc123');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
