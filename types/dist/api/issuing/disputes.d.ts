import { config } from '../../Checkout';

export default class Disputes {
    constructor(config: config);

    createDispute(body: object): Promise<object>;
    getDispute(disputeId: string): Promise<object>;
    cancelDispute(disputeId: string): Promise<object>;
    escalateDispute(disputeId: string, body?: object): Promise<object>;
    amendDispute(disputeId: string, body?: object): Promise<object>;
    /**
     * @deprecated Deprecated by the Checkout.com API. Create an Issuing dispute
     *   (which creates and submits it in one step) instead, or use `amendDispute`
     *   when the dispute status is `action_required`.
     */
    submitDispute(disputeId: string, body?: object): Promise<object>;
}
