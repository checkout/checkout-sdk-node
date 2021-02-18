import { config } from '../../Checkout';

export default class PaymentLinks {
    constructor(config: config);

    create: (body: Object) => Promise<Object>;
}
