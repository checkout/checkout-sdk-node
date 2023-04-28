/**
 * Class dealing with the /tokens endpoint
 *
 * @export
 * @class Tokens
 */
export default class Tokens {
    constructor(config: any);
    config: any;
    /**
     * Exchange card details or a digital wallet payment token for a reference token
     * that can be used later to request a card payment.
     *
     * @memberof Tokens
     * @param {Object} body Token request body.
     * @return {Promise<Object>} A promise to the request token response.
     */
    request(body: any): Promise<any>;
}
//# sourceMappingURL=tokens.d.ts.map