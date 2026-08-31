/**
 * Integration tests for Issuing Cardholders API.
 * Based on cardholders-unit.js and checkout-sdk-net CardholdersIntegrationTest
 */
import nock from 'nock';
import { expect } from 'chai';
import { NotFoundError, ValidationError } from '../../../src/services/errors.js';
import {
    cko_issuing,
    createCardholder,
    cardholderRequestBody,
} from '../issuing-common.js';

afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

describe.skip('Integration::Issuing::Cardholders - AuthenticationError: Requires CHECKOUT_DEFAULT_OAUTH_ISSUING_CLIENT_ID and CHECKOUT_DEFAULT_OAUTH_ISSUING_CLIENT_SECRET with Issuing enabled', function () {
    let cardholder;

    before(async function () {
        cardholder = await createCardholder();
    });

    it('should create a cardholder', async () => {
        const response = await cko_issuing.issuing.createCardholder(cardholderRequestBody());
        expect(response.id).to.not.be.null;
        expect(response.type).to.equal('individual');
        expect(response.status).to.equal('active');
    });

    it('should throw ValidationError when creating a cardholder with invalid data', async () => {
        try {
            await cko_issuing.issuing.createCardholder({
                ...cardholderRequestBody(),
                entity_id: 'ent_fa6psq242dcd6fdn5gifcq1491',
            });
            expect.fail('Should have thrown ValidationError');
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });

    it('should get a cardholder', async () => {
        const response = await cko_issuing.issuing.getCardholder(cardholder.id);
        expect(response.id).to.equal(cardholder.id);
        expect(response.type).to.equal(cardholder.type);
        expect(response.first_name).to.equal('John');
        expect(response.last_name).to.equal('Kennedy');
    });

    it('should update a cardholder', async () => {
        const updated = await cko_issuing.issuing.updateCardholder(cardholder.id, {
            reference: 'X-123456-N11-UPDATED',
            email: 'john.kennedy.updated@myemaildomain.com',
        });
        expect(updated.id).to.equal(cardholder.id);
        expect(updated.reference).to.equal('X-123456-N11-UPDATED');
    });

    it('should throw NotFoundError when getting a non-existent cardholder', async () => {
        try {
            await cko_issuing.issuing.getCardholder('not_found');
            expect.fail('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should throw NotFoundError when updating a non-existent cardholder', async () => {
        try {
            await cko_issuing.issuing.updateCardholder('not_found', { reference: 'test' });
            expect.fail('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should get a cardholders cards', async () => {
        const response = await cko_issuing.issuing.getCardholderCards(cardholder.id);
        const cards = response.cards ?? response.data ?? [];
        expect(cards).to.be.an('array');
        for (const card of cards) {
            expect(card.cardholder_id).to.equal(cardholder.id);
        }
    });

    it('should throw NotFoundError when getting cards for a non-existent cardholder', async () => {
        try {
            await cko_issuing.issuing.getCardholderCards('not_found');
            expect.fail('Should have thrown NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
