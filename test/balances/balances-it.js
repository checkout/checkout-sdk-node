import { expect } from 'chai';
import nock from 'nock';
import Checkout from '../../src/Checkout.js';

afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

// OAuth configuration - Swagger requires OAuth scope: "balances"
const cko = new Checkout(process.env.CHECKOUT_DEFAULT_OAUTH_CLIENT_SECRET, {
    client: process.env.CHECKOUT_DEFAULT_OAUTH_CLIENT_ID,
    scope: ['balances'],
    environment: 'sandbox',
    subdomain: process.env.CHECKOUT_MERCHANT_SUBDOMAIN,
});

describe('Integration::Balances', () => {

    it('should retrieve entity balances', async () => {
        // Using same entity ID as .NET SDK tests
        const entityId = 'ent_kidtcgc3ge5unf4a5i6enhnr5m';
        
        const balance = await cko.balances.retrieve(entityId);

        expect(balance).to.have.property('data');
        expect(balance.data).to.be.an('array');
        if (balance.data.length > 0) {
            expect(balance.data[0]).to.have.property('descriptor');
            expect(balance.data[0]).to.have.property('holding_currency');
            expect(balance.data[0]).to.have.property('balances');
        }
    });

    it('should retrieve balances with currency filter', async () => {
        // Requires valid entity ID with EUR balances
        const entityId = 'ent_kidtcgc3ge5unf4a5i6enhnr5m';
        
        // Test with string parameter (backward compatibility)
        const balanceString = await cko.balances.retrieve(entityId, 'EUR');

        expect(balanceString).to.have.property('data');
        expect(balanceString.data).to.be.an('array');
        if (balanceString.data.length > 0) {
            expect(balanceString.data[0]).to.have.property('descriptor');
            expect(balanceString.data[0]).to.have.property('holding_currency', 'EUR');
            expect(balanceString.data[0]).to.have.property('balances');
        }

        // Test with object parameter (new API)
        const balanceObject = await cko.balances.retrieve(entityId, { 
            query: 'currency:EUR' 
        });

        expect(balanceObject).to.have.property('data');
        expect(balanceObject.data).to.be.an('array');
        if (balanceObject.data.length > 0) {
            expect(balanceObject.data[0]).to.have.property('descriptor');
            expect(balanceObject.data[0]).to.have.property('holding_currency', 'EUR');
            expect(balanceObject.data[0]).to.have.property('balances');
        }
    });

    it('should retrieve balances with currency account ID', async () => {
        // Requires valid entity ID with currency accounts
        const entityId = 'ent_kidtcgc3ge5unf4a5i6enhnr5m';
        
        const balance = await cko.balances.retrieve(entityId, { 
            withCurrencyAccountId: true 
        });

        expect(balance).to.have.property('data');
        expect(balance.data).to.be.an('array');
        if (balance.data.length > 0) {
            expect(balance.data[0]).to.have.property('descriptor');
            expect(balance.data[0]).to.have.property('holding_currency');
            expect(balance.data[0]).to.have.property('balances');
            expect(balance.data[0]).to.have.property('currency_account_id');
        }
    });

    it('should retrieve balances with query and withCurrencyAccountId', async () => {
        // Requires valid entity ID with GBP balances
        const entityId = 'ent_kidtcgc3ge5unf4a5i6enhnr5m';
        
        const balance = await cko.balances.retrieve(entityId, { 
            query: 'currency:GBP',
            withCurrencyAccountId: true 
        });

        expect(balance).to.have.property('data');
        expect(balance.data).to.be.an('array');
        if (balance.data.length > 0) {
            expect(balance.data[0]).to.have.property('descriptor');
            expect(balance.data[0]).to.have.property('holding_currency', 'GBP');
            expect(balance.data[0]).to.have.property('balances');
            expect(balance.data[0]).to.have.property('currency_account_id');
        }
    });

    it('should retrieve all balances without filters', async () => {
        // Requires valid entity ID with multiple currency balances
        const entityId = 'ent_kidtcgc3ge5unf4a5i6enhnr5m';
        
        const balance = await cko.balances.retrieve(entityId);

        expect(balance).to.have.property('data');
        expect(balance.data).to.be.an('array');
        expect(balance.data.length).to.be.greaterThan(0);
        
        // Verify structure matches swagger schema
        expect(balance.data[0]).to.have.property('descriptor');
        expect(balance.data[0]).to.have.property('holding_currency');
        expect(balance.data[0]).to.have.property('balances');
        
        // Verify balances object structure
        const balances = balance.data[0].balances;
        expect(balances).to.be.an('object');
        // Balances may include: pending, available, payable, collateral
    });
});
