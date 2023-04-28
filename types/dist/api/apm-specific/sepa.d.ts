/**
 * Class dealing with the /sepa and /ppro/sepa endpoint
 *
 * @export
 * @class Sepa
 */
export default class Sepa {
    constructor(config: any);
    config: any;
    /**
     * Get mandate
     *
     * @param {string} id Source id
     * @return {Promise<Object>} A promise to the Sepa response.
     */
    getMandate(id: string): Promise<any>;
    /**
     * Cancel mandate
     *
     * @param {string} id Source id
     * @return {Promise<Object>} A promise to the Sepa response.
     */
    cancelMandate(id: string): Promise<any>;
    /**
     * Get mandate via PPRO
     *
     * @param {string} id Source id
     * @return {Promise<Object>} A promise to the Sepa response.
     */
    getPPROMandate(id: string): Promise<any>;
    /**
     * Cancel mandate via PPRO
     *
     * @param {string} id Source id
     * @return {Promise<Object>} A promise to the Sepa response.
     */
    cancelPPROMandate(id: string): Promise<any>;
}
//# sourceMappingURL=sepa.d.ts.map