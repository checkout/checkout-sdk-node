import { config } from '../../Checkout';

export default class ControlGroups {
    constructor(config: config);

    createControlGroup(body: object): Promise<object>;
    getControlGroupByTarget(params: object): Promise<object>;
    getControlGroup(controlGroupId: string): Promise<object>;
    deleteControlGroup(controlGroupId: string): Promise<object>;
}
