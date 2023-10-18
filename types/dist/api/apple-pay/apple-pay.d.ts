import { config } from '../../Checkout';

export default class Access {
    constructor(config: config);

    upload: (body: Object) => Promise<Object>;
    generate: () => Promise<Object>;
}
