import {config} from '../../Checkout';

export default class PlatformFiles {
    constructor(config: config);

    uploadFile: (purpose: string, path: string) => Promise<Object>;
    uploadAFile: (entityId: string, body: Object) => Promise<Object>;
    retrieveAFile: (entityId: string, fileId: string) => Promise<Object>;
}
