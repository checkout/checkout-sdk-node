import { config } from '../../Checkout';
export default class Payments {
    constructor(config: config);

    request: (body: Object, idempotencyKey?: string) => Promise<Object>;
    get: (id: string) => Promise<any>;
    getActions: (id: string) => Promise<Object>;
    capture: (paymentId: string, body?: Object, idempotencyKey?: string) => Promise<Object>;
    refund: (paymentId: string, body?: Object, idempotencyKey?: string) => Promise<Object>;
    void: (paymentId: string, body?: Object, idempotencyKey?: string) => Promise<Object>;
}
