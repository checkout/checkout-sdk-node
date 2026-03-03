import Cardholders from './cardholders.js';
import Cards from './cards.js';
import Controls from './controls.js';
import ControlGroups from './control-groups.js';
import ControlProfiles from './control-profiles.js';
import DigitalCards from './digital-cards.js';
import Disputes from './disputes.js';
import Transactions from './transactions.js';
import Simulate from './simulate.js';
import Access from './access.js';

/**
 * Main Issuing class that consolidates all issuing endpoints
 *
 * @export
 * @class Issuing
 */
export default class Issuing {
    constructor(config) {
        this.config = config;
        this.cardholders = new Cardholders(config);
        this.cards = new Cards(config);
        this.controls = new Controls(config);
        this.controlGroups = new ControlGroups(config);
        this.controlProfiles = new ControlProfiles(config);
        this.digitalCards = new DigitalCards(config);
        this.disputes = new Disputes(config);
        this.transactions = new Transactions(config);
        this.simulate = new Simulate(config);
        this.access = new Access(config);
    }

    // Backwards compatibility - delegate to submodules
    
    // Cardholders
    async createCardholder(body) {
        return this.cardholders.createCardholder(body);
    }

    async getCardholder(id) {
        return this.cardholders.getCardholder(id);
    }

    async updateCardholder(id, body) {
        return this.cardholders.updateCardholder(id, body);
    }

    async getCardholderCards(id) {
        return this.cardholders.getCardholderCards(id);
    }

    // Cards
    async createCard(body, idempotencyKey) {
        return this.cards.createCard(body, idempotencyKey);
    }

    async getCardDetails(id) {
        return this.cards.getCardDetails(id);
    }

    async updateCard(id, body) {
        return this.cards.updateCard(id, body);
    }

    async enrollThreeDS(id, body) {
        return this.cards.enrollThreeDS(id, body);
    }

    async updateThreeDS(id, body) {
        return this.cards.updateThreeDS(id, body);
    }

    async getThreeDSDetails(id) {
        return this.cards.getThreeDSDetails(id);
    }

    async activateCard(id) {
        return this.cards.activateCard(id);
    }

    async getCardCredentials(id, body) {
        return this.cards.getCardCredentials(id, body);
    }

    async renewCard(id, body) {
        return this.cards.renewCard(id, body);
    }

    async revokeCard(id, body) {
        return this.cards.revokeCard(id, body);
    }

    async scheduleCardRevocation(id, body) {
        return this.cards.scheduleCardRevocation(id, body);
    }

    async cancelScheduledCardRevocation(id) {
        return this.cards.cancelScheduledCardRevocation(id);
    }

    async suspendCard(id, body) {
        return this.cards.suspendCard(id, body);
    }

    // Controls
    async createCardControl(body) {
        return this.controls.createCardControl(body);
    }

    async getCardControls(params) {
        return this.controls.getCardControls(params);
    }

    async getCardControlDetails(id) {
        return this.controls.getCardControlDetails(id);
    }

    async updateCardControl(id, body) {
        return this.controls.updateCardControl(id, body);
    }

    async deleteCardControl(id) {
        return this.controls.deleteCardControl(id);
    }

    // Control Groups
    async createControlGroup(body) {
        return this.controlGroups.createControlGroup(body);
    }

    async getControlGroupByTarget(params) {
        return this.controlGroups.getControlGroupByTarget(params);
    }

    async getControlGroup(controlGroupId) {
        return this.controlGroups.getControlGroup(controlGroupId);
    }

    async deleteControlGroup(controlGroupId) {
        return this.controlGroups.deleteControlGroup(controlGroupId);
    }

    // Control Profiles
    async createControlProfile(body) {
        return this.controlProfiles.createControlProfile(body);
    }

    async getControlProfilesByTarget(params) {
        return this.controlProfiles.getControlProfilesByTarget(params);
    }

    async getControlProfile(controlProfileId) {
        return this.controlProfiles.getControlProfile(controlProfileId);
    }

    async updateControlProfile(controlProfileId, body) {
        return this.controlProfiles.updateControlProfile(controlProfileId, body);
    }

    async deleteControlProfile(controlProfileId) {
        return this.controlProfiles.deleteControlProfile(controlProfileId);
    }

    async addTargetToControlProfile(controlProfileId, targetId) {
        return this.controlProfiles.addTargetToControlProfile(controlProfileId, targetId);
    }

    async removeTargetFromControlProfile(controlProfileId, targetId) {
        return this.controlProfiles.removeTargetFromControlProfile(controlProfileId, targetId);
    }

    // Digital Cards
    async getDigitalCard(digitalCardId) {
        return this.digitalCards.getDigitalCard(digitalCardId);
    }

    // Disputes
    async createDispute(body) {
        return this.disputes.createDispute(body);
    }

    async getDispute(disputeId) {
        return this.disputes.getDispute(disputeId);
    }

    async cancelDispute(disputeId) {
        return this.disputes.cancelDispute(disputeId);
    }

    async escalateDispute(disputeId) {
        return this.disputes.escalateDispute(disputeId);
    }

    async submitDispute(disputeId) {
        return this.disputes.submitDispute(disputeId);
    }

    // Transactions
    async getTransactions(params) {
        return this.transactions.getTransactions(params);
    }

    async getTransactionById(transactionId) {
        return this.transactions.getTransactionById(transactionId);
    }

    // Simulate
    async simulateAuthorization(body) {
        return this.simulate.simulateAuthorization(body);
    }

    async simulateIncrement(id, body) {
        return this.simulate.simulateIncrement(id, body);
    }

    async simulateClearing(id, body) {
        return this.simulate.simulateClearing(id, body);
    }

    async simulateRefund(id, body) {
        return this.simulate.simulateRefund(id, body);
    }

    async simulateReversal(id, body) {
        return this.simulate.simulateReversal(id, body);
    }

    async simulateOobAuthentication(body) {
        return this.simulate.simulateOobAuthentication(body);
    }

    // Access
    async requestCardholderAccessToken(body) {
        return this.access.requestCardholderAccessToken(body);
    }
}
