import { config } from '../../Checkout';

export default class Klarna {
    constructor(config: config);

    createSession: (body: Object) => Promise<Object>;
    getSession: (id: string) => Promise<Object>;
    capture: (id: string, body?: Object) => Promise<Object>;
    void: (id: string, body?: Object) => Promise<Object>;
}
