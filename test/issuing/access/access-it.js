/**
 * Integration tests for Issuing Access (Cardholder Access Tokens) API.
 * Based on access-unit.js and checkout-sdk-net CardholderAccessTokenIntegrationTest
 */
import nock from 'nock';
import { expect } from 'chai';
import { NotFoundError } from '../../../src/services/errors.js';
import { cko_issuing, createCardholder } from '../issuing-common.js';

afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

describe.skip('Integration::Issuing::Access - AuthenticationError: Requires CHECKOUT_DEFAULT_OAUTH_ISSUING_CLIENT_ID and CHECKOUT_DEFAULT_OAUTH_ISSUING_CLIENT_SECRET with Issuing enabled', function () {
    it('should request cardholder access token', async function () {
        const cardholder = await createCardholder();
        const response = await cko_issuing.issuing.requestCardholderAccessToken({
            cardholder_id: cardholder.id,
        });
        expect(response).to.not.be.null;
        expect(response).to.have.property('access_token');
        expect(response).to.have.property('expires_in');
    });

    it('should throw NotFoundError when requesting access token for non-existent cardholder', async () => {
        try {
            await cko_issuing.issuing.requestCardholderAccessToken({
                cardholder_id: 'crh_not_found',
            });
            expect.fail('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
