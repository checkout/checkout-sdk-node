import { AuthenticationError, NotFoundError } from '../../src/services/errors.js';
import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_sbox_o2nulev2arguvyf6w7sc5fkznas';
const LIVE_SK = 'sk_o2nulev2arguvyf6w7sc5fkznas';

const ENTITY_ID = 'ent_w4jelhppmfiufdnatam37wrfc4';
const CURRENCY_ACCOUNT_ID = 'ca_g5y7d6jo4e2urgforcbf2ey5jm';
const TOP_UP_PATH = `/entities/${ENTITY_ID}/currency-accounts/${CURRENCY_ACCOUNT_ID}/top-up-instructions`;

// Every value below is a field-level `example` from shared/swagger-latest.json; the response
// schema carries no top-level example.
const FULL_RAIL = {
    beneficiary_account_name: 'Acme Inc',
    beneficiary_address: '1 Example Street, Exampleville, EX, 00000, US',
    bank_name: 'Example Bank',
    bank_address: '1 Example Street, Exampleville, EX, 00000, US',
    account_number: '1234567890',
    sort_code: '000000',
    routing_number: '000000000',
    iban: 'GB00EXAM00000000000000',
    swift_code: 'TESTUS00XXX',
};

const assertFullRail = (rail) => {
    expect(rail).to.have.property('beneficiary_account_name', 'Acme Inc');
    expect(rail).to.have.property('beneficiary_address', '1 Example Street, Exampleville, EX, 00000, US');
    expect(rail).to.have.property('bank_name', 'Example Bank');
    expect(rail).to.have.property('bank_address', '1 Example Street, Exampleville, EX, 00000, US');
    expect(rail).to.have.property('account_number', '1234567890');
    expect(rail).to.have.property('sort_code', '000000');
    expect(rail).to.have.property('routing_number', '000000000');
    expect(rail).to.have.property('iban', 'GB00EXAM00000000000000');
    expect(rail).to.have.property('swift_code', 'TESTUS00XXX');
};

