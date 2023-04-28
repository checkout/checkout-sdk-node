/**
 * Class dealing with the /sources endpoint
 *
 * @export
 * @class Sources
 */
export default class Sources {
    constructor(config: any);
    config: any;
    /**
     * Add a reusable payment source that can be used later to make one or more payments.
     * Payment sources are linked to a specific customer and cannot be shared between customers.
     *
     * @memberof Sources
     * @param {Object} body Source request body.
     * @return {Promise<Object>} A promise to the add source response.
     */
    add(body: any): Promise<any>;
}
//# sourceMappingURL=sources.d.ts.map