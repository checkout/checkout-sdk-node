import {config} from '../../Checkout';

export default class PaymentInstruments {
    constructor(config: config);

    getPaymentInstrumentDetails: (entityId: string, id: string) => Promise<Object>;
    updatePaymentInstrumentDetails: (entityId: string, id: string, body: Object) => Promise<Object>;
    createPaymentInstrument: (id: string, body: Object) => Promise<Object>;
    addPaymentInstrument: (id: string, body: Object) => Promise<Object>;
    queryPaymentInstruments: (id: string, status?: string) => Promise<Object>;
}
