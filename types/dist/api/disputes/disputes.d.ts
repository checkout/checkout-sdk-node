import { config } from '../../Checkout';
export default class Disputes {
    constructor(config: config);

    get: (body: Object) => Promise<Object>;
    getDetails: (disputeId: String) => Promise<Object>;
    retrieveEvent: (eventId: String) => Promise<Object>;
    accept: (disputeId: String) => Promise<Object>;
    provideEvidence: (disputeId: String, body: Object) => Promise<Object>;
    getEvidence: (disputeId: String) => Promise<Object>;
    submit: (disputeId: String) => Promise<Object>;
}
