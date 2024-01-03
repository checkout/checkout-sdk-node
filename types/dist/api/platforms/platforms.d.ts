import { config } from '../../Checkout';

export default class Platforms {
    constructor(config: config);

    uploadFile: (purpose: string, path: string) => Promise<Object>;
    onboardSubEntity: (body: Object) => Promise<Object>;
    uploadAFile: (entityId: string, body: Object) => Promise<Object>;
    retrieveAFile: (entityId: string, fileId: string) => Promise<Object>;
    getSubEntityMembers: (entityId: string) => Promise<Object>;
    getSubEntityDetails: (id: string) => Promise<Object>;
    updateSubEntityDetails: (id: string, body: Object) => Promise<Object>;
    getPaymentInstrumentDetails: (entityId: string, id: string) => Promise<Object>;
    updatePaymentInstrumentDetails: (entityId: string, id: string, body: Object) => Promise<Object>;
    createPaymentInstrument: (id: string, body: Object) => Promise<Object>;
    addPaymentInstrument: (id: string, body: Object) => Promise<Object>;
    queryPaymentInstruments: (id: string, status?: string) => Promise<Object>;
    retrieveSubEntityPayoutSchedule: (id: string) => Promise<Object>;
    updateSubEntityPayoutSchedule: (body: Object) => Promise<Object>;
}
