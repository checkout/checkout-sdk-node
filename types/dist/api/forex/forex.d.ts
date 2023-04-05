import { config } from '../../Checkout';

export default class Forex {
    constructor(config: config);

    request: (body: Object) => Promise<Object>;
    getRates: (body: Object) => Promise<Object>;
}
