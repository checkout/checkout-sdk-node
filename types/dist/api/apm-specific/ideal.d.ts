import { config } from '../../Checkout';

export default class Ideal {
    constructor(config: config);

    get: () => Promise<Object>;
    getIssuers: () => Promise<Object>;
}
