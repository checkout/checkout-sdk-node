import { config } from '../../Checkout';

export default class Risk {
    constructor(config: config);

    requestPreAuthentication: (body: Object) => Promise<Object>;
    requestPreCapture: (body: Object) => Promise<Object>;
}
