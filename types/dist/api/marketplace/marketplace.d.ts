import { config } from '../../Checkout';
export default class Marketplace {
    constructor(config: config);

    uploadFile: (purpose: string, path: string) => Promise<Object>;
    onboardSubEntity: (body: Object) => Promise<Object>;
    getSubEntityDetails: (id: string) => Promise<Object>;
    updateSubEntityDetails: (id: string, body: Object) => Promise<Object>;
    addPaymentInstrument: (id: string, body: Object) => Promise<Object>;
}
