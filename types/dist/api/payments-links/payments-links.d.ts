/**
 * Class dealing with the /payment-links endpoint
 *
 * @export
 * @class PaymentLinks
 */
export default class PaymentLinks {
    constructor(config: any);
    config: any;
    /**
     * Create a Payment Link and pass through all the payment information, like the amount, currency, country and reference.
     *
     * @memberof PaymentLinks
     * @param {Object} body
     * @return {Promise<Object>} A promise to the Payment Link response.
     */
    create(body: any): Promise<any>;
    /**
     * Retrieve details about a specific Payment Link using its ID returned when the link was created. In the response, you will see the status of the Payment Link.
     *
     * @memberof PaymentLinks
     * @param {string} id
     * @return {Promise<Object>} A promise to the Payment Link response.
     */
    get(id: string): Promise<any>;
}
//# sourceMappingURL=payments-links.d.ts.map