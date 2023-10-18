import { config } from '../../Checkout';

export default class Fawry {
    constructor(config: config);

    approve: (reference: string) => Promise<Object>;
    cancel: (reference: string) => Promise<Object>;
}
