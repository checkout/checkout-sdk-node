/**
 * Class dealing with the /fawry endpoint
 *
 * @deprecated - Since version 2.1.2 - To be removed in future versions.
 * Should use Payments client instead
 * @export
 * @class Fawry
 */
export default class Fawry {
    constructor(config: any);
    config: any;
    /**
     * Approve Fawry payment
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @param {string} reference Reference.
     * @memberof Fawry
     * @return {Promise<Object>} A promise to the Fawry response.
     */
    approve(reference: string): Promise<any>;
    /**
     * Cancel Fawry payment
     *
     * @deprecated - Since version 2.1.2 - Should use Payments client instead
     * @param {string} reference Reference.
     * @memberof Fawry
     * @return {Promise<Object>} A promise to the Fawry response.
     */
    cancel(reference: string): Promise<any>;
}
//# sourceMappingURL=fawry.d.ts.map