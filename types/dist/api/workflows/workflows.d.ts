import { config } from '../../Checkout';

export default class Workflows {
    constructor(config: config);

    getAll: () => Promise<Object>;
    add: (body: Object) => Promise<Object>;
    get: (id: string) => Promise<Object>;
    remove: (id: string) => Promise<Object>;
    patch: (id: string, body: Object) => Promise<Object>;
    updateAction: (workflowId: string, workflowActionId: string, body: Object) => Promise<Object>;
    updateCondition: (
        workflowId: string,
        workflowConditionId: string,
        body: Object
    ) => Promise<Object>;
    getEventTypes: () => Promise<Object>;
    getEvent: (id: string) => Promise<Object>;
    getActionInvocations: (eventId: string, workflowActionId: string) => Promise<Object>;
    reflowByEvent: (id: string) => Promise<Object>;
    reflowByEventAndWorkflow: (eventId: string, workflowId: string) => Promise<Object>;
    reflowEventsByEventAndWorkflowIds: (
        events: Array<string>,
        workflows?: Array<string>
    ) => Promise<Object>;
    reflowEventsBySubjectAndWorkflowIds: (
        subjects: Array<string>,
        workflows?: Array<string>
    ) => Promise<Object>;
    getSubjectEvents: (id: string) => Promise<Object>;
    reflowBySubject: (id: string) => Promise<Object>;
    reflowBySubjectAndWorkflow: (subjectId: string, workflowId: string) => Promise<Object>;
}
