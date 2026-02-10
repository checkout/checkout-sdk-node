import { config } from '../../Checkout';

export default class ControlProfiles {
    constructor(config: config);

    createControlProfile(body: object): Promise<object>;
    getControlProfilesByTarget(params: object): Promise<object>;
    getControlProfile(controlProfileId: string): Promise<object>;
    updateControlProfile(controlProfileId: string, body: object): Promise<object>;
    deleteControlProfile(controlProfileId: string): Promise<object>;
    addTargetToControlProfile(controlProfileId: string, targetId: string): Promise<object>;
    removeTargetFromControlProfile(controlProfileId: string, targetId: string): Promise<object>;
}
