import { expect } from 'chai';
import nock from 'nock';
import Checkout from '../../src/Checkout.js';

afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

// Using Secret Key - OAuth scopes "vault:customers" not available in current OAuth client
// Swagger indicates OAuth with scopes ["vault", "vault:customers"] but returns invalid_scope error
// Secret Key works for GET and DELETE operations
const cko = new Checkout(process.env.CHECKOUT_DEFAULT_SECRET_KEY, {
    pk: process.env.CHECKOUT_DEFAULT_PUBLIC_KEY,
    environment: 'sandbox',
    subdomain: process.env.CHECKOUT_MERCHANT_SUBDOMAIN,
});

describe('Integration::Customers', () => {

    let createdCustomerId;

    it('should create a customer', async () => {
        const crypto = await import('crypto');
        const uuid = crypto.randomUUID();
        
        const customer = await cko.customers.create({
            email: `${uuid}@checkout-sdk-node.com`,
            name: 'Customer',
            phone: {
                country_code: '1',  // Without '+' like in .NET
                number: '4155552671',
            },
        });

        expect(customer).to.have.property('id');
        expect(customer.id).to.match(/^cus_/);
        
        createdCustomerId = customer.id;
    });

    it('should get a customer', async () => {
        const crypto = await import('crypto');
        const uuid = crypto.randomUUID();
        
        // First create a customer
        const created = await cko.customers.create({
            email: `${uuid}@checkout-sdk-node.com`,
            name: 'Customer',
            phone: {
                country_code: '1',
                number: '4155552671',
            },
        });

        // Then get it
        const customer = await cko.customers.get(created.id);

        expect(customer).to.have.property('id', created.id);
        expect(customer).to.have.property('email', `${uuid}@checkout-sdk-node.com`);
        expect(customer).to.have.property('name', 'Customer');
    });

    it.skip('should update a customer', async () => {
        const crypto = await import('crypto');
        const uuid1 = crypto.randomUUID();
        const uuid2 = crypto.randomUUID();

        // First create a customer
        const created = await cko.customers.create({
            email: `${uuid1}@checkout-sdk-node.com`,
            name: 'Customer',
            phone: {
                country_code: '1',
                number: '4155552671',
            },
        });

        // Then update it
        await cko.customers.update(created.id, {
            email: `${uuid2}@checkout-sdk-node.com`,
            name: 'Changed Name',
        });

        // Verify update
        const customer = await cko.customers.get(created.id);
        expect(customer).to.have.property('name', 'Changed Name');
    });

    it('should delete a customer', async () => {
        const crypto = await import('crypto');
        const uuid = crypto.randomUUID();
        
        // First create a customer
        const created = await cko.customers.create({
            email: `${uuid}@checkout-sdk-node.com`,
            name: 'Customer',
            phone: {
                country_code: '1',
                number: '4155552671',
            },
        });

        // Then delete it
        const emptyResponse = await cko.customers.delete(created.id);
        expect(emptyResponse).to.not.be.null;

        // Verify deletion by trying to get it (should throw NotFoundError)
        try {
            await cko.customers.get(created.id);
            throw new Error('Should have thrown NotFoundError');
        } catch (err) {
            expect(err.name).to.equal('NotFoundError');
        }
    });
});
