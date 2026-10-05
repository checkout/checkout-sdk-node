import { config } from '../../Checkout';
import Subentity, { OnboardSubEntityRequest } from './subentity';
import PlatformFiles from './files';
import PaymentInstruments from './payment-instruments';
import PayoutSchedules from './payout-schedules';
import ReserveRules from './reserve-rules';
import EntityRequirements from './entity-requirements';

export default class Platforms {
    constructor(config: config);

    subentity: Subentity;
    files: PlatformFiles;
    paymentInstruments: PaymentInstruments;
    payoutSchedules: PayoutSchedules;
    reserveRules: ReserveRules;
    entityRequirements: EntityRequirements;

    uploadFile: PlatformFiles['uploadFile'];
    onboardSubEntity: (body: OnboardSubEntityRequest, schemaVersion?: string) => Promise<Object>;
    uploadAFile: PlatformFiles['uploadAFile'];
    retrieveAFile: PlatformFiles['retrieveAFile'];
    getSubEntityMembers: (entityId: string) => Promise<Object>;
    getSubEntityDetails: (id: string, schemaVersion?: string) => Promise<Object>;
    updateSubEntityDetails: (id: string, body: OnboardSubEntityRequest, schemaVersion?: string) => Promise<Object>;
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
    getEntityRequirements: (entityId: string, schemaVersion?: string) => Promise<Object>;
    getEntityRequirementDetails: (entityId: string, requirementId: string) => Promise<Object>;
    updateEntityRequirement: (entityId: string, requirementId: string, body: Object) => Promise<Object>;
}
