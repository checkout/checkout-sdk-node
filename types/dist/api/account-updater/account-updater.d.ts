import { config } from '../../Checkout';

export default class AccountUpdater {
    constructor(config: config);

    retrieveUpdatedCardDetails: (body: Object) => Promise<Object>;
}
