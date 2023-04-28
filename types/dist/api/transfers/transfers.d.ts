/**
 * Class dealing with the /transfers endpoint
 *
 * @export
 * @class Transfers
 */
export default class Transfers {
    constructor(config: any);
    config: any;
    /**
     * Initiate a transfer of funds from source entity to destination entity.
     *
     * @memberof Transfers
     * @param {Object} body Transfers request body.
     * @param {string} [idempotencyKey] Idempotency Key.
     * @return {Promise<Object>} A promise to the request transfers response.
     */
    initiate(body: any, idempotencyKey?: string): Promise<any>;
    /**
     * Retrieve transfer details using the transfer identifier.
     *
     * @memberof Transfers
     * @param {string} id tra_XXX The transfer identifier.
     * @return {Promise<Object>} A promise to the transfer response.
     */
    retrieve(id: string): Promise<any>;
}
//# sourceMappingURL=transfers.d.ts.map