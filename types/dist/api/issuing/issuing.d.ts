export default class Issuing {
    constructor(config: any);
    config: any;
    /**
     * Create a new cardholder that you can issue a card to at a later point.
     *
     * @memberof Issuing
     * @param {Object} body Cardholder params.
     * @return {Promise<Object>} A promise to the cardholder response.
     */
    createCardholder(body: any): Promise<any>;
    /**
     * Retrieve the details for a cardholder you created previously.
     *
     * @memberof Issuing
     * @param {string} id Cardholder id.
     * @return {Promise<Object>} A promise to the cardholder details response.
     */
    getCardholder(id: string): Promise<any>;
    /**
     * Retrieves the cards issued to the specified cardholder.
     *
     * @memberof Issuing
     * @param {string} id Cardholder id.
     * @return {Promise<Object>} A promise to the cardholder details response.
     */
    getCardholderCards(id: string): Promise<any>;
    /**
     * Creates a physical or virtual card and issues it to the specified cardholder.
     *
     * @memberof Issuing
     * @param {Object} body Card params.
     * @return {Promise<Object>} A promise to the card response.
     */
    createCard(body: any): Promise<any>;
    /**
     * Retrieves the details for a card you issued previously.
     *
     * @memberof Issuing
     * @param {string} id Card id.
     * @return {Promise<Object>} A promise to the card details response.
     */
    getCardDetails(id: string): Promise<any>;
    /**
     * Enrolls a card in 3D Secure (3DS).
     *
     * @memberof Issuing
     * @param {string} id Card id.
     * @param {Object} body 3DS enrollment params.
     * @return {Promise<Object>} A promise to the card response.
     */
    enrollThreeDS(id: string, body: any): Promise<any>;
    /**
     * Updates a card's 3DS enrollment details.
     *
     * @memberof Issuing
     * @param {string} id Card id.
     * @param {Object} body 3DS enrollment params.
     * @return {Promise<Object>} A promise to the card response.
     */
    updateThreeDS(id: string, body: any): Promise<any>;
    /**
     * Retrieves the details for a card you issued previously.
     *
     * @memberof Issuing
     * @param {string} id Card id.
     * @return {Promise<Object>} A promise to the card response.
     */
    getThreeDSDetails(id: string): Promise<any>;
    /**
     * Activates an inactive or suspended card so that incoming authorizations can be approved.
     *
     * @memberof Issuing
     * @param {string} id Card id.
     * @return {Promise<Object>} A promise to the card response.
     */
    activateCard(id: string): Promise<any>;
    /**
     * Retrieves the credentials for a card you issued previously.
     *
     * @memberof Issuing
     * @param {string} id Card id.
     * @param {Object} body Card params.
     * @return {Promise<Object>} A promise to the card response.
     */
    getCardCredentials(id: string, body: any): Promise<any>;
    /**
     * Revokes an inactive, active, or suspended card to permanently decline all incoming authorizations.
     *
     * @memberof Issuing
     * @param {string} id Card id.
     * @param {Object} body Card params.
     * @return {Promise<Object>} A promise to the card response.
     */
    revokeCard(id: string, body: any): Promise<any>;
    /**
     * Suspends an active or inactive card to temporarily decline all incoming authorizations.
     *
     * @memberof Issuing
     * @param {string} id Card id.
     * @param {Object} body Card params.
     * @return {Promise<Object>} A promise to the card response.
     */
    suspendCard(id: string, body: any): Promise<any>;
    /**
     * Creates a card control and applies it to the specified card.
     *
     * @memberof Issuing
     * @param {Object} body Card control params.
     * @return {Promise<Object>} A promise to the card response.
     */
    createCardControl(body: any): Promise<any>;
    /**
     * Retrieves a list of spending controls applied to the specified card.
     *
     * @memberof Issuing
     * @param {Object} params Card control params.
     * @return {Promise<Object>} A promise to the card response.
     */
    getCardControls(params: any): Promise<any>;
    /**
     * Retrieves the details of a card control you created previously.
     *
     * @memberof Issuing
     * @param {string} id Card control id.
     * @return {Promise<Object>} A promise to the card response.
     */
    getCardControlDetails(id: string): Promise<any>;
    /**
     * Updates an existing card control.
     *
     * @memberof Issuing
     * @param {string} id Card control id.
     * @param {Object} body Card control params.
     * @return {Promise<Object>} A promise to the card response.
     */
    updateCardControl(id: string, body: any): Promise<any>;
    /**
     * Removes an existing card control from the card it was applied to.
     *
     * @memberof Issuing
     * @param {string} id Card control id.
     * @return {Promise<Object>} A promise to the card response.
     */
    deleteCardControl(id: string): Promise<any>;
    /**
     * Simulate an authorization request with a card you issued previously.
     *
     * @memberof Issuing
     * @param {Object} body Card params.
     * @return {Promise<Object>} A promise to the card response.
     */
    simulateAuthorization(body: any): Promise<any>;
}
//# sourceMappingURL=issuing.d.ts.map