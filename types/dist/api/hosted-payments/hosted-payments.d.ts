import { config } from '../../Checkout';

export default class HostedPayments {
    constructor(config: config);

    create: (body: Object) => Promise<Object>;
}
