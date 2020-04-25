import { config } from '../../Checkout';
export default class Instruments {
    constructor(config: config);

    retrieveEventTypes: (version: String) => Promise<Object>;
    retrieveEvents: (body: Object) => Promise<Object>;
    retrieveEvent: (eventId: String) => Promise<Object>;
    retrieveEventNotification: (body: Object) => Promise<Object>;
    retry: (body: Object) => Promise<Object>;
    retryAll: (eventId: String) => Promise<Object>;
}
