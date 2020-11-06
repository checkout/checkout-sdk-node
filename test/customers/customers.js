import {
    NotFoundError
} from '../../src/services/errors';
import { Checkout } from '../../src/index';
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
