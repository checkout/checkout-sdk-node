import { config } from '../../Checkout';

export default class Forward {
    constructor(config: config);
    
    forwardRequest(body: object): Promise<object>;
    get(id: string): Promise<object>;
    createSecret(body: object): Promise<object>;
    listSecrets(): Promise<object>;
    updateSecret(name: string, body: object): Promise<object>;
    deleteSecret(name: string): Promise<object | void>;
}
