import { config } from '../../Checkout';

export default class Transfers {
    constructor(config: config);

    initiate: (body: Object) => Promise<Object>;
    retrieve: (id: string) => Promise<any>;
}
