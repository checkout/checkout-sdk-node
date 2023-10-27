import { config } from '../../Checkout';

export default class Sessions {
    constructor(config: config);

    request: (body: Object) => Promise<Object>;
    get: (id: string, channel?: string) => Promise<Object>;
    update: (id: string, body: Object) => Promise<Object>;
    complete: (id: string) => Promise<Object>;
    update3DSMethodCompletionIndicator: (id: string, threeDsMethodCompletion: string) => Promise<Object>;
}
