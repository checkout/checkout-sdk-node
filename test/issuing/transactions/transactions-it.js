/**
 * Integration tests for Issuing Transactions API.
 * Based on transactions-unit.js and checkout-sdk-net TransactionsIntegrationTest
 */
import nock from 'nock';
import { expect } from 'chai';
import { NotFoundError } from '../../../src/services/errors.js';
import { cko_issuing } from '../issuing-common.js';

afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

describe.skip('Integration::Issuing::Transactions - AuthenticationError: Requires CHECKOUT_DEFAULT_OAUTH_ISSUING_CLIENT_ID and CHECKOUT_DEFAULT_OAUTH_ISSUING_CLIENT_SECRET with Issuing enabled', function () {
    it('should get transactions list', async () => {
        const response = await cko_issuing.issuing.getTransactions();
        expect(response).to.not.be.null;
        const list = response.data ?? response;
        expect(Array.isArray(list) || (typeof list === 'object' && list !== null)).to.be.true;
    });

    it('should throw NotFoundError when getting non-existent transaction', async () => {
        try {
            await cko_issuing.issuing.getTransactionById('trx_not_found');
            expect.fail('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
