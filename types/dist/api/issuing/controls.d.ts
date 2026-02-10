import { config } from '../../Checkout';

export default class Controls {
    constructor(config: config);

    createCardControl(body: object): Promise<object>;
    getCardControls(params: object): Promise<object>;
    getCardControlDetails(id: string): Promise<object>;
    updateCardControl(id: string, body: object): Promise<object>;
    deleteCardControl(id: string): Promise<object>;
}
