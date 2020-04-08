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

const PK = 'pk_test_4296fd52-efba-4a38-b6ce-cf0d93639d8a';

describe('Request a token', () => {
    it('should create token', async () => {
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

        const cko = new Checkout();
        cko.config.pk = PK;

        const transaction = await cko.tokens.request({
            type: 'card',
            number: '4242424242424242',
            expiry_month: 6,
            expiry_year: 2029,
            cvv: '100'
        });

        expect(transaction.type).to.equal('card');
    });

    it('should dynamically determine card type', async () => {
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

        const cko = new Checkout();
        cko.config.pk = PK;

        const transaction = await cko.tokens.request({
            number: '4242424242424242',
            expiry_month: 6,
            expiry_year: 2029,
            cvv: '100'
        });

        expect(transaction.type).to.equal('card');
    });

    it('should dynamically determine applepay type', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/tokens')
            .reply(201, {
                type: 'applepay',
                token: 'tok_in5b4abfmi4ulcsgv2omh4f5se',
                expires_on: '2020-01-30T15:29:28Z',
                expiry_month: 11,
                expiry_year: 2025,
                last4: '1699',
                bin: '481749'
            });

        const cko = new Checkout();
        cko.config.pk = PK;

        const transaction = await cko.tokens.request({
            token_data: {
                version: 'EC_v1',
                data:
                    't7GeajLB9skXB6QSWfEpPA4WPhDqB7ekdd+F7588arLzvebKp3P0TekUslSQ8nkuacUgLdks2IKyCm7U3OL/PEYLXE7w60VkQ8WE6FXs/cqHkwtSW9vkzZNDxSLDg9slgLYxAH2/iztdipPpyIYKl0Kb6Rn9rboF+lwgRxM1B3n84miApwF5Pxl8ZOOXGY6F+3DsDo7sMCUTaJK74DUJJcjIXrigtINWKW6RFa/4qmPEC/Y+syg04x7B99mbLQQzWFm7z6HfRmynPM9/GA0kbsqd/Kn5Mkqssfhn/m6LuNKsqEmbKi85FF6kip+F17LRawG48bF/lT8wj/QEuDY0G7t/ryOnGLtKteXmAf0oJnwkelIyfyj2KI8GChBuTJonGlXKr5klPE89/ycmkgDl+T6Ms7PhiNZpuGEE2QE=',
                signature:
                    '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',
                header: {
                    ephemeralPublicKey:
                        'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEX1ievoT8DRB8T5zGkhHZHeDr0oBmYEgsDSxyT0MD0IZ2Mpfjz2LdWq6LUwSH9EmxdPEzMunsZKWMyOr3K/zlsw==',
                    publicKeyHash: 'tqYV+tmG9aMh+l/K6cicUnPqkb1gUiLjSTM9gEz6Nl0=',
                    transactionId:
                        '3cee89679130a4b2617c76118a1c62fd400cd45b49dc0916d5b951b560cd17b4'
                }
            }
        });

        expect(transaction.type).to.equal('applepay');
    });

    it('should dynamically determine googlepay type', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/tokens')
            .reply(422, {
                request_id: '8c6c8e49-1eca-4e66-91a0-709abbc1a6a5',
                error_type: 'request_invalid',
                error_codes: ['token_data_invalid']
            });

        const cko = new Checkout();
        cko.config.pk = PK;

        try {
            const transaction = await cko.tokens.request({
                token_data: {
                    protocolVersion: 'ECv1',
                    signature: 'TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ',
                    signedMessage:
                        '{"encryptedMessage": "ZW5jcnlwdGVkTWVzc2FnZQ==", "ephemeralPublicKey": "ZXBoZW1lcmFsUHVibGljS2V5", "tag": "c2lnbmF0dXJl"}'
                }
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });

    it('should throw authentication error', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/tokens')
            .reply(401);

        const cko = new Checkout();
        cko.config.pk = 'test';

        try {
            const transaction = await cko.tokens.request({
                type: 'card',
                number: '4242424242424242',
                expiry_month: 6,
                expiry_year: 2029,
                cvv: '100'
            });
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should throw ValidationError error', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/tokens')
            .reply(422, {
                request_id: '0HL80RJLS76I7',
                error_type: 'request_invalid',
                error_codes: ['token_type_required']
            });

        const cko = new Checkout();
        cko.config.pk = PK;

        try {
            const transaction = await cko.tokens.request({
                number: '4242424242424242',
                expiry_month: 6,
                expiry_year: 2029,
                cvv: '100'
            });
        } catch (err) {
            expect(err).to.be.instanceOf(ValidationError);
        }
    });
});
