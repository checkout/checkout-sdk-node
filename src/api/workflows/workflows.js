import fetch from 'node-fetch';
import { determineError } from '../../services/errors';
import http from '../../services/http';

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
            const response = await http(fetch, this.config, {
                method: 'get',
                url: `${this.config.host}/workflows`,
                headers: { Authorization: this.config.sk },
            });

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
            const response = await http(fetch, this.config, {
                method: 'post',
                url: `${this.config.host}/workflows`,
                body,
                headers: { Authorization: this.config.sk },
            });

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
            const response = await http(fetch, this.config, {
                method: 'get',
                url: `${this.config.host}/workflows/${id}`,
                headers: { Authorization: this.config.sk },
            });

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
            const response = await http(fetch, this.config, {
                method: 'delete',
                url: `${this.config.host}/workflows/${id}`,
                headers: { Authorization: this.config.sk },
            });

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
            const response = await http(fetch, this.config, {
                method: 'patch',
                url: `${this.config.host}/workflows/${id}`,
                headers: { Authorization: this.config.sk },
                body,
            });

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
            const response = await http(fetch, this.config, {
                method: 'put',
                url: `${this.config.host}/workflows/${workflowId}/actions/${workflowActionId}`,
                headers: { Authorization: this.config.sk },
                body,
            });

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
            const response = await http(fetch, this.config, {
                method: 'put',
                url: `${this.config.host}/workflows/${workflowId}/conditions/${workflowConditionId}`,
                body,
            });

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
            const response = await http(fetch, this.config, {
                method: 'get',
                url: `${this.config.host}/workflows/event-types`,
                headers: { Authorization: this.config.sk },
            });

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
     * @param {string} id Event ID.
     * @return {Promise<Object>} A promise to the Workflows response.
     */
    async getEvent(id) {
        try {
            const response = await http(fetch, this.config, {
                method: 'get',
                url: `${this.config.host}/workflows/events/${id}`,
                headers: { Authorization: this.config.sk },
            });

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
            const response = await http(fetch, this.config, {
                method: 'post',
                url: `${this.config.host}/workflows/events/${id}/reflow`,
                headers: { Authorization: this.config.sk },
            });

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
            const response = await http(fetch, this.config, {
                method: 'post',
                url: `${this.config.host}/workflows/events/${eventId}/workflow/${workflowId}/reflow`,
                headers: { Authorization: this.config.sk },
            });

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
            const response = await http(fetch, this.config, {
                method: 'post',
                url: `${this.config.host}/workflows/events/reflow`,
                body: {
                    events,
                    workflows,
                },
                headers: { Authorization: this.config.sk },
            });

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
            const response = await http(fetch, this.config, {
                method: 'post',
                url: `${this.config.host}/workflows/events/reflow`,
                body: {
                    subjects,
                    workflows,
                },
                headers: { Authorization: this.config.sk },
            });

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
            const response = await http(fetch, this.config, {
                method: 'get',
                url: `${this.config.host}/workflows/events/subject/${id}`,
                headers: { Authorization: this.config.sk },
            });

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
            const response = await http(fetch, this.config, {
                method: 'post',
                url: `${this.config.host}/workflows/events/subject/${id}/reflow`,
                headers: { Authorization: this.config.sk },
            });

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
            const response = await http(fetch, this.config, {
                method: 'post',
                url: `${this.config.host}/workflows/events/subject/${subjectId}/workflow/${workflowId}/reflow`,
                headers: { Authorization: this.config.sk },
            });

            return await response.json;
        } catch (err) {
            const error = await determineError(err);
            throw error;
        }
    }
}
