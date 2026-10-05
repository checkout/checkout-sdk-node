import {config} from '../../Checkout';

/** PATCH body (PlatformsPaymentInstrumentUpdate). headers is sent as HTTP headers, not in the body. */
export type UpdatePaymentInstrumentRequest = {
    label?: string;
    /** Deprecated by the API. */
    default?: boolean;
    /** The ETag from the GET; the API answers 428 without it and 412 when it does not match. */
    headers?: { 'if-match': string; [key: string]: string };
    [key: string]: any;
};

export default class PaymentInstruments {
    constructor(config: config);

    getPaymentInstrumentDetails: (entityId: string, id: string) => Promise<Object>;
    updatePaymentInstrumentDetails: (entityId: string, id: string, body: UpdatePaymentInstrumentRequest | Object) => Promise<Object>;
    createPaymentInstrument: (id: string, body: Object) => Promise<Object>;
    addPaymentInstrument: (id: string, body: Object) => Promise<Object>;
    queryPaymentInstruments: (id: string, status?: string) => Promise<Object>;
}
