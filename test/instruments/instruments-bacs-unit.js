import { Checkout } from '../../src/index.js';
import { ValidationError } from '../../src/services/errors.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

const bacsRequest = {
    type: 'bacs',
    account: {
        processing_channel_id: 'pc_q4dbxom5jbgudnjzjpz7j2z6uq',
    },
    instrument_data: {
        account_number: '86753246',
        bank_code: '040004',
        country: 'GB',
        currency: 'GBP',
        payment_type: 'Recurring',
        allow_partial_match: false,
    },
    account_holder: {
        first_name: 'John',
        last_name: 'Smith',
        billing_address: {
            address_line1: 'Cloverfield St.',
            address_line2: '23A',
            city: 'London',
            zip: 'SW1A 1AA',
            country: 'GB',
        },
    },
};

// Every leaf `StoreBacsInstrumentRequest` declares (21 including the `customer`
// $ref subtree), using the swagger examples verbatim.
const fullBacsRequest = {
    type: 'bacs',
    account: {
        processing_channel_id: 'pc_q4dbxom5jbgudnjzjpz7j2z6uq',
    },
    instrument_data: {
        account_number: '86753246',
        bank_code: '040004',
        country: 'GB',
        currency: 'GBP',
        payment_type: 'Recurring',
        allow_partial_match: false,
    },
    account_holder: {
        first_name: 'John',
        last_name: 'Smith',
        billing_address: {
            address_line1: 'Cloverfield St.',
            address_line2: '23A',
            city: 'London',
            zip: 'SW1A 1AA',
            country: 'GB',
        },
    },
    customer: {
        id: 'cus_y3oqhf46pyzuxjbcn2giaqnb44',
        email: 'brucewayne@gmail.com',
        name: 'Bruce Wayne',
        phone: {
            country_code: '+1',
            number: '415 555 2671',
        },
        default: true,
    },
};

// Every leaf `UpdateBacsInstrumentRequest` declares (16). No `customer` - the update
// variants do not accept one.
const fullBacsUpdateRequest = {
    type: 'bacs',
    instrument_data: {
        account_number: '86753246',
        bank_code: '040004',
        country: 'GB',
        currency: 'GBP',
        payment_type: 'Regular',
        allow_partial_match: true,
    },
    account_holder: {
        first_name: 'John',
        last_name: 'Smith',
        company_name: 'Checkout.com',
        type: 'corporate',
        billing_address: {
            address_line1: 'Cloverfield St.',
            address_line2: '23A',
            city: 'London',
            zip: 'SW1A 1AA',
            country: 'GB',
        },
    },
};

