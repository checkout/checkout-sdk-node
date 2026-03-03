import { config } from '../../Checkout';

export default class NetworkTokens {
    constructor(config: config);

    provisionNetworkToken: (body: Object) => Promise<Object>;
    getNetworkToken: (network_token_id: string) => Promise<Object>;
    provisionCryptogram: (network_token_id: string, body: Object) => Promise<Object>;
    deleteNetworkToken: (network_token_id: string) => Promise<Object>;
}
