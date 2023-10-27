import { config } from '../../Checkout';

export default class Customers {
    constructor(config: config);

    create: (customer: Object) => Promise<Object>;
    get: (id: string) => Promise<Object>;
    update: (id: string, body: Object) => Promise<Object>;
    delete: (id: string) => Promise<Object>;
}