describe('Bacs instruments', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('should create a Bacs instrument', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/instruments')
            .reply(201, {
                id: 'src_wmlfc3zyhqzehihu7giusaaawu',
                type: 'bacs',
                fingerprint: 'vnsdrvikkvre3dtrjjvlm5du4q',
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const instrument = await cko.instruments.create(bacsRequest);

        expect(instrument.id).to.equal('src_wmlfc3zyhqzehihu7giusaaawu');
        expect(instrument.type).to.equal('bacs');
        expect(instrument.fingerprint).to.equal('vnsdrvikkvre3dtrjjvlm5du4q');
    });

    it('should not overwrite an explicit bacs type with token', async () => {
        let received;
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/instruments', (body) => {
                received = body;
                return true;
            })
            .reply(201, { id: 'src_wmlfc3zyhqzehihu7giusaaawu', type: 'bacs' });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        await cko.instruments.create(bacsRequest);

        // setInstrumentType only defaults `type` when it is absent
        expect(received.type).to.equal('bacs');
    });

    it('should not overwrite an explicit sepa or ach type with token', async () => {
        const sent = [];
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/instruments', (body) => {
                sent.push(body.type);
                return true;
            })
            .times(2)
            .reply(201, { id: 'src_wmlfc3zyhqzehihu7giusaaawu' });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        await cko.instruments.create({
            type: 'sepa',
            instrument_data: {
                account_number: 'FR2810096000509685512959O86',
                country: 'FR',
                currency: 'EUR',
                payment_type: 'recurring',
            },
        });
        await cko.instruments.create({
            type: 'ach',
            instrument_data: {
                account_type: 'checking',
                account_number: '136549956',
                bank_code: '021000021',
                currency: 'USD',
                country: 'US',
            },
        });

        expect(sent).to.deep.equal(['sepa', 'ach']);
    });

    it('should preserve the Bacs and SEPA payment_type casing split', async () => {
        const sent = [];
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/instruments', (body) => {
                sent.push(body.instrument_data.payment_type);
                return true;
            })
            .times(4)
            .reply(201, { id: 'src_wmlfc3zyhqzehihu7giusaaawu' });

        const cko = new Checkout(SK, { subdomain: '123456789' });

        for (const paymentType of ['Recurring', 'Regular']) {
            await cko.instruments.create({
                ...bacsRequest,
                instrument_data: { ...bacsRequest.instrument_data, payment_type: paymentType },
            });
        }
        for (const paymentType of ['recurring', 'regular']) {
            await cko.instruments.create({
                type: 'sepa',
                instrument_data: {
                    account_number: 'FR2810096000509685512959O86',
                    country: 'FR',
                    currency: 'EUR',
                    payment_type: paymentType,
                },
            });
        }

        // Regression guard for the casing split in the spec: Bacs declares
        // `Recurring` / `Regular` capitalised, SEPA declares `recurring` / `regular`
        // lowercase. The SDK must pass both through untouched - if anyone ever
        // "normalises" payment_type in src/services/validation.js, this test catches it.
        expect(sent).to.deep.equal(['Recurring', 'Regular', 'recurring', 'regular']);
    });

    it('should send the full Bacs create body on the wire unaltered', async () => {
        let received;
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/instruments', (body) => {
                received = body;
                return true;
            })
            .reply(201, { id: 'src_wmlfc3zyhqzehihu7giusaaawu', type: 'bacs' });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        await cko.instruments.create(fullBacsRequest);

        // Exact-body assertion: catches a renamed, dropped or injected key anywhere in
        // the tree. This is node's analogue of the serialization roundtrip tests the
        // typed SDKs use for StoreBacsInstrumentRequest.
        expect(received).to.deep.equal(fullBacsRequest);

        // And pin the key sets level by level, so a new key cannot arrive unnoticed.
        expect(Object.keys(received).sort()).to.deep.equal([
            'account',
            'account_holder',
            'customer',
            'instrument_data',
            'type',
        ]);
        expect(Object.keys(received.instrument_data).sort()).to.deep.equal([
            'account_number',
            'allow_partial_match',
            'bank_code',
            'country',
            'currency',
            'payment_type',
        ]);
        expect(Object.keys(received.account_holder.billing_address).sort()).to.deep.equal([
            'address_line1',
            'address_line2',
            'city',
            'country',
            'zip',
        ]);
        expect(Object.keys(received.customer).sort()).to.deep.equal([
            'default',
            'email',
            'id',
            'name',
            'phone',
        ]);
        expect(Object.keys(received.customer.phone).sort()).to.deep.equal([
            'country_code',
            'number',
        ]);
    });

    it('should send the full Bacs update body on the wire unaltered', async () => {
        let received;
        nock('https://123456789.api.sandbox.checkout.com')
            .patch('/instruments/src_wmlfc3zyhqzehihu7giusaaawu', (body) => {
                received = body;
                return true;
            })
            .reply(200, {
                type: 'bacs',
                id: 'src_wmlfc3zyhqzehihu7giusaaawu',
                fingerprint: 'vnsdrvikkvre3dtrjjvlm5du4q',
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        await cko.instruments.update('src_wmlfc3zyhqzehihu7giusaaawu', fullBacsUpdateRequest);

        expect(received).to.deep.equal(fullBacsUpdateRequest);
        expect(Object.keys(received).sort()).to.deep.equal([
            'account_holder',
            'instrument_data',
            'type',
        ]);
        expect(Object.keys(received.account_holder).sort()).to.deep.equal([
            'billing_address',
            'company_name',
            'first_name',
            'last_name',
            'type',
        ]);
    });

    it('should not inject keys for omitted optional create fields', async () => {
        let received;
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/instruments', (body) => {
                received = body;
                return true;
            })
            .reply(201, { id: 'src_wmlfc3zyhqzehihu7giusaaawu', type: 'bacs' });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        await cko.instruments.create(bacsRequest);

        // `customer` and `account_holder.company_name` were not supplied: they must be
        // absent from the JSON, not present as null.
        expect(received).to.not.have.property('customer');
        expect(received.account_holder).to.not.have.property('company_name');
        expect(received.instrument_data.allow_partial_match).to.equal(false);
    });

    it('should get a Bacs instrument', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .get('/instruments/src_wmlfc3zyhqzehihu7giusaaawu')
            .reply(200, {
                id: 'src_wmlfc3zyhqzehihu7giusaaawu',
                type: 'bacs',
                fingerprint: 'vnsdrvikkvre3dtrjjvlm5du4q',
                created_on: '2021-01-01T00:00:00Z',
                modified_on: '2021-01-01T00:00:00Z',
                vault_id: 'vid_wmlfc3zyhqzehihu7giusaaawu',
                account: {
                    client_id: 'cli_memowvltf7aulpb3poehtiffei',
                    processing_channel_id: 'pc_jcs4ufa6hrgepcrvhic4bfspay',
                },
                validations: [],
                instrument_data: {
                    account_number: '86753246',
                    bank_code: '040004',
                    country: 'GB',
                    currency: 'GBP',
                    payment_type: 'Recurring',
                    allow_partial_match: true,
                    status: 'INVALID',
                    match_status: 'no match',
                    description: 'The name did not match with the account owner.',
                    mandate_id: '6PZ6KFI3KW3UFHAM3J',
                },
                account_holder: {
                    first_name: 'Hannah',
                    last_name: 'Bret',
                    company_name: 'Checkout.com',
                    type: 'corporate',
                    billing_address: {
                        address_line1: '123 High St.',
                        address_line2: 'Flat 456',
                        city: 'London',
                        zip: 'SW1A 1AA',
                        country: 'GB',
                    },
                },
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const instrument = await cko.instruments.get('src_wmlfc3zyhqzehihu7giusaaawu');

        expect(instrument.type).to.equal('bacs');
        expect(instrument.vault_id).to.equal('vid_wmlfc3zyhqzehihu7giusaaawu');
        expect(instrument.instrument_data.payment_type).to.equal('Recurring');
        expect(instrument.instrument_data.mandate_id).to.equal('6PZ6KFI3KW3UFHAM3J');
        expect(instrument.instrument_data.status).to.equal('INVALID');
        expect(instrument.instrument_data.match_status).to.equal('no match');
        expect(instrument.instrument_data.description).to.equal(
            'The name did not match with the account owner.'
        );
        expect(instrument.account_holder.type).to.equal('corporate');
        expect(instrument.account_holder.company_name).to.equal('Checkout.com');
    });

    it('should update a Bacs instrument', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .patch('/instruments/src_wmlfc3zyhqzehihu7giusaaawu')
            .reply(200, {
                type: 'bacs',
                id: 'src_wmlfc3zyhqzehihu7giusaaawu',
                fingerprint: 'vnsdrvikkvre3dtrjjvlm5du4q',
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });
        const updated = await cko.instruments.update('src_wmlfc3zyhqzehihu7giusaaawu', {
            type: 'bacs',
            instrument_data: {
                payment_type: 'Regular',
                allow_partial_match: true,
            },
            account_holder: {
                company_name: 'Checkout.com',
                type: 'corporate',
            },
        });

        expect(updated.type).to.equal('bacs');
        expect(updated.id).to.equal('src_wmlfc3zyhqzehihu7giusaaawu');
        expect(updated.fingerprint).to.equal('vnsdrvikkvre3dtrjjvlm5du4q');
    });

    it('should throw ValidationError on an invalid Bacs instrument', async () => {
        nock('https://123456789.api.sandbox.checkout.com')
            .post('/instruments')
            .reply(422, {
                request_id: '0HL80RJLS76I7',
                error_type: 'request_invalid',
                error_codes: ['bank_code_invalid'],
            });

        const cko = new Checkout(SK, { subdomain: '123456789' });

        try {
            await cko.instruments.create({ type: 'bacs' });
            expect.fail('should have thrown ValidationError');
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
            expect(err.body.error_codes).to.deep.equal(['bank_code_invalid']);
        }
    });
});
