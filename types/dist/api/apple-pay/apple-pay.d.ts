import { config } from '../../Checkout';

export default class ApplePay {
    constructor(config: config);

    upload: (body: Object) => Promise<Object>;
    generate: () => Promise<Object>;
    enroll: (body: Object) => Promise<void>;
}
