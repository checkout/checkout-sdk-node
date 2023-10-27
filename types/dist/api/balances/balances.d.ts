import { config } from '../../Checkout';

export default class Balances {
    constructor(config: config);

    retrieve: (id: string, currency?: string) => Promise<any>;
}
