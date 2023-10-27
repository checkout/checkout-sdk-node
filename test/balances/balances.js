import { AuthenticationError, ValidationError, } from '../../src/services/errors';
import { Checkout } from '../../src/index';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';

describe('Balances', () => {
    it('should retrive balance', async () => {
        nock('https://balances.sandbox.checkout.com')
            .get('/balances/ent_djigcqx4clmufo2sasgomgpqsq?query=currency:EUR')
            .reply(200, {
                data: [{ descriptor: 'EUR', holding_currency: 'EUR', balances: [Object] }],
                _links: {
                    self: {
                        href: 'https://balances.sandbox.checkout.com/balances/ent_djigcqx4clmufo2sasgomgpqsq?query=currency:EUR',
                    },
                },
            });

        const cko = new Checkout(SK);

        const balance = await cko.balances.retrieve('ent_djigcqx4clmufo2sasgomgpqsq', 'EUR');

        expect(balance.data[0].descriptor).to.equal('EUR');
    });

    it('should retrive balance in prod', async () => {
        nock('https://balances.checkout.com')
            .get('/balances/ent_djigcqx4clmufo2sasgomgpqsq?query=currency:EUR')
            .reply(200, {
                data: [{ descriptor: 'EUR', holding_currency: 'EUR', balances: [Object] }],
                _links: {
                    self: {
                        href: 'https://balances.sandbox.checkout.com/balances/ent_djigcqx4clmufo2sasgomgpqsq?query=currency:EUR',
                    },
                },
            });

        // fake key
        const cko = new Checkout('sk_o2nulev2arguvyf6w7sc5fkznas');

        const balance = await cko.balances.retrieve('ent_djigcqx4clmufo2sasgomgpqsq', 'EUR');

        expect(balance.data[0].descriptor).to.equal('EUR');
    });

    it('should throw authentication error', async () => {
        nock('https://balances.sandbox.checkout.com')
            .get('/balances/ent_djigcqx4clmufo2sasgomgpqsq')
            .reply(401);

        try {
            // fake SK
            const cko = new Checkout('test');

            const balance = await cko.balances.retrieve('ent_djigcqx4clmufo2sasgomgpqsq');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw ValidationError error', async () => {
        nock('https://balances.sandbox.checkout.com')
            .get('/balances/123')
            .reply(422, {
                request_id: '8daac099-b8e5-428c-8374-11c9c0f42d2f',
                error_type: 'processing_error',
                error_codes: ['example'],
            });

        try {
            const cko = new Checkout(SK);

            const balance = await cko.balances.retrieve('123');
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });
});
