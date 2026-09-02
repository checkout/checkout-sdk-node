import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

// Built from the swagger `BankAccountFields` example. Every key below is declared in
// the schema: `id`, `display`, `type` and `required` are the four required field
// properties, and `section` / `validation_regex` / `min_length` / `max_length` /
// `help_text` are the declared optional ones. Note the spec's own example carries a
// `description` key that the schema does not declare - it is deliberately not mocked.
const fieldResponse = {
    sections: [
        {
            name: 'Account Details',
            fields: [
                {
                    id: 'iban',
                    type: 'string',
                    display: 'IBAN',
                    section: 'account',
                    required: true,
                    validation_regex: '^[A-Z]{2,2}[0-9]{2,2}[a-zA-Z0-9]{1,18}$',
                    min_length: 22,
                    max_length: 22,
                },
                {
                    id: 'account_holder.first_name',
                    type: 'string',
                    display: 'First name',
                    help_text: "The account holder's first name. Required if type is individual.",
                    section: 'account',
                    required: true,
                },
            ],
        },
    ],
};

describe('Bank account field formatting', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('should retrieve the fields with no query parameters', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/validation/bank-accounts/GB/GBP')
            .reply(200, fieldResponse);

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const response = await cko.instruments.getBankAccountFieldFormatting('GB', 'GBP');

        expect(response.sections[0].name).to.equal('Account Details');
        expect(response.sections[0].fields[0].id).to.equal('iban');
        expect(response.sections[0].fields[0].display).to.equal('IBAN');
        expect(response.sections[0].fields[0].type).to.equal('string');
        expect(response.sections[0].fields[0].required).to.equal(true);
        expect(response.sections[0].fields[0].max_length).to.equal(22);
    });

    it('should send both filters using the hyphenated wire names', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/validation/bank-accounts/GB/GBP')
            .query({
                'account-holder-type': 'corporate',
                'payment-network': 'fps',
            })
            .reply(200, fieldResponse);

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const response = await cko.instruments.getBankAccountFieldFormatting('GB', 'GBP', {
            accountHolderType: 'corporate',
            paymentNetwork: 'fps',
        });

        expect(response).to.not.be.null;
    });

    it('should send only the filter that was supplied', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/validation/bank-accounts/US/USD')
            .query((actual) => {
                expect(actual).to.deep.equal({ 'payment-network': 'ach' });
                return true;
            })
            .reply(200, fieldResponse);

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const response = await cko.instruments.getBankAccountFieldFormatting('US', 'USD', {
            paymentNetwork: 'ach',
        });

        expect(response).to.not.be.null;
    });

    it('should accept the exact hyphenated names as written in swagger', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/validation/bank-accounts/GB/GBP')
            .query({
                'account-holder-type': 'government',
                'payment-network': 'swift',
            })
            .reply(200, fieldResponse);

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const response = await cko.instruments.getBankAccountFieldFormatting('GB', 'GBP', {
            'account-holder-type': 'government',
            'payment-network': 'swift',
        });

        expect(response).to.not.be.null;
    });

    it('should accept every account holder type and payment network the spec declares', async () => {
        const accountHolderTypes = ['individual', 'corporate', 'government'];
        const paymentNetworks = ['local', 'sepa', 'fps', 'ach', 'fedwire', 'swift'];
        const seen = [];

        nock('https://123456789.api.sandbox.checkout.com')
            .get('/validation/bank-accounts/GB/GBP')
            .query((actual) => {
                seen.push(actual);
                return true;
            })
            .times(accountHolderTypes.length + paymentNetworks.length)
            .reply(200, fieldResponse);

        const cko = new Checkout(SK, { subdomain: '123456789' });

        for (const accountHolderType of accountHolderTypes) {
            await cko.instruments.getBankAccountFieldFormatting('GB', 'GBP', {
                accountHolderType,
            });
        }
        for (const paymentNetwork of paymentNetworks) {
            await cko.instruments.getBankAccountFieldFormatting('GB', 'GBP', {
                paymentNetwork,
            });
        }

        expect(seen).to.deep.equal([
            ...accountHolderTypes.map((v) => ({ 'account-holder-type': v })),
            ...paymentNetworks.map((v) => ({ 'payment-network': v })),
        ]);
    });

    it('should ignore a null or non-object query', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/validation/bank-accounts/GB/GBP')
            .times(2)
            .reply(200, fieldResponse);

        const cko = new Checkout(SK, { subdomain: '123456789' });

        expect(await cko.instruments.getBankAccountFieldFormatting('GB', 'GBP', null)).to.not.be
            .null;
        expect(await cko.instruments.getBankAccountFieldFormatting('GB', 'GBP', 'GBP')).to.not.be
            .null;
    });
});
