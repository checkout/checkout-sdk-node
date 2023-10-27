import { config } from '../../Checkout';

export default class CardMetadata {
    constructor(config: config);

    get: (body: Object) => Promise<Object>;
}
