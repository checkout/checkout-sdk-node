import { config } from '../../Checkout';

export default class PaymentMethods {
    constructor(config: config);

    getPaymentMethods: (processing_channel_id: string) => Promise<Object>;
}
