import { config } from '../../Checkout';

export default class Disputes {
    constructor(config: config);

    createDispute(body: object): Promise<object>;
    getDispute(disputeId: string): Promise<object>;
    cancelDispute(disputeId: string): Promise<object>;
    escalateDispute(disputeId: string): Promise<object>;
    submitDispute(disputeId: string): Promise<object>;
}
