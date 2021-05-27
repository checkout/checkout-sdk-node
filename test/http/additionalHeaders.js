import { Checkout } from '../../src/index';
import { expect } from 'chai';
import nock from 'nock';

const PK = 'pk_test_4296fd52-efba-4a38-b6ce-cf0d93639d8a';

describe('HTTP', () => {
    // Nice feature of `reqheaders` is that the value can be a function returning a boolean. 
    // Since we don't care about the actual value of the headers, returning true has the effect
    // of matching if the header simply exists.
    const mockHeadersMatcher = {
        'additional-header-a': () => true,
        'additional-Header-b': () => true,
    };

    const mockToken = {
        type: 'card',
        token: 'tok_pmjyslgaam4uzmvaiwqyhovvsy',
        expires_on: '2020-01-30T15:08:33Z',
        expiry_month: 6,
        expiry_year: 2029
    }

    it('should be able to pass additional headers', async() => {
        nock('https://api.sandbox.checkout.com', {
            reqheaders: mockHeadersMatcher
        })
            .post('/tokens')
            .reply(201, mockToken);

        const cko = new Checkout(null, {
            headers: {
                'additional-header-a': 'valueA',
                'additional-Header-b': 'valueB',
            }
        });
        cko.config.pk = PK;

        const token = await cko.tokens.request({
            type: 'card',
            number: '4242424242424242',
            expiry_month: 6,
            expiry_year: 2029,
            cvv: '100'
        });

        expect(token).to.deep.equal(mockToken);
    });

    it('should not match a request when additional headers are not provided', async() => {
        nock('https://api.sandbox.checkout.com', {
            reqheaders: mockHeadersMatcher
        })
            .post('/tokens')
            .reply(201, mockToken);

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
        } catch(error) {
            errorWasThrown = true;
        }

        expect(errorWasThrown).to.equal(true);
    });
});
