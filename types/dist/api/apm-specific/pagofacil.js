import { config } from '../../Checkout';
export default class Fawry {
    constructor(config: config);

    succeed: (id: string) => Promise<Object>;
    expire: (id: string) => Promise<Object>;
}
