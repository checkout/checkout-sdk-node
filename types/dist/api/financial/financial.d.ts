import { config } from '../../Checkout';

export default class Financial {
    constructor(config: config);

    query: (parameters: Object) => Promise<Object>;
}
