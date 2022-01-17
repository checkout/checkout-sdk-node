import { config } from '../../Checkout';
export default class Marketplace {
    constructor(config: config);

    uploadFile: (purpose: String, path: String) => Promise<Object>;
    onboardSubEntity: (body: Object) => Promise<Object>;
    getSubEntityDetails: (id: String) => Promise<Object>;
    updateSubEntityDetails: (id: String, body: Object) => Promise<Object>;
    addPaymentInstrument: (id: String, body: Object) => Promise<Object>;
}
