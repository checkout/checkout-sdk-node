import { config } from '../../Checkout';
export default class Balances {
    constructor(config: config);

    retrieve: (id: string) => Promise<any>;
}
