import { config } from '../../Checkout';
export default class Issuing {
    constructor(config: config);

    createCardholder: (body: Object) => Promise<Object>;
    getCardholder: (id: string) => Promise<Object>;
    getCardholderCards: (id: string) => Promise<Object>;
}