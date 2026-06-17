import { config } from '../../Checkout';

export default class EntityRequirements {
    constructor(config: config);

    getEntityRequirements: (entityId: string) => Promise<Object>;
    getEntityRequirementDetails: (entityId: string, requirementId: string) => Promise<Object>;
    updateEntityRequirement: (entityId: string, requirementId: string, body: Object) => Promise<Object>;
}
