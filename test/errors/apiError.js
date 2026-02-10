import { Checkout } from '../../src/index.js';
import { ActionNotAllowed, AuthenticationError, NotFoundError } from '../../src/services/errors.js';
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

    it('should include body for 401 AuthenticationError', async () => {
        const body = { error_type: 'authentication_error', message: 'invalid_key' };

        nock('https://api.sandbox.checkout.com')
            .post('/tokens')
            .reply(401, body);

        const cko = new Checkout();
        cko.config.pk = PK;

        try {
            await cko.tokens.request({
                type: 'card',
                number: '4242424242424242',
                expiry_month: 6,
                expiry_year: 2029,
                cvv: '100'
            });
        } catch (error) {
            expect(error).to.be.instanceOf(AuthenticationError);
            expect(error.body).to.deep.equal(body);
            return;
        }

        throw new Error('Expected AuthenticationError to be thrown');
    });

    it('should include body for 403 ActionNotAllowed', async () => {
        const body = { error_type: 'action_not_allowed', message: 'card_not_enrolled' };

        nock('https://api.sandbox.checkout.com')
            .post('/tokens')
            .reply(403, body);

        const cko = new Checkout();
        cko.config.pk = PK;

        try {
            await cko.tokens.request({
                type: 'card',
                number: '4242424242424242',
                expiry_month: 6,
                expiry_year: 2029,
                cvv: '100'
            });
        } catch (error) {
            expect(error).to.be.instanceOf(ActionNotAllowed);
            expect(error.body).to.deep.equal(body);
            return;
        }

        throw new Error('Expected ActionNotAllowed to be thrown');
    });

    it('should include body for 404 NotFoundError', async () => {
        const body = { error_type: 'not_found', message: 'resource_not_found' };

        nock('https://api.sandbox.checkout.com')
            .post('/tokens')
            .reply(404, body);

        const cko = new Checkout();
        cko.config.pk = PK;

        try {
            await cko.tokens.request({
                type: 'card',
                number: '4242424242424242',
                expiry_month: 6,
                expiry_year: 2029,
                cvv: '100'
            });
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError);
            expect(error.body).to.deep.equal(body);
            return;
        }

        throw new Error('Expected NotFoundError to be thrown');
    });
});
