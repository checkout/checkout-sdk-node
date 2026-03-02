import {config} from '../../Checkout';

export default class Subentity {
    constructor(config: config);

    onboardSubEntity: (body: Object, schemaVersion?: string) => Promise<Object>;
    getSubEntityDetails: (id: string, schemaVersion?: string) => Promise<Object>;
    updateSubEntityDetails: (id: string, body: Object, schemaVersion?: string) => Promise<Object>;
    getSubEntityMembers: (entityId: string) => Promise<Object>;
    reinviteSubEntityMember: (entityId: string, userId: string, body: Object) => Promise<Object>;
}
