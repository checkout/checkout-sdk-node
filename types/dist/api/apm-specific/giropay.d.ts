import { config } from '../../Checkout';

export default class Giropay {
    constructor(config: config);

    getEpsBanks: () => Promise<Object>;
    getBanks: () => Promise<Object>;
}
