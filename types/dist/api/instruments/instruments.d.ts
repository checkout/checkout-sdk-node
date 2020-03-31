import { config } from '../../Checkout';
export default class Instruments {
    constructor(config: config);

    create: (body: Object) => Promise<Object>;
}
