import { expect } from "chai";
import nock from "nock";
import Checkout from '../../src/Checkout.js'
import { NotFoundError, ValidationError } from "../../src/services/errors.js";

afterEach(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

const cko = new Checkout(process.env.CHECKOUT_DEFAULT_SECRET_KEY);
const processingChannelId = process.env.CHECKOUT_PROCESSING_CHANNEL_ID;

describe('Integration::Payment-Contexts', () => {
  describe('Paypal request', () => {
    const request = {
      source: {
        type: "paypal"
      },
      amount: 2000,
      currency: "EUR",
      paymentType: "Regular",
      capture: true,
      processing_channel_id: processingChannelId,
      success_url: "https://example.com/payments/success",
      failure_url: "https://example.com/payments/fail",
      items: [
        {
          name: "mask",
          quantity: 1,
          unit_price: 2000,
        }
      ]
    }

    it('should request a payment context', async () => {
      const response = await cko.paymentContexts.request(request);

      expect(response.id).not.to.be.null;
      expect(response.partner_metadata.order_id).not.to.be.null;
    });

    it('should get a payment context', async () => {
      const responseRequest = await cko.paymentContexts.request(request);
      const response = await cko.paymentContexts.get(responseRequest.id);

      expect(response.payment_request.source.type).to.equal('paypal');
      expect(response.payment_request.amount).to.equal(2000);
      expect(response.payment_request.currency).to.equal("EUR");
      expect(response.payment_request.currency.items).to.not.be.null;
      expect(response.payment_request.success_url).to.equal('https://example.com/payments/success');
      expect(response.payment_request.failure_url).to.equal('https://example.com/payments/fail');
    });

    it('should throw NotFoundError when getting an unexistant payment context', async () => {
      try {
        await cko.paymentContexts.get('not_found');
      } catch (err) {
        expect(err).to.be.instanceOf(NotFoundError);
      }
    });
  });

  describe('Klarna request', () => {
    const request = {
      source: {
        type: "klarna",
        account_holder: {
          billing_address: {
              country: 'DE',
          },
        },
      },
      amount: 1000,
      currency: "EUR",
      paymentType: "Regular",
      processing_channel_id: processingChannelId,
      items: [
        {
          name: "mask",
          quantity: 1,
          unit_price: 1000,
          total_amount: 1000,
          reference: "BA67A"
        }
      ],
      processing: {
        locale: "en-GB"
      }
    }

    it('should request a payment context and get apm service unavailable', async () => {
      try {
        await cko.paymentContexts.request(request);
      } catch (error) {
        expect(error).to.be.instanceOf(ValidationError);
        expect(error.http_code).to.equal(422);
        expect(error.body.error_codes).to.contain("apm_service_unavailable");
      }

    });

    it.skip('should request a payment context', async () => {
      const response = await cko.paymentContexts.request(request);

      expect(response.id).not.to.be.null;
      expect(response.partner_metadata.order_id).not.to.be.null;
    });

    it.skip('should get a payment context', async () => {
      const responseRequest = await cko.paymentContexts.request(request);
      const response = await cko.paymentContexts.get(responseRequest.id);

      expect(response.payment_request.source.type).to.equal('klarna');
      expect(response.payment_request.source.account_holder).to.not.be.null;
      expect(response.payment_request.amount).to.equal(2000);
      expect(response.payment_request.currency).to.equal("EUR");
      expect(response.payment_request.currency.items).to.not.be.null;
      expect(response.payment_request.success_url).to.equal('https://example.com/payments/success');
      expect(response.payment_request.failure_url).to.equal('https://example.com/payments/fail');
    });
  });
});