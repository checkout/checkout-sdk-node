/**
 * Class dealing with the platforms api
 *
 * @export
 * @class Platforms
 */
export default class Platforms {
    constructor(config: any);
    config: any;
    /**
     * Our Platforms solution provides an easy way to upload identity documentation required for full due diligence.
     *
     * @memberof Platforms
     * @param {string} purpose The purpose of the file upload.
     * @param {Object} path The local path of the file to upload, and its type.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    uploadFile(purpose: string, path: any): Promise<any>;
    /**
     * Onboard a sub-entity so they can start receiving payments. Once created,
     * Checkout.com will run due diligence checks. If the checks are successful,
     * we'll enable payment capabilities for that sub-entity and they will start
     * receiving payments.
     *
     * @memberof Platforms
     * @param {Object} body Platforms request body.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    onboardSubEntity(body: any): Promise<any>;
    /**
     * Use this endpoint to retrieve a sub-entity and its full details.
     *
     * @memberof Platforms
     * @param {string} id Sub-entity id.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    getSubEntityDetails(id: string): Promise<any>;
    /**
     * You can update all fields under the Contact details, Profile, and Company objects.
     * You can also add identification information to complete due diligence requirements.
     *
     * @memberof Platforms
     * @param {string} id Sub-entity id.
     * @param {Object} body Platforms request body.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    updateSubEntityDetails(id: string, body: any): Promise<any>;
    /**
     * Retrieve the details of a specific payment instrument used for sub-entity payouts.
     *
     * @memberof Platforms
     * @param {string} entityId The sub-entity's ID.
     * @param {string} id The payment instrument's ID.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    getPaymentInstrumentDetails(entityId: string, id: string): Promise<any>;
    /**
     * Update a session by providing information about the environment.
     *
     * @memberof Platforms
     * @param {string} entityId Sub-entity id.
     * @param {string} id Payment instrument's id.
     * @param {Object} body Platforms request body.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    updatePaymentInstrumentDetails(entityId: string, id: string, body: any): Promise<any>;
    /**
     * Update a session by providing information about the environment.
     *
     * @deprecated Use the payment instrument operations at /payment-instruments instead.
     * @memberof Platforms
     * @param {string} id Sub-entity id.
     * @param {Object} body Platforms request body.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    createPaymentInstrument(id: string, body: any): Promise<any>;
    /**
     * Update a session by providing information about the environment.
     *
     * @memberof Platforms
     * @param {string} id Sub-entity id.
     * @param {Object} body Platforms request body.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    addPaymentInstrument(id: string, body: any): Promise<any>;
    /**
     * Fetch all of the payment instruments for a sub-entity. You can filter by status to
     * identify verified instruments that are ready to be used for Payouts.
     *
     * @memberof Platforms
     * @param {string} id The sub-entity's ID.
     * @param {string} status The status of your sub-entity's payment instrument.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    queryPaymentInstruments(id: string, status: string): Promise<any>;
    /**
     * You can schedule when your sub-entities receive their funds using our Platforms solution.
     * Use this endpoint to retrieve information about a sub-entity's schedule.
     *
     * @memberof Platforms
     * @param {string} id The sub-entity's ID.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    retrieveSubEntityPayoutSchedule(id: string): Promise<any>;
    /**
     * You can schedule when your sub-entities receive their funds using our Platforms solution.
     * Use this endpoint to update a sub-entity's schedule.
     *
     * @memberof Platforms
     * @param {string} id The sub-entity's ID.
     * @param {Object} body Platforms request body.
     * @return {Promise<Object>} A promise to the Platforms response.
     */
    updateSubEntityPayoutSchedule(id: string, body: any): Promise<any>;
}
//# sourceMappingURL=platforms.d.ts.map