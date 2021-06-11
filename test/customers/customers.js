import { Checkout } from '../../src/index';
import { AuthenticationError, NotFoundError } from '../../src/services/errors';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Customers', () => {
    it('should update a customer', async () => {
        nock('https://api.sandbox.checkout.com')
            .patch('/customers/cus_2tvaccfvs3lulevzg42vgyvtdq')
            .reply(200, {});

        const cko = new Checkout(SK);

        const customerResponse = await cko.customers.update('cus_2tvaccfvs3lulevzg42vgyvtdq', {
            name: 'James Bond',
        });
    });

    it('should create a customer', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/customers')
            .reply(200, { id: 'cus_zbgrqmm6s5ne7lszegj5iu4lci' });

        const cko = new Checkout(SK);

        const customerResponse = await cko.customers.create({
            email: 'JohnTest@test.com',
            name: 'John Test',
            phone: {
                country_code: '+1',
                number: '4155552671',
            },
            metadata: {
                coupon_code: 'NY2018',
                partner_id: 123989,
            },
        });
    });

    it('should throw when creating a customer', async () => {
        nock('https://api.sandbox.checkout.com').post('/customers').reply(401);

        const cko = new Checkout('sk_123');

        try {
            const customerResponse = await cko.customers.create({
                email: 'JohnTest@test.com',
                name: 'John Test',
                phone: {
                    country_code: '+1',
                    number: '4155552671',
                },
                metadata: {
                    coupon_code: 'NY2018',
                    partner_id: 123989,
                },
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should get a customer', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/customers/cus_zbgrqmm6s5ne7lszegj5iu4lci')
            .reply(200, {
                id: 'cus_zbgrqmm6s5ne7lszegj5iu4lci',
                email: 'JohnTest@test.com',
                name: 'John Test',
                phone: { country_code: '1', number: '4155552671' },
                metadata: { coupon_code: 'NY2018', partner_id: '123989' },
                instruments: [],
            });

        const cko = new Checkout(SK);

        const customerResponse = await cko.customers.get('cus_zbgrqmm6s5ne7lszegj5iu4lci');

        expect(customerResponse.name).to.equal('John Test');
    });

    it('should throw when getting a customer', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/customers/cus_zbgrqmm6s5ne7lszegj5iu4lci')
            .reply(404);

        const cko = new Checkout('sk_123');

        try {
            const customerResponse = await cko.customers.get('cus_zbgrqmm6s5ne7lszegj5iu4lci');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should delete a customer', async () => {
        nock('https://api.sandbox.checkout.com')
            .delete('/customers/cus_zbgrqmm6s5ne7lszegj5iu4lci')
            .reply(200, {});

        const cko = new Checkout(SK);

        const customerResponse = await cko.customers.delete('cus_zbgrqmm6s5ne7lszegj5iu4lci');
    });

    it('should throw when deleting a customer', async () => {
        nock('https://api.sandbox.checkout.com')
            .delete('/customers/cus_zbgrqmm6s5ne7lszegj5iu4lci')
            .reply(401);

        const cko = new Checkout('sk_123');

        try {
            const customerResponse = await cko.customers.delete('cus_zbgrqmm6s5ne7lszegj5iu4lci');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw not found error', async () => {
        nock('https://api.sandbox.checkout.com')
            .patch('/customers/cus_2tvaccfvs3lulevzg42vgyvtdqa')
            .reply(404);

        const cko = new Checkout(SK);

        try {
            const customerResponse = await cko.customers.update('cus_2tvaccfvs3lulevzg42vgyvtdqa', {
                name: 'James Bond',
            });
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
