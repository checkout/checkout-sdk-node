import { _delete, get, post, put } from '../../services/http.js';
import { determineError } from '../../services/errors.js';
import { buildQueryParams } from '../../services/utils.js';

// Path segments appended to the API base (config.host).
const CONTROLS_PATH = 'controls';
const ISSUING_PATH = 'issuing';

/**
 * The period of time over which a velocity limit's amount can be spent.
 *
 * @typedef {Object} VelocityWindow
 * @property {('daily'|'weekly'|'monthly'|'all_time')} type The velocity window's unit of time.
 */

/**
 * The velocity limit returned by the get, list and update control operations, which determines how much a
 * target card can spend over a given timeframe.
 *
 * @typedef {Object} VelocityLimitWithRemainingAmount
 * @property {number} amount_remaining The remaining amount that can be spent, in minor units. Minimum 0.
 * @property {number} amount_limit The amount that can be spent, in minor units. Minimum 0.
 * @property {VelocityWindow} velocity_window The period of time over which the specified amount_limit can be spent.
 * @property {string[]} [mcc_list] The list of merchant category codes (MCCs) that the velocity limit applies to,
 *     as four-digit ISO 18245 codes.
 * @property {string[]} [mid_list] The list of merchant identification (MID) codes to allow or block transactions
 *     from. You can provide either mcc_list or mid_list, but not both.
 */

/**
 * The merchant category code (MCC) rule, which determines the types of businesses transactions can be processed from.
 *
 * @typedef {Object} MccLimit
 * @property {('allow'|'block')} type Sets whether to allow or block the list of MCCs supplied.
 * @property {string[]} mcc_list The list of MCCs to allow or block transactions from, as 4-digit ISO 18245 codes.
 */

/**
 * The merchant identification (MID) code rule, which determines the merchants from whom transactions can be processed.
 *
 * @typedef {Object} MidLimit
 * @property {('allow'|'block')} type Sets whether to allow or block the list of MIDs supplied.
 * @property {string[]} mid_list The list of merchant identification (MID) codes to allow or block transactions
 *     from. Each code is 1 to 15 characters.
 */

/**
 * A card control. The shape depends on control_type: a velocity_limit control carries velocity_limit, an
 * mcc_limit control carries mcc_limit and a mid_limit control carries mid_limit.
 *
 * @typedef {Object} CardControlResponse
 * @property {string} id The control's unique identifier (ctr_ followed by 26 characters).
 * @property {string} [description] The description of the control. Maximum 256 characters.
 * @property {('velocity_limit'|'mcc_limit'|'mid_limit')} control_type The control's type. A velocity_limit
 *     determines how much can be spent over a given period of time. An mcc_limit determines the types of
 *     businesses from which transactions can be processed. A mid_limit specifies the merchants from whom
 *     transactions can be processed.
 * @property {string} target_id The ID of the card (crd_) or control profile (cpr_) the control is applied to.
 * @property {boolean} is_editable Indicates whether you can change this control. false: an immutable control
 *     applied by Checkout.com. true: you applied this control and can change it.
 * @property {string} created_date The UTC date and time the control was created, in ISO 8601 format.
 * @property {string} last_modified_date The UTC date and time the control was last modified, in ISO 8601 format.
 * @property {VelocityLimitWithRemainingAmount} [velocity_limit] Present when control_type is velocity_limit. The
 *     create operation returns it without amount_remaining.
 * @property {MccLimit} [mcc_limit] Present when control_type is mcc_limit.
 * @property {MidLimit} [mid_limit] Present when control_type is mid_limit.
 * @property {Object} [_links] The links related to the control. Returned by the create operation.
 */

/**
 * The list of controls applied to a target.
 *
 * @typedef {Object} CardControlsListResponse
 * @property {CardControlResponse[]} controls The list of controls applied to the specified target.
 */

/**
 * The details of a removed control.
 *
 * @typedef {Object} RemoveCardControlResponse
 * @property {string} id The removed control's unique identifier.
 */

/**
 * Controls class for managing card control operations
 *
 * @export
 * @class Controls
 */
export default class Controls {
    constructor(config) {
        this.config = config;
    }

    /**
     * Creates a card control and applies it to the specified card.
     *
     * @memberof Controls
     * @param {Object} body Card control params.
     * @return {Promise<CardControlResponse>} A promise to the created control.
     */
    async createCardControl(body) {
        try {
            const response = await post(
                this.config.httpClient,
                `${this.config.host}/${ISSUING_PATH}/${CONTROLS_PATH}`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Retrieves a list of spending controls applied to the specified card.
     *
     * @memberof Controls
     * @param {Object} params Card control params.
     * @return {Promise<CardControlsListResponse>} A promise to the list of controls applied to the target.
     */
    async getCardControls(params) {
        try {
            const url = buildQueryParams(`${this.config.host}/${ISSUING_PATH}/${CONTROLS_PATH}`, params);

            const response = await get(this.config.httpClient, url, this.config, this.config.sk);
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Retrieves the details of a card control you created previously.
     *
     * @memberof Controls
     * @param {string} id Card control id.
     * @return {Promise<CardControlResponse>} A promise to the control details.
     */
    async getCardControlDetails(id) {
        try {
            const response = await get(
                this.config.httpClient,
                `${this.config.host}/${ISSUING_PATH}/${CONTROLS_PATH}/${id}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Updates an existing card control.
     *
     * @memberof Controls
     * @param {string} id Card control id.
     * @param {Object} body Card control params.
     * @return {Promise<CardControlResponse>} A promise to the updated control.
     */
    async updateCardControl(id, body) {
        try {
            const response = await put(
                this.config.httpClient,
                `${this.config.host}/${ISSUING_PATH}/${CONTROLS_PATH}/${id}`,
                this.config,
                this.config.sk,
                body
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }

    /**
     * Removes an existing card control from the card it was applied to.
     *
     * @memberof Controls
     * @param {string} id Card control id.
     * @return {Promise<RemoveCardControlResponse>} A promise to the removed control id.
     */
    async deleteCardControl(id) {
        try {
            const response = await _delete(
                this.config.httpClient,
                `${this.config.host}/${ISSUING_PATH}/${CONTROLS_PATH}/${id}`,
                this.config,
                this.config.sk
            );
            return await response.json;
        } catch (err) {
            throw await determineError(err);
        }
    }
}
