import Subentity from './subentity.js';
import PlatformFiles from './files.js';
import PaymentInstruments from './payment-instruments.js';
import PayoutSchedules from './payout-schedules.js';
import ReserveRules from './reserve-rules.js';

/**
 * Class dealing with the Platforms API (tag "Platforms" in swagger-spec.json).
 * Operations use paths under /accounts/entities; see API Reference and swagger-spec.json.
 *
 * Submodules: subentity, files, paymentInstruments, payoutSchedules, reserveRules.
 *
 * @export
 * @class Platforms
 */
export default class Platforms {
    constructor(config) {
        this.config = config;
        this.subentity = new Subentity(config);
        this.files = new PlatformFiles(config);
        this.paymentInstruments = new PaymentInstruments(config);
        this.payoutSchedules = new PayoutSchedules(config);
        this.reserveRules = new ReserveRules(config);
    }

    // ——— Files (backwards compatibility) ———
    async uploadFile(purpose, path) {
        return this.files.uploadFile(purpose, path);
    }

    async uploadAFile(entityId, body) {
        return this.files.uploadAFile(entityId, body);
    }

    async retrieveAFile(entityId, fileId) {
        return this.files.retrieveAFile(entityId, fileId);
    }

    // ——— Sub-entity (backwards compatibility) ———
    async onboardSubEntity(body, schemaVersion) {
        return this.subentity.onboardSubEntity(body, schemaVersion);
    }

    async getSubEntityDetails(id, schemaVersion) {
        return this.subentity.getSubEntityDetails(id, schemaVersion);
    }

    async updateSubEntityDetails(id, body, schemaVersion) {
        return this.subentity.updateSubEntityDetails(id, body, schemaVersion);
    }

    async getSubEntityMembers(entityId) {
        return this.subentity.getSubEntityMembers(entityId);
    }

    async reinviteSubEntityMember(entityId, userId, body) {
        return this.subentity.reinviteSubEntityMember(entityId, userId, body);
    }

    // ——— Payment instruments (backwards compatibility) ———
    async getPaymentInstrumentDetails(entityId, id) {
        return this.paymentInstruments.getPaymentInstrumentDetails(entityId, id);
    }

    async updatePaymentInstrumentDetails(entityId, id, body) {
        return this.paymentInstruments.updatePaymentInstrumentDetails(entityId, id, body);
    }

    async createPaymentInstrument(id, body) {
        return this.paymentInstruments.createPaymentInstrument(id, body);
    }

    async addPaymentInstrument(id, body) {
        return this.paymentInstruments.addPaymentInstrument(id, body);
    }

    async queryPaymentInstruments(id, status) {
        return this.paymentInstruments.queryPaymentInstruments(id, status);
    }

    // ——— Payout schedules (backwards compatibility) ———
    async retrieveSubEntityPayoutSchedule(id) {
        return this.payoutSchedules.retrieveSubEntityPayoutSchedule(id);
    }

    async updateSubEntityPayoutSchedule(id, body) {
        return this.payoutSchedules.updateSubEntityPayoutSchedule(id, body);
    }

    // ——— Reserve rules (backwards compatibility) ———
    async getReserveRuleDetails(entityId, id) {
        return this.reserveRules.getReserveRuleDetails(entityId, id);
    }

    async updateReserveRule(entityId, id, body, ifMatch) {
        return this.reserveRules.updateReserveRule(entityId, id, body, ifMatch);
    }

    async addReserveRule(id, body) {
        return this.reserveRules.addReserveRule(id, body);
    }

    async queryReserveRules(id) {
        return this.reserveRules.queryReserveRules(id);
    }
}
