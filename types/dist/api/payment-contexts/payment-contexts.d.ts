import { config } from '../../Checkout';

export default class PaymentContexts {
    constructor(config: config);

    request: (body: object, idempotencyKey?: string) => Promise<object>;
    get: (id: string) => Promise<object>;
}
