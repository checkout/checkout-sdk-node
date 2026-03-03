import { config } from '../../Checkout';

export default class Cardholders {
    constructor(config: config);

    createCardholder(body: object): Promise<object>;
    getCardholder(id: string): Promise<object>;
    updateCardholder(id: string, body: object): Promise<object>;
    getCardholderCards(id: string): Promise<object>;
}
