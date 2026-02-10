import { expect } from 'chai';
import nock from 'nock';
import Checkout from '../../src/Checkout.js';
import { AuthenticationError, NotFoundError, ValidationError } from '../../src/services/errors.js';

afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

const cko = new Checkout(process.env.CHECKOUT_DEFAULT_SECRET_KEY);

describe('Integration::NetworkTokens', () => {
    describe('Provision Network Token', () => {
        it.skip('should provision a network token from a card source', async () => {
            const networkToken = await cko.networkTokens.provisionNetworkToken({
                source: {
                    type: 'id',
                    id: 'src_wmlfc3zyhqzehihu7giusaaawu',
                },
            });

            expect(networkToken.network_token).to.exist;
            expect(networkToken.network_token.token_type).to.equal('network');
            expect(networkToken.network_token.token).to.not.be.null;
            expect(networkToken.card).to.exist;
        });

        it('should throw error when provisioning with invalid source', async () => {
            try {
                await cko.networkTokens.provisionNetworkToken({
                    source: {
                        type: 'id',
                        id: 'src_invalid_source_id',
                    },
                });
                expect.fail('Should have thrown an error');
            } catch (err) {
                expect(err).to.exist;
            }
        });
    });

    describe('Get Network Token', () => {
        it.skip('should get a network token by ID', async () => {
            const provisionedToken = await cko.networkTokens.provisionNetworkToken({
                source: {
                    type: 'id',
                    id: 'src_wmlfc3zyhqzehihu7giusaaawu',
                },
            });

            const networkToken = await cko.networkTokens.getNetworkToken(
                provisionedToken.network_token.token
            );

            expect(networkToken.token).to.equal(provisionedToken.network_token.token);
            expect(networkToken.state).to.exist;
            expect(networkToken.token_type).to.equal('network');
        });

        it('should throw error when getting non-existent network token', async () => {
            try {
                await cko.networkTokens.getNetworkToken('tok_nonexistent');
                expect.fail('Should have thrown an error');
            } catch (err) {
                expect(err).to.exist;
            }
        });
    });

    describe('Provision Cryptogram', () => {
        it.skip('should request a cryptogram for a network token', async () => {
            const provisionedToken = await cko.networkTokens.provisionNetworkToken({
                source: {
                    type: 'id',
                    id: 'src_wmlfc3zyhqzehihu7giusaaawu',
                },
            });

            const cryptogram = await cko.networkTokens.provisionCryptogram(
                provisionedToken.network_token.token,
                { transaction_type: 'ecom' }
            );

            expect(cryptogram.cryptogram).to.exist;
            expect(cryptogram.eci).to.exist;
        });

        it('should throw error when requesting cryptogram for non-existent token', async () => {
            try {
                await cko.networkTokens.provisionCryptogram('tok_nonexistent', {
                    transaction_type: 'ecom',
                });
                expect.fail('Should have thrown an error');
            } catch (err) {
                expect(err).to.exist;
            }
        });
    });

    describe('Delete Network Token', () => {
        it.skip('should delete a network token', async () => {
            const provisionedToken = await cko.networkTokens.provisionNetworkToken({
                source: {
                    type: 'id',
                    id: 'src_wmlfc3zyhqzehihu7giusaaawu',
                },
            });

            const response = await cko.networkTokens.deleteNetworkToken(
                provisionedToken.network_token.token
            );

            expect(response).to.not.be.null;
            expect(response.status).to.exist;
        });

        it('should throw error when deleting non-existent network token', async () => {
            try {
                await cko.networkTokens.deleteNetworkToken('ntk_nonexistent');
                expect.fail('Should have thrown an error');
            } catch (err) {
                expect(err).to.exist;
            }
        });
    });
});
