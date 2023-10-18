import { config } from '../../Checkout';

export default class Disputes {
    constructor(config: config);

    get: (body: Object) => Promise<Object>;
    getDetails: (disputeId: string) => Promise<Object>;
    accept: (disputeId: string) => Promise<Object>;
    provideEvidence: (disputeId: string, body: Object) => Promise<Object>;
    getEvidence: (disputeId: string) => Promise<Object>;
    submit: (disputeId: string) => Promise<Object>;
    getDisputeSchemeFiles: (disputeId: string) => Promise<Object>;
}
