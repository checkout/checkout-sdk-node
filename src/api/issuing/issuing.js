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

    /**
     * Updates a card you issued previously.
     *
     * Only the fields you provide values for are updated. Passing `null` for a field **removes**
     * its existing value, so omit a field to leave it untouched rather than sending null.
     *
     * The `headers` parameter (`return-encrypted-cvv`, `Encryption-Key`) is deprecated: the API
     * no longer documents these headers, and the response does not carry encrypted
     * credentials. When set, they are still sent unchanged, on a copy of the config
     * rather than on the body. Use the method without headers; the parameter will be removed in
     * the next major version.
     *
     * `body.status` (string enum, optional, only `active` allowed) reactivates an
     * `inactive` or `suspended` card. Mutually exclusive with
     * `scheduled_activation_date`; the API returns
     * `scheduled_activation_date_conflicts_with_activation` if both are set.
     *
     * `body.scheduled_revocation_date` (string, `YYYY-MM-DD`, optional) schedules
     * the card to be revoked at midnight UTC on that date. Replaces the deprecated
     * `revocation_date` field; if both are provided, `scheduled_revocation_date` wins.
     *
     * The response has the same fields as the get-card response (including
     * `last_activated_on` and `scheduled_revocation_date`), plus a required
     * `last_modified_date`. It does not include `encrypted_cvv`. For a virtual card, the
     * response may also include `is_single_use` (boolean), specifying whether the card is set
     * to expire after a single use; physical cards never send it.
     *
     * @memberof Issuing
     * @param {string} id Card id. Pattern `^crd_[a-z0-9]{26}$`, exactly 30 characters.
     * @param {Object} body Card params to update: `status`, `reference`, `metadata`,
     *   `expiry_month`, `expiry_year`, `scheduled_revocation_date`, `revocation_date`
     *   (deprecated, use `scheduled_revocation_date`) and `scheduled_activation_date`.
     * @param {Object} [headers] Deprecated. The API no longer documents these headers; use the
     *   method without headers. Will be removed in the next major version. When set, they are
     *   still sent unchanged.
     * @param {boolean} [headers.return-encrypted-cvv] Deprecated, see `headers`.
     * @param {string} [headers.Encryption-Key] Deprecated, see `headers`.
     * @return {Promise<Object>} A promise to the card update response (update-card-response):
     *   `id`, `client_id`, `entity_id`, `cardholder_id`, `card_product_id`, `user_id`,
     *   `last_four`, `expiry_month`, `expiry_year`, `status`, `display_name`, `type`,
     *   `billing_currency`, `issuing_country`, `reference`, `metadata`,
     *   `scheduled_revocation_date`, `revocation_date` (deprecated, use
     *   `scheduled_revocation_date`), `scheduled_activation_date`, `last_activated_on`,
     *   `root_card_id`, `parent_card_id`, `scheme`, `created_date`, `last_modified_date`, `_links`
     *   and, for virtual cards only (`type` is `virtual`), `is_single_use`.
     */
    async updateCard(id, body, headers) {
        return this.cards.updateCard(id, body, headers);
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

    /**
     * Revokes an inactive, active, or suspended card to permanently decline all incoming authorizations.
     *
     * @memberof Issuing
     * @param {string} id Card id. Pattern `^crd_[a-z0-9]{26}$`, exactly 30 characters.
     * @param {Object} [body] Optional revoke-card request. When omitted, the request is sent
     *   without a body.
     * @param {string} [body.reason] Optional reason: `expired`, `reported_lost` or `reported_stolen`.
     * @return {Promise<Object>} A promise to the revoke-card response, carrying `_links`.
     */
    async revokeCard(id, body) {
        return this.cards.revokeCard(id, body);
    }

    /**
     * Suspends an active or inactive card to temporarily decline all incoming authorizations.
     *
     * @memberof Issuing
     * @param {string} id Card id. Pattern `^crd_[a-z0-9]{26}$`, exactly 30 characters.
     * @param {Object} [body] Optional suspend-card request. When omitted, the request is sent
     *   without a body.
     * @param {string} [body.reason] Optional reason: `suspected_lost` or `suspected_stolen`.
     * @return {Promise<Object>} A promise to the suspend-card response, carrying `_links`.
     */
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

    async escalateDispute(disputeId, body) {
        return this.disputes.escalateDispute(disputeId, body);
    }

    async amendDispute(disputeId, body) {
        return this.disputes.amendDispute(disputeId, body);
    }

    /**
     * @deprecated Deprecated by the Checkout.com API. Create an Issuing dispute
     *   instead, or use `amendDispute` when the dispute status is `action_required`.
     */
    async submitDispute(disputeId, body) {
        return this.disputes.submitDispute(disputeId, body);
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
