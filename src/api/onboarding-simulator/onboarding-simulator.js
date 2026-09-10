import { determineError } from '../../services/errors.js';
import { get, post } from '../../services/http.js';

// Path segments appended to the API base (config.host).
const ENTITIES_PATH = 'entities';
const REQUIREMENTS_DUE_PATH = 'requirements-due';
const SCENARIOS_PATH = 'scenarios';
const SIMULATE_PATH = 'simulate';
const STATUS_PATH = 'status';

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
                `${this.config.host}/${SIMULATE_PATH}/${REQUIREMENTS_DUE_PATH}`,
                this.config,
                this.config.access
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
                `${this.config.host}/${SIMULATE_PATH}/${SCENARIOS_PATH}`,
                this.config,
                this.config.access
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
                `${this.config.host}/${SIMULATE_PATH}/${ENTITIES_PATH}/${entityId}/${REQUIREMENTS_DUE_PATH}`,
                this.config,
                this.config.access,
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
                `${this.config.host}/${SIMULATE_PATH}/${ENTITIES_PATH}/${entityId}/${SCENARIOS_PATH}/${scenarioId}`,
                this.config,
                this.config.access
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
                `${this.config.host}/${SIMULATE_PATH}/${ENTITIES_PATH}/${entityId}/${STATUS_PATH}`,
                this.config,
                this.config.access,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
