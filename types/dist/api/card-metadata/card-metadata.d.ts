/**
 * Class dealing with the /metadata/card endpoint
 *
 * @export
 * @class CardMetadata
 */
export default class CardMetadata {
    constructor(config: any);
    config: any;
    /**
     * Returns a single metadata record for the card specified by the Primary Account Number (PAN),
     * Bank Identification Number (BIN), token, or instrument supplied.
     *
     * @param {Object} body Card Metadata request body.
     * @return {Promise<Object>} A promise to the add Card Metadata response.
     */
    get(body: any): Promise<any>;
}
//# sourceMappingURL=card-metadata.d.ts.map