import {
    BadGateway,
    TooManyRequestsError,
    ValidationError,
    ValueError,
    AuthenticationError,
    NotFoundError,
    ActionNotAllowed
} from '../../src/services/errors';
import { Checkout } from '../../src/index';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';
const PK = 'pk_test_4296fd52-efba-4a38-b6ce-cf0d93639d8a';

describe('Request an instrument', () => {
    it('should create instrument', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/tokens')
            .reply(201, {
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
                product_type: 'Visa Traditional'
            });

        nock('https://api.sandbox.checkout.com')
            .post('/instruments')
            .reply(201, {
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
                product_type: 'Visa Traditional'
            });

        const cko = new Checkout(SK, { pk: PK });

        const tokenResponse = await cko.tokens.request({
            number: '4242424242424242',
            expiry_month: 6,
            expiry_year: 2029,
            cvv: '100'
        });

        const instrument = await cko.instruments.create({
            type: 'token',
            token: tokenResponse.token
        });

        console.log(instrument);

        expect(instrument.last4).to.equal('4242');
        expect(instrument.type).to.equal('card');
    });

    it('should dynamically determine instrument type', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/tokens')
            .reply(201, {
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
                product_type: 'Visa Traditional'
            });

        nock('https://api.sandbox.checkout.com')
            .post('/instruments')
            .reply(201, {
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
                product_type: 'Visa Traditional'
            });

        const cko = new Checkout(SK, { pk: PK });

        const tokenResponse = await cko.tokens.request({
            number: '4242424242424242',
            expiry_month: 6,
            expiry_year: 2029,
            cvv: '100'
        });

        const instrument = await cko.instruments.create({
            token: tokenResponse.token
        });

        console.log(instrument);

        expect(instrument.last4).to.equal('4242');
        expect(instrument.type).to.equal('card');
    });

    it('should throw authentication error', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/tokens')
            .reply(201, {
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
                product_type: 'Visa Traditional'
            });

        nock('https://api.sandbox.checkout.com')
            .post('/instruments')
            .reply(401);

        const cko = new Checkout('', { pk: PK });

        const tokenResponse = await cko.tokens.request({
            number: '4242424242424242',
            expiry_month: 6,
            expiry_year: 2029,
            cvv: '100'
        });

        try {
            const instrument = await cko.instruments.create({
                token: tokenResponse.token
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw validation error', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/tokens')
            .reply(201, {
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
                product_type: 'Visa Traditional'
            });

        nock('https://api.sandbox.checkout.com')
            .post('/instruments')
            .reply(422, {
                request_id: '8f7ac6ed-51b0-4c74-bcbb-ecea1d8fe7b3',
                error_type: 'token_invalid',
                error_codes: ['token_invalid']
            });

        const cko = new Checkout(SK, { pk: 'pk_test_6e40a700-d563-43cd-89d0-f9bb17d35e73' });

        const tokenResponse = await cko.tokens.request({
            number: '4242424242424242',
            expiry_month: 6,
            expiry_year: 2029,
            cvv: '100'
        });

        try {
            const instrument = await cko.instruments.create({
                token: tokenResponse.token
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });
});