describe('Balances - top-up instructions', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    // This is the test that catches T1. The scope is the bare host and the path starts with
    // /entities: if the implementation reused config.balancesUrl (which ends in /balances) the
    // request would go to /balances/entities/... and this interceptor would never match.
    it('should retrieve top-up instructions from the balances host, without a /balances prefix', async () => {
        nock('https://balances.sandbox.checkout.com')
            .get(TOP_UP_PATH)
            .reply(200, {
                currency_account_id: CURRENCY_ACCOUNT_ID,
                currency: 'USD',
                payment_reference: 'TP-ABC123',
                bank_details: { domestic: FULL_RAIL, international: FULL_RAIL },
            });

        const cko = new Checkout(SK, { subdomain: 'test' });

        const response = await cko.balances.retrieveTopUpInstructions(ENTITY_ID, CURRENCY_ACCOUNT_ID);

        expect(response).to.have.property('currency_account_id', CURRENCY_ACCOUNT_ID);
        expect(response).to.have.property('currency', 'USD');
        expect(response).to.have.property('payment_reference', 'TP-ABC123');
        expect(response.bank_details).to.be.an('object');
        assertFullRail(response.bank_details.domestic);
        assertFullRail(response.bank_details.international);
    });

    it('should retrieve top-up instructions in production', async () => {
        nock('https://balances.checkout.com')
            .get(TOP_UP_PATH)
            .reply(200, {
                currency_account_id: CURRENCY_ACCOUNT_ID,
                currency: 'USD',
                payment_reference: 'TP-ABC123',
                bank_details: { domestic: FULL_RAIL },
            });

        const cko = new Checkout(LIVE_SK, { subdomain: 'test' });

        const response = await cko.balances.retrieveTopUpInstructions(ENTITY_ID, CURRENCY_ACCOUNT_ID);

        expect(response).to.have.property('payment_reference', 'TP-ABC123');
        expect(response.bank_details.domestic).to.be.an('object');
    });

    // The spec declares no `required` array on TopUpBankDetails, so domestic-only,
    // international-only and an empty bank_details are all legal 200 bodies.
    it('should handle a domestic-only response', async () => {
        nock('https://balances.sandbox.checkout.com')
            .get(TOP_UP_PATH)
            .reply(200, {
                currency_account_id: CURRENCY_ACCOUNT_ID,
                currency: 'USD',
                payment_reference: 'TP-ABC123',
                bank_details: {
                    domestic: {
                        beneficiary_account_name: 'Acme Inc',
                        bank_name: 'Example Bank',
                        account_number: '1234567890',
                        routing_number: '000000000',
                    },
                },
            });

        const cko = new Checkout(SK, { subdomain: 'test' });

        const response = await cko.balances.retrieveTopUpInstructions(ENTITY_ID, CURRENCY_ACCOUNT_ID);

        expect(response.bank_details).to.not.have.property('international');
        expect(response.bank_details.domestic).to.have.property('routing_number', '000000000');
        expect(response.bank_details.domestic).to.not.have.property('sort_code');
        expect(response.bank_details.domestic).to.not.have.property('iban');
        expect(response.bank_details.domestic).to.not.have.property('swift_code');
    });

    it('should handle an international-only response', async () => {
        nock('https://balances.sandbox.checkout.com')
            .get(TOP_UP_PATH)
            .reply(200, {
                currency_account_id: CURRENCY_ACCOUNT_ID,
                currency: 'USD',
                payment_reference: 'TP-ABC123',
                bank_details: {
                    international: {
                        beneficiary_account_name: 'Acme Inc',
                        bank_name: 'Example Bank',
                        iban: 'GB00EXAM00000000000000',
                        swift_code: 'TESTUS00XXX',
                    },
                },
            });

        const cko = new Checkout(SK, { subdomain: 'test' });

        const response = await cko.balances.retrieveTopUpInstructions(ENTITY_ID, CURRENCY_ACCOUNT_ID);

        expect(response.bank_details).to.not.have.property('domestic');
        expect(response.bank_details.international).to.have.property('swift_code', 'TESTUS00XXX');
        expect(response.bank_details.international).to.not.have.property('account_number');
        expect(response.bank_details.international).to.not.have.property('routing_number');
    });

    it('should handle an empty bank_details object', async () => {
        nock('https://balances.sandbox.checkout.com')
            .get(TOP_UP_PATH)
            .reply(200, {
                currency_account_id: CURRENCY_ACCOUNT_ID,
                currency: 'USD',
                payment_reference: 'TP-ABC123',
                bank_details: {},
            });

        const cko = new Checkout(SK, { subdomain: 'test' });

        const response = await cko.balances.retrieveTopUpInstructions(ENTITY_ID, CURRENCY_ACCOUNT_ID);

        expect(response.bank_details).to.be.an('object');
        expect(response.bank_details).to.not.have.property('domestic');
        expect(response.bank_details).to.not.have.property('international');
    });

    it('should throw AuthenticationError on 401', async () => {
        nock('https://balances.sandbox.checkout.com').get(TOP_UP_PATH).reply(401);

        try {
            const cko = new Checkout(SK, { subdomain: 'test' });
            await cko.balances.retrieveTopUpInstructions(ENTITY_ID, CURRENCY_ACCOUNT_ID);
            expect.fail('expected AuthenticationError');
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    // 404 is documented as "sub-account could not be found, or has no top-up instructions".
    it('should throw NotFoundError on 404', async () => {
        nock('https://balances.sandbox.checkout.com').get(TOP_UP_PATH).reply(404);

        try {
            const cko = new Checkout(SK, { subdomain: 'test' });
            await cko.balances.retrieveTopUpInstructions(ENTITY_ID, CURRENCY_ACCOUNT_ID);
            expect.fail('expected NotFoundError');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });
});
