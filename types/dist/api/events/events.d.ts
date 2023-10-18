import { config } from '../../Checkout';

export default class Instruments {
    constructor(config: config);

    retrieveEventTypes: (version: string) => Promise<Object>;
    retrieveEvents: (body: Object) => Promise<Object>;
    retrieveEvent: (eventId: string) => Promise<Object>;
    retrieveEventNotification: (body: Object) => Promise<Object>;
    retry: (body: Object) => Promise<Object>;
    retryAll: (eventId: string) => Promise<Object>;
}
