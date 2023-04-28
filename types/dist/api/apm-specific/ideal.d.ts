/**
 * Class dealing with the /ideal-external endpoint
 *
 * @export
 * @class Ideal
 */
export default class Ideal {
    constructor(config: any);
    config: any;
    /**
     * Get Ideal details
     *
     * @memberof Ideal
     * @return {Promise<Object>} A promise to the iDeal response.
     */
    get(): Promise<any>;
    /**
     * Get Ideal issuers
     *
     * @memberof Ideal
     * @return {Promise<Object>} A promise to the iDeal response.
     */
    getIssuers(): Promise<any>;
}
//# sourceMappingURL=ideal.d.ts.map