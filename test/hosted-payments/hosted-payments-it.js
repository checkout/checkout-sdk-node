import { expect } from "chai";
import Checkout from '../../src/Checkout.js';

const cko = new Checkout(process.env.CHECKOUT_DEFAULT_SECRET_KEY, {
  pk: process.env.CHECKOUT_PREVIOUS_PUBLIC_KEY,
  environment: 'sandbox',
});
const processingChannelId = process.env.CHECKOUT_PROCESSING_CHANNEL_ID;

describe('Integration::Hosted Payments', () => {

  describe('Should create and get a hosted payment', () => {

    const request = {
      amount: 1000,
      currency: "GBP",
      payment_type: "Regular",
      payment_ip: "192.168.0.1",
      billing_descriptor: {
        name: "Company Name",
        city: "City",
        reference: "Billing Descriptor Reference"
      },
      reference: "ORD-123A",
      description: "Payment for Gold Necklace",
      display_name: "The Jewelry Shop",
      processing_channel_id: processingChannelId,
      amount_allocations: [
        {
          id: "ent_w4jelhppmfiufdnatam37wrfc4",
          amount: 1000,
          reference: "ORD-5023-4E89",
          commission: {
            amount: 1000,
            percentage: 1.125
          }
        }
      ],
      customer: {
        email: "brucewayne@email.com",
        name: "Bruce Wayne"
      },
      shipping: {
        address: {
          address_line1: "123 High St.",
          address_line2: "Flat 456",
          city: "London",
          state: "str",
          zip: "SW1A 1AA",
          country: "GB"
        },
        phone: {
          country_code: "+1",
          number: "415 555 2671"
        }
      },
      billing: {
        address: {
          address_line1: "123 High St.",
          address_line2: "Flat 456",
          city: "London",
          state: "str",
          zip: "SW1A 1AA",
          country: "GB"
        },
        phone: {
          country_code: "+1",
          number: "415 555 2671"
        }
      },
      recipient: {
        dob: "1985-05-15",
        account_number: "5555554444",
        address: {
          address_line1: "123 High St.",
          address_line2: "Flat 456",
          city: "London",
          state: "str",
          zip: "SW1A 1AA",
          country: "GB"
        },
        zip: "SW1A",
        first_name: "John",
        last_name: "Jones"
      },
      processing: {
        aft: true
      },
      allow_payment_methods: ["card", "applepay", "googlepay"],
      disabled_payment_methods: ["eps", "ideal", "knet"],
      products: [
        {
          reference: "string",
          name: "Gold Necklace",
          quantity: 1,
          price: 1000
        }
      ],
      risk: {
        enabled: false
      },
      customer_retry: {
        max_attempts: 2
      },
      sender: {
        type: "instrument",
        reference: "8285282045818"
      },
      success_url: "https://example.com/payments/success",
      cancel_url: "https://example.com/payments/cancel",
      failure_url: "https://example.com/payments/failure",
      locale: "ar",
      "3ds": {
        enabled: false,
        attempt_n3d: false,
        challenge_indicator: "no_preference",
        allow_upgrade: true,
        exemption: "low_value"
      },
      capture: true,
      capture_on: new Date().toISOString(),
      instruction: {
        purpose: "donations"
      },
      payment_method_configuration: {
        applepay: {
          account_holder: {
            first_name: "John",
            last_name: "Jones",
            type: "individual"
          }
        },
        card: {
          account_holder: {
            first_name: "John",
            last_name: "Jones",
            type: "individual"
          }
        },
        googlepay: {
          account_holder: {
            first_name: "John",
            last_name: "Jones",
            type: "individual"
          }
        }
      }
    };

    it('should request a hosted payment', async () => {
      const createResponse = await cko.hostedPayments.create(request);

      expect(createResponse).to.not.be.null;
      expect(createResponse.id).to.not.be.empty;
      expect(createResponse.reference).to.not.be.empty;
      expect(createResponse._links).to.not.be.null;
      expect(createResponse._links).to.have.property("self");
      expect(createResponse._links).to.have.property("redirect");
    });

    it('should get a hosted payment', async () => {
      const createResponse = await cko.hostedPayments.create(request);
      const getResponse = await cko.hostedPayments.get(createResponse.id);

      expect(getResponse).to.not.be.null;
      expect(getResponse.id).to.is.not.empty;
      expect(getResponse.reference).to.not.be.empty;
      expect(getResponse.status).to.equals("Payment Pending");
      expect(getResponse.amount).to.not.be.null;
      expect(getResponse.billing).to.not.be.null;
      expect(getResponse.currency).to.equals("GBP");
      expect(getResponse.customer).to.be.not.null;
      expect(getResponse.description).to.not.be.empty;
      expect(getResponse.failure_url).to.not.be.null;
      expect(getResponse.success_url).to.not.be.null;
      expect(getResponse.cancel_url).to.not.be.empty;
      expect(getResponse._links).to.not.be.null;
      expect(Object.keys(getResponse._links)).to.have.lengthOf(2);
      expect(getResponse.products).to.be.an("array").with.lengthOf(1);
    });

  });
});