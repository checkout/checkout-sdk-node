import { config } from '../../Checkout';

export default class ComplianceRequests {
    constructor(config: config);

    getComplianceRequest: (paymentId: string) => Promise<Object>;
    respondToComplianceRequest: (paymentId: string, body: Object) => Promise<Object>;
}
