import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';

/**
 * Class dealing with the /simulate endpoints (Onboarding Simulator, sandbox only).
 *
 * @export
 * @class OnboardingSimulator
 */
export default class OnboardingSimulator {
    constructor(config) {
        this.config = config;
    }

    /**
     * List all requirement-due fields that can be set on an entity (catalog).
     *
     * @memberof OnboardingSimulator
     * @return {Promise<Object>} A promise to the available requirements response.
     */
    async getAvailableRequirements() {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/simulate/requirements-due`,
                this.config,
                null
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * List all pre-defined simulator scenarios.
     *
     * @memberof OnboardingSimulator
     * @return {Promise<Object>} A promise to the available scenarios response.
     */
    async getAvailableScenarios() {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/simulate/scenarios`,
                this.config,
                null
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Mark requirement fields as due on a sub-entity.
     *
     * @memberof OnboardingSimulator
     * @param {string} entityId The sub-entity id.
     * @param {Object} body { field_names: string[] }
     * @return {Promise<Object>} A promise to the simulation response.
     */
    async setRequirementsDue(entityId, body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/simulate/entities/${entityId}/requirements-due`,
                this.config,
                null,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Execute a pre-defined scenario against a sub-entity.
     *
     * @memberof OnboardingSimulator
     * @param {string} entityId The sub-entity id.
     * @param {string} scenarioId The scenario id to execute.
     * @return {Promise<Object>} A promise to the simulation response.
     */
    async runScenario(entityId, scenarioId) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/simulate/entities/${entityId}/scenarios/${scenarioId}`,
                this.config,
                null
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Force a sub-entity to the specified status.
     *
     * @memberof OnboardingSimulator
     * @param {string} entityId The sub-entity id.
     * @param {Object} body { status: string, ... } (see swagger SimulatorSetStatusRequest).
     * @return {Promise<Object>} A promise to the simulation response.
     */
    async setEntityStatus(entityId, body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/simulate/entities/${entityId}/status`,
                this.config,
                null,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
