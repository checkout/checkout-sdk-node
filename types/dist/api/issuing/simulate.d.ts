import { config } from '../../Checkout';

export default class Simulate {
    constructor(config: config);

    simulateAuthorization(body: object): Promise<object>;
    simulateIncrement(id: string, body: object): Promise<object>;
    simulateClearing(id: string, body: object): Promise<object>;
    simulateRefund(id: string, body: object): Promise<object>;
    simulateReversal(id: string, body: object): Promise<object>;
    simulateOobAuthentication(body: object): Promise<object>;
}
