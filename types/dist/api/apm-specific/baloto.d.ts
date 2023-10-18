import { config } from '../../Checkout';

export default class Bolato {
    constructor(config: config);

    succeed: (id: string) => Promise<Object>;
    expire: (id: string) => Promise<Object>;
}
