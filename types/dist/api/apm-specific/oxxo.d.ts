import { config } from '../../Checkout';

export default class Oxxo {
    constructor(config: config);

    succeed: (id: string) => Promise<Object>;
    expire: (id: string) => Promise<Object>;
}
