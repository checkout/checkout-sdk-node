import { config } from '../../Checkout';

export default class OnboardingSimulator {
    constructor(config: config);

    getAvailableRequirements: () => Promise<Object>;
    getAvailableScenarios: () => Promise<Object>;
    setRequirementsDue: (entityId: string, body: Object) => Promise<Object>;
    runScenario: (entityId: string, scenarioId: string) => Promise<Object>;
    setEntityStatus: (entityId: string, body: Object) => Promise<Object>;
}
