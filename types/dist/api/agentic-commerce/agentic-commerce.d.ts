import { config } from '../../Checkout';

export default class AgenticCommerce {
    constructor(config: config);

    createDelegatedPaymentToken: (body: Object, idempotencyKey?: string) => Promise<Object>;
}
