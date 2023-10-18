import { config } from '../../Checkout';

export default class Webhooks {
    constructor(config: config);

    retrieveWebhooks: () => Promise<Object>;
    registerWebhook: (body: Object) => Promise<Object>;
    retrieveWebhook: (id: string) => Promise<any>;
    updateWebhook: (id: string, body?: Object) => Promise<any>;
    partiallyUpdateWebhook: (id: string, body?: Object) => Promise<any>;
    removeWebhook: (id: string) => Promise<Object>;
}
