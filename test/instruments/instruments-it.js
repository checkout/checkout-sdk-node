import { expect } from "chai";
import nock from "nock";
import Checkout from '../../src/Checkout.js'
import { ValidationError } from "../../src/services/errors.js";

afterEach(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

const cko = new Checkout(process.env.CHECKOUT_DEFAULT_SECRET_KEY, {
  pk: process.env.CHECKOUT_PREVIOUS_PUBLIC_KEY,
  environment: 'sandbox',
});

const sepaRequest = {
  "type": "sepa",
  "instrument_data": {
    "account_number": "FR2810096000509685512959O86",
    "country": "FR",
    "currency": "EUR",
    "payment_type": "recurring",
    "mandate_id": "1234567890",
    "date_of_signature": "2020-01-01"
  },
  "account_holder": {
    "first_name": "John",
    "last_name": "Smith",
    "billing_address": {
      "address_line1": "Cloverfield St.",
      "address_line2": "23A",
      "city": "London",
      "zip": "SW1A 1AA",
      "country": "GB"
    }
  }
}

describe('Instruments::Create', () => {
  describe('Sepa', () => {

    it('Should create a Sepa Instrument', async () => {
      const response = await cko.instruments.create(sepaRequest);

      expect(response).to.not.be.null;
      expect(response.id).to.not.be.null;
      expect(response.fingerprint).to.not.be.null;
    });

    it('Should return a ValidationError with invalid Sepa Instrument Request', async () => {
      try {
        await cko.instruments.create({});
      } catch (error) {
        expect(error).to.be.instanceOf(ValidationError);
      }
    });
  });
});