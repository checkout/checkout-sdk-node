import { AuthenticationError, ValidationError, } from '../../src/services/errors.js';
import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';

describe('Balances', () => {
    it('should retrieve balance', async () => {
        nock('https://balances.sandbox.checkout.com')
            .get('/balances/ent_djigcqx4clmufo2sasgomgpqsq?query=currency:EUR')
            .reply(200, {
                data: [
                    { 
                        descriptor: 'Revenue Account 1', 
                        holding_currency: 'EUR', 
                        balances: {
                            pending: 0,
                            available: 1000,
                            payable: 500,
                            collateral: 0
                        }
                    }
                ]
            });

        const cko = new Checkout(SK, { subdomain: 'test' });

        const balance = await cko.balances.retrieve('ent_djigcqx4clmufo2sasgomgpqsq', 'EUR');

        expect(balance.data).to.be.an('array');
        expect(balance.data[0]).to.have.property('descriptor');
        expect(balance.data[0]).to.have.property('holding_currency', 'EUR');
        expect(balance.data[0]).to.have.property('balances');
    });

    it('should retrieve balance in prod', async () => {
        nock('https://balances.checkout.com')
            .get('/balances/ent_djigcqx4clmufo2sasgomgpqsq?query=currency:EUR')
            .reply(200, {
                data: [
                    { 
                        descriptor: 'Revenue Account 1', 
                        holding_currency: 'EUR', 
                        balances: {
                            pending: 0,
                            available: 1000,
                            payable: 500,
                            collateral: 0
                        }
                    }
                ]
            });

        // fake key
        const cko = new Checkout('sk_o2nulev2arguvyf6w7sc5fkznas', { subdomain: 'test' });

        const balance = await cko.balances.retrieve('ent_djigcqx4clmufo2sasgomgpqsq', 'EUR');

        expect(balance.data).to.be.an('array');
        expect(balance.data[0]).to.have.property('descriptor');
        expect(balance.data[0]).to.have.property('holding_currency', 'EUR');
        expect(balance.data[0]).to.have.property('balances');
    });

    it('should throw authentication error', async () => {
        nock('https://balances.sandbox.checkout.com')
            .get('/balances/ent_djigcqx4clmufo2sasgomgpqsq')
            .reply(401);

        try {
            // fake SK
            const cko = new Checkout('test', { subdomain: 'test' });

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
            const cko = new Checkout(SK, { subdomain: 'test' });

            const balance = await cko.balances.retrieve('123');
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });

    it('should retrieve balance with query object', async () => {
        nock('https://balances.sandbox.checkout.com')
            .get('/balances/ent_djigcqx4clmufo2sasgomgpqsq?query=currency:GBP')
            .reply(200, {
                data: [
                    { 
                        descriptor: 'Revenue Account 2', 
                        holding_currency: 'GBP', 
                        balances: {
                            pending: 100,
                            available: 2000,
                            payable: 800,
                            collateral: 50
                        }
                    }
                ]
            });

        const cko = new Checkout(SK, { subdomain: 'test' });

        const balance = await cko.balances.retrieve('ent_djigcqx4clmufo2sasgomgpqsq', { 
            query: 'currency:GBP' 
        });

        expect(balance.data).to.be.an('array');
        expect(balance.data[0]).to.have.property('descriptor');
        expect(balance.data[0]).to.have.property('holding_currency', 'GBP');
        expect(balance.data[0]).to.have.property('balances');
    });

    it('should retrieve balance with withCurrencyAccountId', async () => {
        nock('https://balances.sandbox.checkout.com')
            .get('/balances/ent_djigcqx4clmufo2sasgomgpqsq?withCurrencyAccountId=true')
            .reply(200, {
                data: [
                    { 
                        descriptor: 'Revenue Account 1', 
                        holding_currency: 'EUR', 
                        currency_account_id: 'ca_12345',
                        balances: {
                            pending: 0,
                            available: 1000,
                            payable: 500,
                            collateral: 0
                        }
                    }
                ]
            });

        const cko = new Checkout(SK, { subdomain: 'test' });

        const balance = await cko.balances.retrieve('ent_djigcqx4clmufo2sasgomgpqsq', { 
            withCurrencyAccountId: true 
        });

        expect(balance.data).to.be.an('array');
        expect(balance.data[0]).to.have.property('currency_account_id', 'ca_12345');
        expect(balance.data[0]).to.have.property('descriptor');
        expect(balance.data[0]).to.have.property('holding_currency');
        expect(balance.data[0]).to.have.property('balances');
    });

    it('should retrieve balance with query and withCurrencyAccountId', async () => {
        nock('https://balances.sandbox.checkout.com')
            .get('/balances/ent_djigcqx4clmufo2sasgomgpqsq?query=currency:USD&withCurrencyAccountId=true')
            .reply(200, {
                data: [
                    { 
                        descriptor: 'Revenue Account 3', 
                        holding_currency: 'USD',
                        currency_account_id: 'ca_67890',
                        balances: {
                            pending: 200,
                            available: 3000,
                            payable: 1200,
                            collateral: 100
                        }
                    }
                ]
            });

        const cko = new Checkout(SK, { subdomain: 'test' });

        const balance = await cko.balances.retrieve('ent_djigcqx4clmufo2sasgomgpqsq', { 
            query: 'currency:USD',
            withCurrencyAccountId: true 
        });

        expect(balance.data).to.be.an('array');
        expect(balance.data[0]).to.have.property('descriptor');
        expect(balance.data[0]).to.have.property('holding_currency', 'USD');
        expect(balance.data[0]).to.have.property('currency_account_id', 'ca_67890');
        expect(balance.data[0]).to.have.property('balances');
    });

    it('should retrieve balance without any filters', async () => {
        nock('https://balances.sandbox.checkout.com')
            .get('/balances/ent_djigcqx4clmufo2sasgomgpqsq')
            .reply(200, {
                data: [
                    { 
                        descriptor: 'Revenue Account 1', 
                        holding_currency: 'EUR', 
                        balances: {
                            pending: 0,
                            available: 1000,
                            payable: 500,
                            collateral: 0
                        }
                    },
                    { 
                        descriptor: 'Revenue Account 2', 
                        holding_currency: 'GBP', 
                        balances: {
                            pending: 100,
                            available: 2000,
                            payable: 800,
                            collateral: 50
                        }
                    }
                ]
            });

        const cko = new Checkout(SK, { subdomain: 'test' });

        const balance = await cko.balances.retrieve('ent_djigcqx4clmufo2sasgomgpqsq');

        expect(balance.data).to.be.an('array');
        expect(balance.data.length).to.equal(2);
        expect(balance.data[0]).to.have.property('descriptor');
        expect(balance.data[0]).to.have.property('holding_currency');
        expect(balance.data[0]).to.have.property('balances');
    });
});

// Query values are percent-encoded by the SDK.
describe('Balances - query values', () => {
    let capturedUrl;

    beforeEach(() => {
        capturedUrl = undefined;
        nock('https://balances.sandbox.checkout.com')
            .get(/.*/)
            .reply(function (uri) {
                capturedUrl = uri;
                return [200, {}];
            });
    });

    afterEach(() => nock.cleanAll());

    [
        ['sends a plain value unchanged', 'USD', 'USD'],
        ['encodes & and =', 'USD&b=c', 'USD%26b%3Dc'],
        ['encodes #', 'USD#x', 'USD%23x'],
    ].forEach(([title, value, encoded]) => {
        it(`retrieve with a currency ${title}`, async () => {
            const cko = new Checkout(SK, { subdomain: '123456789' });
            await cko.balances.retrieve('ent_1', value);
            expect(capturedUrl).to.equal(`/balances/ent_1?query=currency%3A${encoded}`);
        });
    });

    [
        ['sends a plain value unchanged', 'ORD-123', 'ORD-123'],
        ['encodes & and =', 'a&b=c', 'a%26b%3Dc'],
        ['encodes #', 'INV#42', 'INV%2342'],
    ].forEach(([title, value, encoded]) => {
        it(`retrieve with a query ${title}`, async () => {
            const cko = new Checkout(SK, { subdomain: '123456789' });
            await cko.balances.retrieve('ent_1', { query: value });
            expect(capturedUrl).to.equal(`/balances/ent_1?query=${encoded}`);
        });
    });

    [
        ['sends a plain value unchanged', 'ORD-123', 'ORD-123'],
        ['encodes & and =', 'a&b=c', 'a%26b%3Dc'],
        ['encodes #', 'INV#42', 'INV%2342'],
    ].forEach(([title, value, encoded]) => {
        it(`retrieve with withCurrencyAccountId ${title}`, async () => {
            const cko = new Checkout(SK, { subdomain: '123456789' });
            await cko.balances.retrieve('ent_1', { withCurrencyAccountId: value });
            expect(capturedUrl).to.equal(`/balances/ent_1?withCurrencyAccountId=${encoded}`);
        });
    });
});
