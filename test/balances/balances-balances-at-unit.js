import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Balances.retrieve — balances_at query support', () => {
    afterEach(() => nock.cleanAll());

    it('forwards balances_at as URL-encoded query parameter', async () => {
        let capturedUrl;
        nock('https://balances.sandbox.checkout.com')
            .get(/.*/)
            .reply(function (uri) {
                capturedUrl = uri;
                return [200, { data: [] }];
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        await cko.balances.retrieve('ent_1', {
            query: 'currency:EUR',
            balancesAt: '2026-01-01T00:00:00Z',
        });

        expect(capturedUrl).to.include('balances_at=2026-01-01T00%3A00%3A00Z');
        expect(capturedUrl).to.include('query=currency:EUR');
    });

    it('omits balances_at when not provided', async () => {
        let capturedUrl;
        nock('https://balances.sandbox.checkout.com')
            .get(/.*/)
            .reply(function (uri) {
                capturedUrl = uri;
                return [200, { data: [] }];
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        await cko.balances.retrieve('ent_1', { query: 'currency:EUR' });

        expect(capturedUrl).to.not.include('balances_at');
    });
});
