/**
 * Class dealing with the /balances endpoint
 *
 * @export
 * @class Balances
 */
export default class Balances {
    constructor(config: any);
    config: any;
    /**
     * Use this endpoint to retrieve balances for each currency account belonging to an entity.
     *
     * @memberof Balances
     * @param {string} id The ID of the entity.
     * @param {string} currency The query to apply to limit the currency accounts.
     * @return {Promise<Object>} A promise to the balances response.
     */
    retrieve(id: string, currency: string): Promise<any>;
}
//# sourceMappingURL=balances.d.ts.map