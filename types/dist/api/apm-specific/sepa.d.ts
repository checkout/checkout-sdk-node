import { config } from '../../Checkout';

export default class Sepa {
    constructor(config: config);

    getMandate: (id: string) => Promise<Object>;
    cancelMandate: (id: string) => Promise<Object>;
    getPPROMandate: (id: string) => Promise<Object>;
    cancelPPROMandate: (id: string) => Promise<Object>;
}
