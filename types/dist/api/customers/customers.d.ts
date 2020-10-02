import { config } from '../../Checkout';
export default class Customers {
    constructor(config: config);

    update: (id: string, body: Object) => Promise<Object>;
}
