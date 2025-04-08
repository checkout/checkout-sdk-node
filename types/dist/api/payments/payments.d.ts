import { config } from '../../Checkout';

export default class Payments {
    constructor(config: config);

    request: (body: Object, idempotencyKey?: string) => Promise<Object>;
    getPaymentList: (body?: Object) => Promise<any>;
    get: (id: string) => Promise<any>;
    getActions: (id: string) => Promise<Object>;
    increment: (paymentId: string, body?: Object, idempotencyKey?: string) => Promise<Object>;
    cancelScheduledRetry: (id: string, body?: Object, idempotencyKey?: string) => Promise<Object>;
    capture: (paymentId: string, body?: Object, idempotencyKey?: string) => Promise<Object>;
    refund: (paymentId: string, body?: Object, idempotencyKey?: string) => Promise<Object>;
    reverse: (paymentId: string, body?: Object, idempotencyKey?: string) => Promise<Object>;
    void: (paymentId: string, body?: Object, idempotencyKey?: string) => Promise<Object>;
    search: (body: Object) => Promise<Object>;
}
