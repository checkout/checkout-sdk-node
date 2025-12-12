import { config } from '../../Checkout';

export default class PaymentSetups {
    constructor(config: config);

    request: (body: object) => Promise<object>;
}
