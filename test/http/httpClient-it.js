import { expect } from "chai";
import nock from "nock";
import Checkout from '../../src/Checkout.js'
import { ApiTimeout } from "../../src/services/errors.js";

afterEach(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

describe('Integration::HttpClient', () => {
  describe('Axios', () => {
    describe('Token', () => {
      it('should get a token response', async () => {
        const checkout = new Checkout(
          process.env.CHECKOUT_DEFAULT_SECRET_KEY,
          {
            pk: process.env.CHECKOUT_DEFAULT_PUBLIC_KEY,
            timeout: 3000,
            httpClient: 'axios'
          }
        );
        const token = await checkout.tokens.request(
          {
            type: 'card',
            number: '4543474002249996',
            expiry_month: 6,
            expiry_year: 2025,
            cvv: '956',
          }
        );

        expect(token.type).to.equal('card');
        expect(token.expiry_month).to.equal(6);
        expect(token.expiry_year).to.equal(2025);
        expect(token.scheme).to.equal('VISA');
        expect(token.last4).to.equal('9996');
        expect(token.bin).to.equal('454347');
        expect(token.card_type).to.equal('CREDIT');
        expect(token.card_category).to.equal('CONSUMER');
      });

      it('should get a timeout error response', async () => {
        const checkout = new Checkout(
          process.env.CHECKOUT_DEFAULT_SECRET_KEY,
          {
            pk: process.env.CHECKOUT_DEFAULT_PUBLIC_KEY,
            timeout: 200,
            httpClient: 'axios'
          }
        );
        try {
          await checkout.tokens.request(
            {
              type: 'card',
              number: '4543474002249996',
              expiry_month: 6,
              expiry_year: 2025,
              cvv: '956',
            }
          );
        } catch (err) {
          expect(err).to.be.instanceOf(ApiTimeout);
        }
      });
    });
  });

  describe('Fetch', () => {
    describe('Token', () => {
      it('should get a token response', async () => {
        const checkout = new Checkout(
          process.env.CHECKOUT_DEFAULT_SECRET_KEY,
          {
            pk: process.env.CHECKOUT_DEFAULT_PUBLIC_KEY,
            timeout: 3000,
          }
        );
        const token = await checkout.tokens.request(
          {
            type: 'card',
            number: '4543474002249996',
            expiry_month: 6,
            expiry_year: 2025,
            cvv: '956',
          }
        );

        expect(token.type).to.equal('card');
        expect(token.expiry_month).to.equal(6);
        expect(token.expiry_year).to.equal(2025);
        expect(token.scheme).to.equal('VISA');
        expect(token.last4).to.equal('9996');
        expect(token.bin).to.equal('454347');
        expect(token.card_type).to.equal('CREDIT');
        expect(token.card_category).to.equal('CONSUMER');
      });

      it('should get a timeout error response', async () => {
        const checkout = new Checkout(
          process.env.CHECKOUT_DEFAULT_SECRET_KEY,
          {
            pk: process.env.CHECKOUT_DEFAULT_PUBLIC_KEY,
            timeout: 200,
          }
        );
        try {
          await checkout.tokens.request(
            {
              type: 'card',
              number: '4543474002249996',
              expiry_month: 6,
              expiry_year: 2025,
              cvv: '956',
            }
          );
        } catch (err) {
          expect(err).to.be.instanceOf(ApiTimeout);
        }
      });
    });
  });
});