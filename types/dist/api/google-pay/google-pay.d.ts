import { config } from '../../Checkout';

export default class GooglePay {
    constructor(config: config);

    enroll: (body: Object) => Promise<Object>;
    registerDomain: (entityId: string, body: Object) => Promise<Object>;
    getRegisteredDomains: (entityId: string) => Promise<Object>;
    getEnrollmentState: (entityId: string) => Promise<Object>;
}
