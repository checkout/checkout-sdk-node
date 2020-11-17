import { NotFoundError } from '../../src/services/errors';
import { Checkout } from '../../src/index';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Fawry', () => {
    it('should approve Fawry payment', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(202, {
                id: 'pay_bvoryvj7bktuvdv7aajab6zixu',
                status: 'Pending',
                customer: {
                    id: 'cus_pjot3pvirqfu5p7e2tvoblrjgi',
                },
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_bvoryvj7bktuvdv7aajab6zixu',
                    },
                    approve: {
                        href: 'https://api.sandbox.checkout.com/fawry/payments/661440940/approval',
                    },
                    cancel: {
                        href:
                            'https://api.sandbox.checkout.com/fawry/payments/661440940/cancellation',
                    },
                },
            });

        nock('https://api.sandbox.checkout.com')
            .put('/fawry/payments/661440940/approval')
            .reply(200);

        const cko = new Checkout(SK);

        const payment = await cko.payments.request({
            amount: 1000,
            currency: 'EGP',
            source: {
                type: 'fawry',
                description: 'Fawry Demo Payment',
                customer_mobile: '01058375055',
                customer_email: 'bruce@wayne-enterprises.com',
                products: [
                    {
                        product_id: '0123456789',
                        quantity: 1,
                        price: 1000,
                        description: 'Fawry Demo Product',
                    },
                ],
            },
        });

        let ref = payment._links.approve.href.match(/payments\/([^&]*)/)[1];
        ref = ref.substring(0, ref.length - 9);

        const fawry = await cko.fawry.approve(ref);
    });

    it('should throw NotFoundError trying to approve Fawry payment', async () => {
        nock('https://api.sandbox.checkout.com').put('/fawry/payments/1234/approval').reply(404);

        const cko = new Checkout(SK);

        try {
            const fawry = await cko.fawry.approve('1234');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should cancel Fawry payment', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/payments')
            .reply(202, {
                id: 'pay_bvoryvj7bktuvdv7aajab6zixu',
                status: 'Pending',
                customer: {
                    id: 'cus_pjot3pvirqfu5p7e2tvoblrjgi',
                },
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_bvoryvj7bktuvdv7aajab6zixu',
                    },
                    approve: {
                        href: 'https://api.sandbox.checkout.com/fawry/payments/661440940/approval',
                    },
                    cancel: {
                        href:
                            'https://api.sandbox.checkout.com/fawry/payments/661440940/cancellation',
                    },
                },
            });

        nock('https://api.sandbox.checkout.com')
            .put('/fawry/payments/661440940/cancellation')
            .reply(200);

        const cko = new Checkout(SK);

        const payment = await cko.payments.request({
            amount: 1000,
            currency: 'EGP',
            source: {
                type: 'fawry',
                description: 'Fawry Demo Payment',
                customer_mobile: '01058375055',
                customer_email: 'bruce@wayne-enterprises.com',
                products: [
                    {
                        product_id: '0123456789',
                        quantity: 1,
                        price: 1000,
                        description: 'Fawry Demo Product',
                    },
                ],
            },
        });

        let ref = payment._links.cancel.href.match(/payments\/([^&]*)/)[1];
        ref = ref.substring(0, ref.length - 13);

        const fawry = await cko.fawry.cancel(ref);
    });

    it('should throw NotFoundError trying to cancel Fawry payment', async () => {
        nock('https://api.sandbox.checkout.com')
            .put('/fawry/payments/1234/cancellation')
            .reply(404);

        const cko = new Checkout(SK);

        try {
            const fawry = await cko.fawry.cancel('1234');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
