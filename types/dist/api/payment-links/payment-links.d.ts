import { config } from '../../Checkout';

export default class PaymentLinks {
    constructor(config: config);

    create: (body: Object) => Promise<Object>;
    get: (id: string) => Promise<Object>;
}
