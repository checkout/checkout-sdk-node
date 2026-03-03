import {config} from '../../Checkout';

export default class ReserveRules {
    constructor(config: config);

    getReserveRuleDetails: (entityId: string, id: string) => Promise<Object>;
    updateReserveRule: (entityId: string, id: string, body: Object, ifMatch: string) => Promise<Object>;
    addReserveRule: (id: string, body: Object) => Promise<Object>;
    queryReserveRules: (id: string) => Promise<Object>;
}
