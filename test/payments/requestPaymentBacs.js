import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Request a payment with a Bacs Direct Debit source', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('should request a payment with a Bacs source', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/payments')
            .reply(201, {
                id: 'pay_mbabizu24mvu3mela5njyhpit4',
                status: 'Pending',
                reference: 'INV-12345',
                customer: {
                    id: 'cus_y3oqhf46pyzuxjbcn2giaqnb44',
                },
                _links: {
                    self: {
                        href:
                            'https://api.sandbox.checkout.com/payments/pay_mbabizu24mvu3mela5njyhpit4',
                    },
                },
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const payment = await cko.payments.request({
            source: {
                type: 'bacs',
                id: 'src_wmlfc3zyhqzehihu7giusaaawu',
            },
            amount: 4999,
            currency: 'GBP',
            reference: 'INV-12345',
        });

        expect(payment.status).to.equal('Pending');
        expect(payment.reference).to.equal('INV-12345');
    });

    it('should preserve an explicit bacs source type', async () => {
        let received;
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/payments', (body) => {
                received = body;
                return true;
            })
            .reply(201, { id: 'pay_mbabizu24mvu3mela5njyhpit4', status: 'Pending' });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        await cko.payments.request({
            source: {
                type: 'bacs',
                id: 'src_wmlfc3zyhqzehihu7giusaaawu',
            },
            amount: 4999,
            currency: 'GBP',
        });

        // setSourceOrDestinationType returns early when `type` is already present,
        // so it does not rewrite `bacs` to the `id` it would otherwise infer from
        // the `src_` prefix.
        expect(received.source.type).to.equal('bacs');
    });

    it('should infer the id source type when bacs is omitted', async () => {
        let received;
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/payments', (body) => {
                received = body;
                return true;
            })
            .reply(201, { id: 'pay_mbabizu24mvu3mela5njyhpit4', status: 'Pending' });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        await cko.payments.request({
            source: { id: 'src_wmlfc3zyhqzehihu7giusaaawu' },
            amount: 4999,
            currency: 'GBP',
        });

        // Documented in the payments.request JSDoc: a src_-prefixed id with no
        // `type` is inferred as `id`, never as `bacs`.
        expect(received.source.type).to.equal('id');
    });

    it('should return a bacs source when retrieving the payment', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/payments/pay_mbabizu24mvu3mela5njyhpit4')
            .reply(200, {
                id: 'pay_mbabizu24mvu3mela5njyhpit4',
                status: 'Pending',
                amount: 4999,
                currency: 'GBP',
                source: {
                    type: 'bacs',
                    id: 'src_wmlfc3zyhqzehihu7giusaaawu',
                },
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const payment = await cko.payments.get('pay_mbabizu24mvu3mela5njyhpit4');

        expect(payment.source.type).to.equal('bacs');
        expect(payment.source.id).to.equal('src_wmlfc3zyhqzehihu7giusaaawu');
    });
});
