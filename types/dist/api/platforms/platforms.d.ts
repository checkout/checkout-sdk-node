import { config } from '../../Checkout';
import Subentity from './subentity';
import PlatformFiles from './files';
import PaymentInstruments from './payment-instruments';
import PayoutSchedules from './payout-schedules';
import ReserveRules from './reserve-rules';

export default class Platforms {
    constructor(config: config);

    subentity: Subentity;
    files: PlatformFiles;
    paymentInstruments: PaymentInstruments;
    payoutSchedules: PayoutSchedules;
    reserveRules: ReserveRules;

    uploadFile: (purpose: string, path: string) => Promise<Object>;
    onboardSubEntity: (body: Object, schemaVersion?: string) => Promise<Object>;
    uploadAFile: (entityId: string, body: Object) => Promise<Object>;
    retrieveAFile: (entityId: string, fileId: string) => Promise<Object>;
    getSubEntityMembers: (entityId: string) => Promise<Object>;
    getSubEntityDetails: (id: string, schemaVersion?: string) => Promise<Object>;
    updateSubEntityDetails: (id: string, body: Object, schemaVersion?: string) => Promise<Object>;
    reinviteSubEntityMember: (entityId: string, userId: string, body: Object) => Promise<Object>;
    getPaymentInstrumentDetails: (entityId: string, id: string) => Promise<Object>;
    updatePaymentInstrumentDetails: (entityId: string, id: string, body: Object) => Promise<Object>;
    createPaymentInstrument: (id: string, body: Object) => Promise<Object>;
    addPaymentInstrument: (id: string, body: Object) => Promise<Object>;
    queryPaymentInstruments: (id: string, status?: string) => Promise<Object>;
    retrieveSubEntityPayoutSchedule: (id: string) => Promise<Object>;
    updateSubEntityPayoutSchedule: (id: string, body: Object) => Promise<Object>;
    getReserveRuleDetails: (entityId: string, id: string) => Promise<Object>;
    updateReserveRule: (entityId: string, id: string, body: Object, ifMatch: string) => Promise<Object>;
    addReserveRule: (id: string, body: Object) => Promise<Object>;
    queryReserveRules: (id: string) => Promise<Object>;
}
