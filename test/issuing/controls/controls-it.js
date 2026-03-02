/**
 * Integration tests for Issuing Card Controls API.
 * Based on controls-unit.js and checkout-sdk-net ControlsIntegrationTest
 */
import nock from 'nock';
import { expect } from 'chai';
import {
    cko_issuing,
    createCardholder,
    createCard,
    createCardControl,
} from '../issuing-common.js';

afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

describe.skip('Integration::Issuing::Controls - AuthenticationError: Requires CHECKOUT_DEFAULT_OAUTH_ISSUING_CLIENT_ID and CHECKOUT_DEFAULT_OAUTH_ISSUING_CLIENT_SECRET with Issuing enabled', function () {
    let cardholder;
    let card;
    let control;

    before(async function () {
        cardholder = await createCardholder();
        card = await createCard(cardholder, true);
        control = await createCardControl(card);
    });

    it('should create a card control', async () => {
        const response = await cko_issuing.issuing.createCardControl({
            description: 'Max spend of 500€ per week for restaurants',
            control_type: 'velocity_limit',
            target_id: card.id,
            velocity_limit: {
                amount_limit: 5000,
                velocity_window: { type: 'weekly' },
            },
        });
        expect(response).to.not.be.null;
        expect(response.target_id).to.equal(card.id);
        expect(response.control_type).to.equal('velocity_limit');
        expect(response.velocity_limit.amount_limit).to.equal(5000);
        expect(response.velocity_limit.velocity_window.type).to.equal('weekly');
    });

    it('should get a card`s controls', async () => {
        const response = await cko_issuing.issuing.getCardControls({ target_id: card.id });
        expect(response).to.not.be.null;
        for (const ctrl of response.controls) {
            expect(ctrl.target_id).to.equal(card.id);
            expect(ctrl.control_type).to.oneOf(['velocity_limit', 'mcc_limit']);
        }
    });

    it('should get a card`s control details', async () => {
        const response = await cko_issuing.issuing.getCardControlDetails(control.id);
        expect(response).to.not.be.null;
        expect(response.id).to.equal(control.id);
        expect(response.target_id).to.equal(card.id);
        expect(response.control_type).to.equal('velocity_limit');
        expect(response.velocity_limit.amount_limit).to.equal(5000);
        expect(response.velocity_limit.velocity_window.type).to.equal('weekly');
    });

    it('should update a card control', async () => {
        const response = await cko_issuing.issuing.updateCardControl(control.id, {
            description: 'Max spend of 500€ per day for restaurants',
            velocity_limit: {
                amount_limit: 5000,
                velocity_window: { type: 'daily' },
            },
        });
        expect(response).to.not.be.null;
        expect(response.target_id).to.equal(card.id);
        expect(response.control_type).to.equal('velocity_limit');
        expect(response.velocity_limit.velocity_window.type).to.equal('daily');
    });

    it('should delete a card`s control', async () => {
        const response = await cko_issuing.issuing.deleteCardControl(control.id);
        expect(response).to.not.be.null;
        expect(response.id).to.equal(control.id);
    });
});
