import { config } from '../../Checkout';

export default class Bacs {
    constructor(config: config);

    sendNotification: (body: Object) => Promise<Object>;
}
