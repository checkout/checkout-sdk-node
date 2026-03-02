import { expect } from 'chai';
import nock from 'nock';
import Checkout from '../../src/Checkout.js';

afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
});

// OAuth configuration - Swagger requires OAuth scope: "vault:card-metadata"
const cko = new Checkout(process.env.CHECKOUT_DEFAULT_OAUTH_CLIENT_SECRET, {
    client: process.env.CHECKOUT_DEFAULT_OAUTH_CLIENT_ID,
    scope: ['vault:card-metadata'],
    environment: 'sandbox',
    subdomain: process.env.CHECKOUT_MERCHANT_SUBDOMAIN,
});

describe('Integration::CardMetadata', () => {

    it('should get card metadata for Visa', async () => {
        const metadata = await cko.cardMetadata.get({
            source: {
                type: 'card',
                number: '4539467987109256',
            },
            format: 'basic',
        });

        expect(metadata).to.have.property('bin');
        expect(metadata).to.have.property('scheme');
        expect(metadata.scheme).to.equal('visa');
        // Note: API returns lowercase values despite swagger showing uppercase
        if (metadata.card_type) {
            expect(metadata.card_type).to.be.oneOf(['CREDIT', 'DEBIT', 'PREPAID', 'CHARGE', 'DEFERRED DEBIT', 'credit', 'debit', 'prepaid', 'charge']);
        }
        if (metadata.card_category) {
            expect(metadata.card_category).to.be.oneOf(['CONSUMER', 'COMMERCIAL', 'consumer', 'commercial']);
        }
    });

    it('should get card metadata for Mastercard', async () => {
        const metadata = await cko.cardMetadata.get({
            source: {
                type: 'card',
                number: '5436031030606378',
            },
            format: 'basic',
        });

        expect(metadata).to.have.property('bin');
        expect(metadata).to.have.property('scheme');
        expect(metadata.scheme).to.equal('mastercard');
    });

    it('should get card metadata using BIN', async () => {
        const metadata = await cko.cardMetadata.get({
            source: {
                type: 'bin',
                bin: '453946',
            },
        });

        expect(metadata).to.have.property('bin', '453946');
        expect(metadata).to.have.property('scheme');
    });

    it('should get card metadata with card_payouts format', async () => {
        const metadata = await cko.cardMetadata.get({
            source: {
                type: 'card',
                number: '4539467987109256',
            },
            format: 'card_payouts',
        });

        expect(metadata).to.have.property('bin');
        expect(metadata).to.have.property('scheme');
        if (metadata.card_payouts) {
            expect(metadata.card_payouts).to.be.an('object');
        }
    });
});
