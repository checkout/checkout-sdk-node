/**
 * Class dealing with the /workflows endpoint
 *
 * @export
 * @class Workflows
 */
export default class Workflows {
    constructor(config: any);
    config: any;
    /**
     * Get all workflows
     *
     * @memberof Workflows
     * @return {Promise<Object>} A promise to the workflows response.
     */
    getAll(): Promise<any>;
    /**
     * Add a new Flow workflow.
     *
     * @memberof Workflows
     * @param {Object} body Workflows request body.
     * @return {Promise<Object>} A promise to the workflows response.
     */
    add(body: any): Promise<any>;
    /**
     * Get the details of a workflow.
     *
     * @memberof Workflows
     * @param {string} id Workflow id.
     * @return {Promise<Object>} A promise to the workflows response.
     */
    get(id: string): Promise<any>;
    /**
     * Removes a workflow so it is no longer being executed.
     * Actions of already executed workflows will be still processed.
     *
     * @memberof Workflows
     * @param {string} id Workflow id.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    remove(id: string): Promise<any>;
    /**
     * Patch a workflow.
     *
     * @memberof Workflows
     * @param {string} id Workflow id.
     * @param {Object} body Workflows request body.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    patch(id: string, body: any): Promise<any>;
    /**
     * Update a workflow action.
     *
     * @memberof Workflows
     * @param {string} workflowId Workflow ID.
     * @param {string} workflowActionId Workflow action ID.
     * @param {Object} body Workflows request body.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    updateAction(workflowId: string, workflowActionId: string, body: any): Promise<any>;
    /**
     * Update a workflow condition.
     *
     * @memberof Workflows
     * @param {string} workflowId Workflow ID.
     * @param {string} workflowConditionId Workflow condition ID.
     * @param {Object} body Workflows request body.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    updateCondition(workflowId: string, workflowConditionId: string, body: any): Promise<any>;
    /**
     * Get a list of sources and their events for building new workflows
     *
     * @memberof Workflows
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    getEventTypes(): Promise<any>;
    /**
     * Get the details of an event.
     *
     * @memberof Workflows
     * @param {string} id Event ID.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    getEvent(id: string): Promise<any>;
    /**
     * Get the details of a workflow action executed for the specified event.
     *
     * @memberof Workflows
     * @param {string} eventId Event ID.
     * @param {string} workflowActionId Workflow Action ID.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    getActionInvocations(eventId: string, workflowActionId: string): Promise<any>;
    /**
     * Reflows a past event denoted by the event ID and triggers the actions of any
     * workflows with matching conditions.
     *
     * @memberof Workflows
     * @param {string} id Event ID.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    reflowByEvent(id: string): Promise<any>;
    /**
     * Reflows a past event by event ID and workflow ID. Triggers all the actions of a
     * specific event and workflow combination if the event denoted by the event ID matches
     * the workflow conditions.
     *
     * @memberof Workflows
     * @param {string} eventId Event ID.
     * @param {string} workflowId Workflow ID.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    reflowByEventAndWorkflow(eventId: string, workflowId: string): Promise<any>;
    /**
     * Reflow past events attached to multiple event IDs and workflow IDs. If you don't
     * specify any workflow IDs, all matching workflows will be retriggered.
     *
     * @memberof Workflows
     * @param {Array} events Array of IDs for the events you want reflowed.
     * @param {Array} [workflows] Array of IDs for the workflows whose actions you want to retrigger.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    reflowEventsByEventAndWorkflowIds(events: any[], workflows?: any[]): Promise<any>;
    /**
     * Reflow past events attached to multiple subject IDs and workflow IDs. If you don't
     * specify any workflow IDs, all matching workflows will be retriggered.
     *
     * @memberof Workflows
     * @param {Array} subjects Array of IDs for the subjects you want reflowed.
     * @param {Array} [workflows] Array of IDs for the workflows whose actions you want to retrigger.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    reflowEventsBySubjectAndWorkflowIds(subjects: any[], workflows?: any[]): Promise<any>;
    /**
     * Get all events that relate to a specific subject
     *
     * @memberof Workflows
     * @param {string} id The event identifier.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    getSubjectEvents(id: string): Promise<any>;
    /**
     * Reflows the events associated with a subject ID (for example, a payment ID or a
     * dispute ID) and triggers the actions of any workflows with matching conditions.
     *
     * @memberof Workflows
     * @param {string} id The subject identifier (for example, a payment ID or a dispute ID).
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    reflowBySubject(id: string): Promise<any>;
    /**
     * Reflows the events associated with a subject ID (for example, a payment ID or a
     * dispute ID) and triggers the actions of the specified workflow if the conditions match.
     *
     * @memberof Workflows
     * @param {string} subjectId Subject ID.
     * @param {string} workflowId Workflow ID.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    reflowBySubjectAndWorkflow(subjectId: string, workflowId: string): Promise<any>;
}
//# sourceMappingURL=workflows.d.ts.map