import { config } from '../../Checkout';
export default class Sessions {
    constructor(config: config);

    request: (body: Object) => Promise<Object>;
    get: (sessionId: String) => Promise<Object>;
    submitChannelData: (sessionId: String, body: Object) => Promise<Object>;
    complete: (sessionId: String) => Promise<Object>;
}
