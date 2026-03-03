import { config } from '../../Checkout';

export default class DigitalCards {
    constructor(config: config);

    getDigitalCard(digitalCardId: string): Promise<object>;
}
