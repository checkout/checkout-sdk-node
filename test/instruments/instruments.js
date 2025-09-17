import { AuthenticationError, NotFoundError, ValidationError, } from '../../src/services/errors.js';
import { Checkout } from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';
const PK = 'pk_test_4296fd52-efba-4a38-b6ce-cf0d93639d8a';

describe('Request an instrument', () => {
    it('should create instrument', async () => {
        nock('https://api.sandbox.checkout.com').post('/tokens').reply(201, {
            type: 'card',
            token: 'tok_pmjyslgaam4uzmvaiwqyhovvsy',
            expires_on: '2020-01-30T15:08:33Z',
            expiry_month: 6,
            expiry_year: 2029,
            scheme: 'Visa',
            last4: '4242',
            bin: '424242',
            card_type: 'Credit',
            card_category: 'Consumer',
            issuer: 'JPMORGAN CHASE BANK NA',
            issuer_country: 'US',
            product_id: 'A',
            product_type: 'Visa Traditional',
        });

        nock('https://api.sandbox.checkout.com').post('/instruments').reply(201, {
            id: 'src_pyey2xt6jq4enkcqvoqwjmc3xe',
            type: 'card',
            expiry_month: 6,
            expiry_year: 2029,
            scheme: 'Visa',
            last4: '4242',
            bin: '424242',
            card_type: 'Credit',
            card_category: 'Consumer',
            issuer: 'JPMORGAN CHASE BANK NA',
            issuer_country: 'US',
            product_id: 'A',
            product_type: 'Visa Traditional',
        });

        const cko = new Checkout(SK, { pk: PK });

        const tokenResponse = await cko.tokens.request({
            number: '4242424242424242',
            expiry_month: 6,
            expiry_year: 2029,
            cvv: '100',
        });

        const instrument = await cko.instruments.create({
            type: 'token',
            token: tokenResponse.token,
        });

        expect(instrument.last4).to.equal('4242');
        expect(instrument.type).to.equal('card');
    });

    it('should dynamically determine instrument type', async () => {
        nock('https://api.sandbox.checkout.com').post('/tokens').reply(201, {
            type: 'card',
            token: 'tok_pmjyslgaam4uzmvaiwqyhovvsy',
            expires_on: '2020-01-30T15:08:33Z',
            expiry_month: 6,
            expiry_year: 2029,
            scheme: 'Visa',
            last4: '4242',
            bin: '424242',
            card_type: 'Credit',
            card_category: 'Consumer',
            issuer: 'JPMORGAN CHASE BANK NA',
            issuer_country: 'US',
            product_id: 'A',
            product_type: 'Visa Traditional',
        });

        nock('https://api.sandbox.checkout.com').post('/instruments').reply(201, {
            id: 'src_pyey2xt6jq4enkcqvoqwjmc3xe',
            type: 'card',
            expiry_month: 6,
            expiry_year: 2029,
            scheme: 'Visa',
            last4: '4242',
            bin: '424242',
            card_type: 'Credit',
            card_category: 'Consumer',
            issuer: 'JPMORGAN CHASE BANK NA',
            issuer_country: 'US',
            product_id: 'A',
            product_type: 'Visa Traditional',
        });

        const cko = new Checkout(SK, { pk: PK });

        const tokenResponse = await cko.tokens.request({
            number: '4242424242424242',
            expiry_month: 6,
            expiry_year: 2029,
            cvv: '100',
        });

        const instrument = await cko.instruments.create({
            token: tokenResponse.token,
        });

        expect(instrument.last4).to.equal('4242');
        expect(instrument.type).to.equal('card');
    });

    it('should throw authentication error', async () => {
        nock('https://api.sandbox.checkout.com').post('/tokens').reply(201, {
            type: 'card',
            token: 'tok_pmjyslgaam4uzmvaiwqyhovvsy',
            expires_on: '2020-01-30T15:08:33Z',
            expiry_month: 6,
            expiry_year: 2029,
            scheme: 'Visa',
            last4: '4242',
            bin: '424242',
            card_type: 'Credit',
            card_category: 'Consumer',
            issuer: 'JPMORGAN CHASE BANK NA',
            issuer_country: 'US',
            product_id: 'A',
            product_type: 'Visa Traditional',
        });

        nock('https://api.sandbox.checkout.com').post('/instruments').reply(401);

        const cko = new Checkout('', { pk: PK });

        const tokenResponse = await cko.tokens.request({
            number: '4242424242424242',
            expiry_month: 6,
            expiry_year: 2029,
            cvv: '100',
        });

        try {
            const instrument = await cko.instruments.create({
                token: tokenResponse.token,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw validation error', async () => {
        nock('https://api.sandbox.checkout.com').post('/tokens').reply(201, {
            type: 'card',
            token: 'tok_pmjyslgaam4uzmvaiwqyhovvsy',
            expires_on: '2020-01-30T15:08:33Z',
            expiry_month: 6,
            expiry_year: 2029,
            scheme: 'Visa',
            last4: '4242',
            bin: '424242',
            card_type: 'Credit',
            card_category: 'Consumer',
            issuer: 'JPMORGAN CHASE BANK NA',
            issuer_country: 'US',
            product_id: 'A',
            product_type: 'Visa Traditional',
        });

        nock('https://api.sandbox.checkout.com')
            .post('/instruments')
            .reply(422, {
                request_id: '8f7ac6ed-51b0-4c74-bcbb-ecea1d8fe7b3',
                error_type: 'token_invalid',
                error_codes: ['token_invalid'],
            });

        const cko = new Checkout(SK, { pk: 'pk_test_6e40a700-d563-43cd-89d0-f9bb17d35e73' });

        const tokenResponse = await cko.tokens.request({
            number: '4242424242424242',
            expiry_month: 6,
            expiry_year: 2029,
            cvv: '100',
        });

        try {
            const instrument = await cko.instruments.create({
                token: tokenResponse.token,
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });

    it('should get the instrument with the id', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/instruments/src_udfsqsgpjykutgs26fiejgizau')
            .reply(201, {
                id: 'src_wmlfc3zyhqzehihu7giusaaawu',
                type: 'card',
                expiry_month: 6,
                expiry_year: 2025,
                scheme: 'VISA',
                last4: '9996',
                bin: '454347',
                card_type: 'Credit',
                card_category: 'Consumer',
                issuer: 'GOTHAM STATE BANK',
                issuer_country: 'US',
                product_id: 'F',
                product_type: 'CLASSIC',
            });

        const cko = new Checkout(SK);

        const instrumentResponse = await cko.instruments.get('src_udfsqsgpjykutgs26fiejgizau');
        expect(instrumentResponse.id).to.equal('src_wmlfc3zyhqzehihu7giusaaawu');
    });

    it('should throw Not Found when trying to get an instrument', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/instruments/src_udfsqsgpjykutgs26fiejgizaz')
            .reply(404);
        const cko = new Checkout(SK);

        try {
            const instrumentResponse = await cko.instruments.get('src_udfsqsgpjykutgs26fiejgizaz');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should update instrument', async () => {
        nock('https://api.sandbox.checkout.com')
            .patch('/instruments/src_udfsqsgpjykutgs26fiejgizau')
            .reply(200, {
                type: 'card',
                fingerprint: '5fc59d24b1ed1b5e652d06b935d26445cbcd35263b6e97cb51a43e46a43b2aaf',
            });

        const cko = new Checkout(SK);

        const instrumentResponse = await cko.instruments.update('src_udfsqsgpjykutgs26fiejgizau', {
            expiry_year: 2030,
        });

        expect(instrumentResponse.type).to.equal('card');
    });

    it('should throw Not Found when trying to update an instrument', async () => {
        nock('https://api.sandbox.checkout.com')
            .patch('/instruments/src_udfsqsgpjykutgs26fiejgizau')
            .reply(404);
        const cko = new Checkout(SK);

        try {
            const instrumentResponse = await cko.instruments.update(
                'src_udfsqsgpjykutgs26fiejgizau',
                {
                    expiry_year: 2030,
                }
            );
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should throw authorization error when updating instrument', async () => {
        nock('https://api.sandbox.checkout.com')
            .patch('/instruments/src_udfsqsgpjykutgs26fiejgizau')
            .reply(200, {
                type: 'card',
                fingerprint: '5fc59d24b1ed1b5e652d06b935d26445cbcd35263b6e97cb51a43e46a43b2aaf',
            });

        const cko = new Checkout('');

        try {
            const instrumentResponse = await cko.instruments.update(
                'src_udfsqsgpjykutgs26fiejgizau',
                {
                    expiry_year: 2030,
                }
            );
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should delete instrument', async () => {
        nock('https://api.sandbox.checkout.com').post('/tokens').reply(201, {
            type: 'card',
            token: 'tok_pmjyslgaam4uzmvaiwqyhovvsy',
            expires_on: '2020-01-30T15:08:33Z',
            expiry_month: 6,
            expiry_year: 2029,
            scheme: 'Visa',
            last4: '4242',
            bin: '424242',
            card_type: 'Credit',
            card_category: 'Consumer',
            issuer: 'JPMORGAN CHASE BANK NA',
            issuer_country: 'US',
            product_id: 'A',
            product_type: 'Visa Traditional',
        });

        nock('https://api.sandbox.checkout.com').post('/instruments').reply(201, {
            id: 'src_pyey2xt6jq4enkcqvoqwjmc3xe',
            type: 'card',
            expiry_month: 6,
            expiry_year: 2029,
            scheme: 'Visa',
            last4: '4242',
            bin: '424242',
            card_type: 'Credit',
            card_category: 'Consumer',
            issuer: 'JPMORGAN CHASE BANK NA',
            issuer_country: 'US',
            product_id: 'A',
            product_type: 'Visa Traditional',
        });

        nock('https://api.sandbox.checkout.com')
            .delete('/instruments/src_pyey2xt6jq4enkcqvoqwjmc3xe')
            .reply(200, {});

        const cko = new Checkout(SK, { pk: PK });

        const tokenResponse = await cko.tokens.request({
            number: '4242424242424242',
            expiry_month: 6,
            expiry_year: 2029,
            cvv: '100',
        });

        const instrument = await cko.instruments.create({
            type: 'token',
            token: tokenResponse.token,
        });

        const deleteOutcome = await cko.instruments.delete(instrument.id);
    });

    it('should throw when deleting instrument', async () => {
        nock('https://api.sandbox.checkout.com').delete('/instruments/src_123').reply(404, {});

        const cko = new Checkout(SK, { pk: PK });

        try {
            const deleteOutcome = await cko.instruments.delete('src_123');
        } catch (err) {
            expect(err).to.be.instanceOf(NotFoundError);
        }
    });

    it('should get bank account field formatting', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'payouts:bank-details',
        });

        nock('https://api.sandbox.checkout.com')
            .get('/validation/bank-accounts/GB/GBP')
            .reply(201, {
                sections: [
                    {
                        fields: [
                            {
                                id: 'account_number',
                                display: 'Account Number',
                                type: 'string',
                                validation_regex: '^[0-9]{8,8}$',
                                required: true,
                                allowed_options: [],
                                dependencies: [],
                                restrictions: [],
                            },
                            {
                                id: 'bank_code',
                                display: 'Sort Code',
                                type: 'string',
                                validation_regex: '^[0-9]{6,6}$',
                                required: true,
                                allowed_options: [],
                                dependencies: [],
                                restrictions: [],
                            },
                        ],
                        name: 'Account details',
                    },
                ],
            });

        let cko = new Checkout(
            '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
            {
                client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                scope: ['payouts:bank-details'],
                environment: 'sandbox',
            }
        );

        const bank = await cko.instruments.getBankAccountFieldFormatting('GB', 'GBP');
        expect(bank.sections).to.exist;
    });

    it('should throw when getting bank account field formatting', async () => {
        nock('https://access.sandbox.checkout.com').post('/connect/token').reply(201, {
            access_token: '1234',
            expires_in: 3600,
            token_type: 'Bearer',
            scope: 'payouts:bank-details',
        });

        nock('https://api.sandbox.checkout.com')
            .get('/validation/bank-accounts/GB/GBP')
            .reply(401, {});

        const cko = new Checkout(SK, { pk: PK });

        try {
            let cko = new Checkout(
                '2p7YQ37fHiRr8O6lQAikl8enICesB1dvAJrpmE2nZfEOpxzE-J_Gho7wDy0HY9951RfdUr0vSaQCzRKP0-o5Xg',
                {
                    client: 'ack_vvzhoai466su3j3vbxb47ts5oe',
                    scope: ['payouts:bank-details'],
                    environment: 'sandbox',
                }
            );

            const bank = await cko.instruments.getBankAccountFieldFormatting('GB', 'GBP');
            expect(bank.sections).to.exist;
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
