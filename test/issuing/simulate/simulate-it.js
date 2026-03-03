/**
 * Integration tests for Issuing Simulate (Authorizations) API.
 * Based on simulate-unit.js and checkout-sdk-net TestingIntegrationTest
 */
import nock from 'nock';
import { expect } from 'chai';
import {
    cko_issuing,
    createCardholder,
    createCard,
    createCardControl,
    createSimulatedTransaction,
} from '../issuing-common.js';

afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

describe.skip('Integration::Issuing::Simulate - AuthenticationError: Requires CHECKOUT_DEFAULT_OAUTH_ISSUING_CLIENT_ID and CHECKOUT_DEFAULT_OAUTH_ISSUING_CLIENT_SECRET with Issuing enabled', function () {
    let cardholder;
    let card;
    let cardDetails;
    let transaction;

    before(async function () {
        cardholder = await createCardholder();
        card = await createCard(cardholder, true);
        cardDetails = await cko_issuing.issuing.getCardDetails(card.id);
        transaction = await createSimulatedTransaction(card, cardDetails);
    });

    it('should simulate an authorization', async () => {
        const response = await cko_issuing.issuing.simulateAuthorization({
            card: {
                id: card.id,
                expiry_month: cardDetails.expiry_month,
                expiry_year: cardDetails.expiry_year,
            },
            transaction: { type: 'purchase', amount: 2500, currency: 'GBP' },
        });
        expect(response).to.not.be.null;
        expect(response.status).to.equal('Authorized');
    });

    it('should fail to authorize when amount is bigger than limit', async () => {
        await createCardControl(card);
        try {
            await cko_issuing.issuing.simulateAuthorization({
                card: {
                    id: card.id,
                    expiry_month: cardDetails.expiry_month,
                    expiry_year: cardDetails.expiry_year,
                },
                transaction: { type: 'purchase', amount: 100000, currency: 'GBP' },
            });
        } catch (err) {
            expect(err.http_code).to.equal(401);
        }
    });

    it('should simulate an increment authorization', async () => {
        const response = await cko_issuing.issuing.simulateIncrement(transaction.id, {
            amount: 2500,
        });
        expect(response).to.not.be.null;
        expect(response.status).to.equal('Authorized');
    });

    it('should simulate the clearing of an authorized transaction', async () => {
        const response = await cko_issuing.issuing.simulateClearing(transaction.id, {
            amount: 100,
        });
        expect(response).to.not.be.null;
    });

    it('should simulate the reversal of an authorized transaction', async () => {
        const response = await cko_issuing.issuing.simulateReversal(transaction.id, {
            amount: 100,
        });
        expect(response).to.not.be.null;
        expect(response.status).to.equal('Reversed');
    });
});
