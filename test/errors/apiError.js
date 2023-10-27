import { Checkout } from '../../src/index';
import { expect } from 'chai';
import nock from 'nock';

const PK = 'pk_test_4296fd52-efba-4a38-b6ce-cf0d93639d8a';

describe('Handling Errors', () => {
    const mockErrorResponse = { error: true };
    const mockErrorCode = 500;

    afterEach(() => {
        nock.cleanAll();
    });

    it('should handle API error', async () => {
        nock('https://api.sandbox.checkout.com')
            .post('/tokens')
            .reply(mockErrorCode, mockErrorResponse);

        const cko = new Checkout();
        cko.config.pk = PK;

        let errorWasThrown = false;

        try {
            await cko.tokens.request({
                type: 'card',
                number: '4242424242424242',
                expiry_month: 6,
                expiry_year: 2029,
                cvv: '100'
            });
        } catch (error) {
            errorWasThrown = true;

            expect(error.http_code).to.equal(mockErrorCode);
            expect(error.body).to.deep.equal(mockErrorResponse);
        }

        expect(errorWasThrown).to.equal(true);
    });
});
