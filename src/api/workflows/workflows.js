import { determineError } from '../../services/errors.js';
import { _delete, get, patch, post, put } from '../../services/http.js';

/**
 * Class dealing with the /workflows endpoint
 *
 * @export
 * @class Workflows
 */
export default class Workflows {
    constructor(config) {
        this.config = config;
    }

    /**
     * Get all workflows
     *
     * @memberof Workflows
     * @return {Promise<Object>} A promise to the workflows response.
     */
    async getAll() {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/workflows`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Add a new Flow workflow.
     *
     * @memberof Workflows
     * @param {Object} body Workflows request body.
     * @return {Promise<Object>} A promise to the workflows response.
     */
    async add(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/workflows`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Get the details of a workflow.
     *
     * @memberof Workflows
     * @param {string} id Workflow id.
     * @return {Promise<Object>} A promise to the workflows response.
     */
    async get(id) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/workflows/${id}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Removes a workflow so it is no longer being executed.
     * Actions of already executed workflows will be still processed.
     *
     * @memberof Workflows
     * @param {string} id Workflow id.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    async remove(id) {
        try {
            const response = await _delete(
                this.config.httpClient,
                `${this.config.host}/workflows/${id}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Patch a workflow.
     *
     * @memberof Workflows
     * @param {string} id Workflow id.
     * @param {Object} body Workflows request body.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    async patch(id, body) {
        try {
            const response = await patch(
                this.config.httpClient,
                `${this.config.host}/workflows/${id}`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Adds a workflow action. Actions determine what the workflow will do when it is triggered.
     *
     * @memberof Workflows
     * @param {string} id Workflow Id.
     * @param {Object} body Workflows request body.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    async addAction(id, body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/workflows/${id}/actions/`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Update a workflow action.
     *
     * @memberof Workflows
     * @param {string} workflowId Workflow ID.
     * @param {string} workflowActionId Workflow action ID.
     * @param {Object} body Workflows request body.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    async updateAction(workflowId, workflowActionId, body) {
        try {
            const response = await put(
                this.config.httpClient,
                `${this.config.host}/workflows/${workflowId}/actions/${workflowActionId}`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Removes a workflow action. Actions determine what the workflow will do when it is triggered.
     *
     * @memberof Workflows
     * @param {string} workflowId Workflow id.
     * @param {string} workflowActionId Workflow action Id.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    async removeAction(workflowId, workflowActionId) {
        try {
            const response = await _delete(
                this.config.httpClient,
                `${this.config.host}/workflows/${workflowId}/actions/${workflowActionId}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Adds a workflow condition. Conditions determine when the workflow will trigger.
     *
     * @memberof Workflows
     * @param {string} id Workflow Id.
     * @param {Object} body Workflows request body.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    async addCondition(id, body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/workflows/${id}/conditions/`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Update a workflow condition.
     *
     * @memberof Workflows
     * @param {string} workflowId Workflow ID.
     * @param {string} workflowConditionId Workflow condition ID.
     * @param {Object} body Workflows request body.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    async updateCondition(workflowId, workflowConditionId, body) {
        try {
            const response = await put(
                this.config.httpClient,
                `${this.config.host}/workflows/${workflowId}/conditions/${workflowConditionId}`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Removes a workflow condition. Conditions determine when the workflow will trigger.
     *
     * @memberof Workflows
     * @param {string} workflowId Workflow id.
     * @param {string} workflowConditionId Workflow condition Id.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    async removeCondition(workflowId, workflowConditionId) {
        try {
            const response = await _delete(
                this.config.httpClient,
                `${this.config.host}/workflows/${workflowId}/conditions/${workflowConditionId}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Validate a workflow in our Sandbox environment.
     *
     * @memberof Workflows
     * @param {string} id Workflow id.
     * @param {Object} body Event types for which the workflow will execute.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    async test(id, body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/workflows/${id}/test`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Get a list of sources and their events for building new workflows
     *
     * @memberof Workflows
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    async getEventTypes() {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/workflows/event-types`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Get the details of an event.
     *
     * @memberof Workflows
     * @param {string} id Event ID.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    async getEvent(id) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/workflows/events/${id}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Get the details of a workflow action executed for the specified event.
     *
     * @memberof Workflows
     * @param {string} eventId Event ID.
     * @param {string} workflowActionId Workflow Action ID.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    async getActionInvocations(eventId, workflowActionId) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/workflows/events/${eventId}/actions/${workflowActionId}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Reflows a past event denoted by the event ID and triggers the actions of any
     * workflows with matching conditions.
     *
     * @memberof Workflows
     * @param {string} id Event ID.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    async reflowByEvent(id) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/workflows/events/${id}/reflow`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

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
    async reflowByEventAndWorkflow(eventId, workflowId) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/workflows/events/${eventId}/workflow/${workflowId}/reflow`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Reflow past events attached to multiple event IDs and workflow IDs. If you don't
     * specify any workflow IDs, all matching workflows will be retriggered.
     *
     * @memberof Workflows
     * @param {Array} events Array of IDs for the events you want reflowed.
     * @param {Array} [workflows] Array of IDs for the workflows whose actions you want to retrigger.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    async reflowEventsByEventAndWorkflowIds(events, workflows) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/workflows/events/reflow`,
                this.config,
                this.config.sk,
                {
                    events,
                    workflows,
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Reflow past events attached to multiple subject IDs and workflow IDs. If you don't
     * specify any workflow IDs, all matching workflows will be retriggered.
     *
     * @memberof Workflows
     * @param {Array} subjects Array of IDs for the subjects you want reflowed.
     * @param {Array} [workflows] Array of IDs for the workflows whose actions you want to retrigger.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    async reflowEventsBySubjectAndWorkflowIds(subjects, workflows) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/workflows/events/reflow`,
                this.config,
                this.config.sk,
                {
                    subjects,
                    workflows,
                }
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Get all events that relate to a specific subject
     *
     * @memberof Workflows
     * @param {string} id The event identifier.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    async getSubjectEvents(id) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/workflows/events/subject/${id}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Reflows the events associated with a subject ID (for example, a payment ID or a
     * dispute ID) and triggers the actions of any workflows with matching conditions.
     *
     * @memberof Workflows
     * @param {string} id The subject identifier (for example, a payment ID or a dispute ID).
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    async reflowBySubject(id) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/workflows/events/subject/${id}/reflow`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }

    /**
     * Reflows the events associated with a subject ID (for example, a payment ID or a
     * dispute ID) and triggers the actions of the specified workflow if the conditions match.
     *
     * @memberof Workflows
     * @param {string} subjectId Subject ID.
     * @param {string} workflowId Workflow ID.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    async reflowBySubjectAndWorkflow(subjectId, workflowId) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/workflows/events/subject/${subjectId}/workflow/${workflowId}/reflow`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
