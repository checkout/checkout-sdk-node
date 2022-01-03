import { config } from '../../Checkout';
export default class Workflows {
    constructor(config: config);

    getAll: () => Promise<Object>;
    add: (body: Object) => Promise<Object>;
    get: (id: String) => Promise<Object>;
    remove: (id: String) => Promise<Object>;
    patch: (id: String, body: Object) => Promise<Object>;
    updateAction: (workflowId:String, workflowActionId:String, body: Object) => Promise<Object>;
    updateCondition: (workflowId:String, workflowConditionId:String, body: Object) => Promise<Object>;
    getEventTypes: () => Promise<Object>;
    getEvent: (id: String) => Promise<Object>;
    reflowByEvent: (id: String) => Promise<Object>;
    reflowByEventAndWorkflow: (eventId: String, workflowId: String) => Promise<Object>;
    reflowEventsByEventAndWorkflowIds:(events:Array<String>, workflows?:Array<String>) => Promise<Object>;
    reflowEventsBySubjectAndWorkflowIds:(subjects:Array<String>, workflows?:Array<String>) => Promise<Object>;
    getSubjectEvents: (id: String) => Promise<Object>;
    reflowBySubject: (id: String) => Promise<Object>;
    reflowBySubjectAndWorkflow: (subjectId: String, workflowId: String) => Promise<Object>;
}
