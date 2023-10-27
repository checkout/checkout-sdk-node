import {config} from '../../Checkout';

export default class Instruments {
    constructor(config: config);

    create: (body: Object) => Promise<Object>;
    get: (id: string) => Promise<Object>;
    update: (id: string, body: Object) => Promise<Object>;
    delete: (id: string) => Promise<Object>;
    getBankAccountFieldFormatting: (country: string, currency: string) => Promise<Object>;
}
