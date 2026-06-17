import { config } from '../../Checkout';

export default class Disputes {
    constructor(config: config);

    createDispute(body: object): Promise<object>;
    getDispute(disputeId: string): Promise<object>;
    cancelDispute(disputeId: string): Promise<object>;
    escalateDispute(disputeId: string): Promise<object>;
    /**
     * @deprecated Removed from the Checkout.com API on 2026-04-15.
     *   The submit step is now handled automatically when a dispute is created.
     *   Retained on the client for backwards compatibility; the endpoint will
     *   return 404 on the current API.
     */
    submitDispute(disputeId: string): Promise<object>;
}
