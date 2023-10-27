import { config } from '../../Checkout';

export default class Files {
    constructor(config: config);

    upload: (body: Object) => Promise<Object>;
    getFile: (fileId: string) => Promise<Object>;
}
