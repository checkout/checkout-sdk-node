/**
 * Class dealing with the /customers endpoint
 *
 * @export
 * @class Customers
 */
export default class Customers {
    constructor(config: any);
    config: any;
    /**
     * Create a customer
     *
     * @memberof Customers
     * @param {Object} customer Customer object body.
     * @return {Promise<Object>} A promise to the create customer response.
     */
    create(customer: any): Promise<any>;
    /**
     * Get a customer
     *
     * @memberof Customers
     * @param {string} id Customer id.
     * @return {Promise<Object>} A promise to the customer details response.
     */
    get(id: string): Promise<any>;
    /**
     * Update details of a customer
     *
     * @memberof Customers
     * @param {string} id Customer id.
     * @param {Object} body Customer object body.
     * @return {Promise<Object>} A promise to the request customer response.
     */
    update(id: string, body: any): Promise<any>;
    /**
     * Delete a customer
     *
     * @memberof Customers
     * @param {string} id Customer id.
     * @return {Promise<Object>} A promise to the customer response.
     */
    delete(id: string): Promise<any>;
}
//# sourceMappingURL=customers.d.ts.map