import { config } from '../../Checkout';

export default class Forward {
    constructor(config: config);
    
    forwardRequest(body: object): Promise<object>;
    get(id: string): Promise<object>;
}
