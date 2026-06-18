import { config } from '../../Checkout';

type BalancesRetrieveOptions = {
    query?: string;
    withCurrencyAccountId?: boolean;
    balancesAt?: string;
};

export default class Balances {
    constructor(config: config);

    retrieve: (id: string, options?: string | BalancesRetrieveOptions) => Promise<any>;
}
