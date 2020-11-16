import { AuthenticationError } from '../../src/services/errors';
import { Checkout } from '../../src/index';
import { expect } from 'chai';
import nock from 'nock';

const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

describe('Giropay', () => {
    it('should get EPS banks', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/giropay/eps/banks')
            .reply(200, {
                _links: { self: { href: 'https://api.sandbox.checkout.com/giropay/eps/banks' } },
                banks: { BKAUATWWXXX: 'Bank Austria Creditanstalt AG' },
            });

        const cko = new Checkout(SK);

        const banks = await cko.giropay.getEpsBanks();
        expect(banks.banks['BKAUATWWXXX']).to.equal('Bank Austria Creditanstalt AG');
    });

    it('should throw Authentication error trying to get EPS banks', async () => {
        nock('https://api.sandbox.checkout.com').get('/giropay/eps/banks').reply(401);

        const cko = new Checkout(SK);

        try {
            const banks = await cko.giropay.getEpsBanks();
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });

    it('should get banks', async () => {
        nock('https://api.sandbox.checkout.com')
            .get('/giropay/banks')
            .reply(200, {
                _links: { self: { href: 'https://api.sandbox.checkout.com/giropay/eps/banks' } },
                banks: { GENODEF1PL1: 'Volksbank Vogtland' },
            });

        const cko = new Checkout(SK);

        const banks = await cko.giropay.getBanks();
        expect(banks.banks['GENODEF1PL1']).to.equal('Volksbank Vogtland');
    });

    it('should throw Authentication error trying to get banks', async () => {
        nock('https://api.sandbox.checkout.com').get('/giropay/banks').reply(401);

        const cko = new Checkout(SK);

        try {
            const banks = await cko.giropay.getBanks();
        } catch (err) {
            expect(err).to.be.instanceOf(AuthenticationError);
        }
    });
});
