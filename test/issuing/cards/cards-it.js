/**
 * Integration tests for Issuing Cards API.
 * Based on cards-unit.js and checkout-sdk-net CardIntegrationTest
 */
import nock from 'nock';
import { expect } from 'chai';
import { NotFoundError, ValidationError } from '../../../src/services/errors.js';
import {
    cko_issuing,
    ISSUING_CARD_PRODUCT_ID,
    ISSUING_CARD_PRODUCT_ID_BAD,
    createCardholder,
    createCard,
} from '../issuing-common.js';

afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

describe.skip('Integration::Issuing::Cards - AuthenticationError: Requires CHECKOUT_DEFAULT_OAUTH_ISSUING_CLIENT_ID and CHECKOUT_DEFAULT_OAUTH_ISSUING_CLIENT_SECRET with Issuing enabled', function () {
    let cardholder;
    let card;

    before(async function () {
        cardholder = await createCardholder();
        card = await createCard(cardholder);
    });

    it('should create a virtual card', async () => {
        const response = await cko_issuing.issuing.createCard({
            type: 'virtual',
            cardholder_id: cardholder.id,
            lifetime: { unit: 'Months', value: 6 },
            reference: "X-123456-N11'",
            card_product_id: ISSUING_CARD_PRODUCT_ID,
            display_name: 'JOHN KENNEDY',
            is_single_use: false,
            activate_card: false,
        });
        expect(response.id).to.not.be.null;
        expect(response.display_name).to.equal('JOHN KENNEDY');
        expect(response.reference).to.equal("X-123456-N11'");
    });

    it('should throw ValidationError when creating a card with invalid data', async () => {
        try {
            await cko_issuing.issuing.createCard({
                type: 'physical',
                cardholder_id: cardholder.id,
                lifetime: { unit: 'Months', value: 6 },
                reference: "X-123456-N11'",
                card_product_id: ISSUING_CARD_PRODUCT_ID_BAD,
                display_name: 'JOHN KENNEDY',
                activate_card: false,
            });
            expect.fail('Should have thrown ValidationError');
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });

    it('should get card', async () => {
        const response = await cko_issuing.issuing.getCardDetails(card.id);
        expect(response.id).to.equal(card.id);
        expect(response.cardholder_id).to.equal(cardholder.id);
        expect(response.card_product_id).to.equal(ISSUING_CARD_PRODUCT_ID);
        expect(response.reference).to.equal("X-123456-N11'");
    });

    it('should throw NotFoundError when getting a non-existent card', async () => {
        try {
            await cko_issuing.issuing.getCardDetails('not_found');
            expect.fail('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should enroll card into 3DS', async () => {
        const response = await cko_issuing.issuing.enrollThreeDS(card.id, {
            password: 'Xtui43FvfiZ',
            locale: 'en-US',
            phone_number: { country_code: '+1', number: '415 555 2671' },
        });
        expect(response).to.not.be.null;
    });

    it('should update enrollment into 3DS', async () => {
        const response = await cko_issuing.issuing.updateThreeDS(card.id, {
            security_pair: { question: 'Who are you?', answer: 'Bond. James Bond.' },
            password: 'Xtui43FvfiZ',
            locale: 'en-US',
            phone_number: { country_code: '+1', number: '415 555 2671' },
        });
        expect(response).to.not.be.null;
    });

    it('should get enrollment into 3DS', async () => {
        const response = await cko_issuing.issuing.getThreeDSDetails(card.id);
        expect(response).to.not.be.null;
        expect(response.locale).to.equal('en-US');
        expect(response.phone_number.country_code).to.equal('+1');
        expect(response.phone_number.number).to.equal('415 555 2671');
    });

    it('should activate a card', async () => {
        await cko_issuing.issuing.activateCard(card.id);
        const response = await cko_issuing.issuing.getCardDetails(card.id);
        expect(response.id).to.equal(card.id);
        expect(response.status).to.equal('active');
    });

    it('should get card credentials', async () => {
        const response = await cko_issuing.issuing.getCardCredentials(card.id, {
            credentials: 'number, cvc2',
        });
        expect(response.number).to.not.be.null;
        expect(response.cvc2).to.not.be.null;
    });

    it('should suspend a card', async () => {
        await cko_issuing.issuing.suspendCard(card.id, { reason: 'suspected_lost' });
        const response = await cko_issuing.issuing.getCardDetails(card.id);
        expect(response.id).to.equal(card.id);
        expect(response.status).to.equal('suspended');
    });

    it('should revoke a card', async () => {
        await cko_issuing.issuing.revokeCard(card.id, { reason: 'reported_lost' });
        const response = await cko_issuing.issuing.getCardDetails(card.id);
        expect(response.id).to.equal(card.id);
        expect(response.status).to.equal('revoked');
    });
});
