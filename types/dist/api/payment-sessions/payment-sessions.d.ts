import { config } from '../../Checkout';

export default class PaymentSessions {
    constructor(config: config);

    request: (body: object) => Promise<object>;
}
