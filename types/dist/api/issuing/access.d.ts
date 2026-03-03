import { config } from '../../Checkout';

export default class Access {
    constructor(config: config);

    requestCardholderAccessToken(body: object): Promise<object>;
}
