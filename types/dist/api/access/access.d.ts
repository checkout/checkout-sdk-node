import { config } from '../../Checkout';

export default class Access {
    constructor(config: config);

    request: (body: Object) => Promise<Object>;
    updateAccessToken: (body: Object) => void;
}
