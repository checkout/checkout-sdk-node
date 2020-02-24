import {
  BadGateway,
  TooManyRequestsError,
  ValidationError,
  ValueError,
  AuthenticationError,
  NotFoundError
} from "../../src/services/errors";
import { Checkout } from "../../src/index";
import { expect } from "chai";
import nock from "nock";

const SK = "sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808";

describe("Get payment details", () => {
  it("should get payment details with payment id", async () => {
    nock("https://api.sandbox.checkout.com")
      .get("/payments/pay_je5hbbb4u3oe7k4u3lbwlu3zkq")
      .reply(200, {
        id: "pay_je5hbbb4u3oe7k4u3lbwlu3zkq",
        requested_on: "2020-01-29T11:20:06Z",
        source: {
          id: "src_yiorsxzfwy4uzkl5excqum4r6m",
          type: "card",
          expiry_month: 10,
          expiry_year: 2029,
          scheme: "Visa",
          last4: "4242",
          fingerprint:
            "511233E01627B17FB2823C37A8AEFBEB71B673671756B30B646111EAC2A70E86",
          bin: "424242",
          card_type: "Credit",
          card_category: "Consumer",
          issuer: "JPMORGAN CHASE BANK NA",
          issuer_country: "US",
          product_id: "A",
          product_type: "Visa Traditional",
          avs_check: "S",
          cvv_check: "Y",
          payouts: true,
          fast_funds: "d"
        },
        amount: 0,
        currency: "GBP",
        payment_type: "Regular",
        status: "Card Verified",
        approved: true,
        risk: {
          flagged: false
        },
        customer: {
          id: "cus_4tq74vh6u7zuvnnvkzimznkauu"
        },
        eci: "05",
        scheme_id: "650050831378549",
        _links: {
          self: {
            href:
              "https://api.sandbox.checkout.com/payments/pay_je5hbbb4u3oe7k4u3lbwlu3zkq"
          },
          actions: {
            href:
              "https://api.sandbox.checkout.com/payments/pay_je5hbbb4u3oe7k4u3lbwlu3zkq/actions"
          }
        }
      });

    const cko = new Checkout(SK);

    const transaction = await cko.payments.get(
      "pay_je5hbbb4u3oe7k4u3lbwlu3zkq"
    );

    /* eslint-disable no-unused-expressions */
    expect(transaction.approved).to.be.true;
    expect(transaction.id).to.equal("pay_je5hbbb4u3oe7k4u3lbwlu3zkq");
  });

  it("should throw authentication error", async () => {
    nock("https://api.sandbox.checkout.com")
      .get("/payments/pay_je5hbbb4u3oe7k4u3lbwlu3zkq")
      .reply(401, {});

    try {
      const cko = new Checkout("sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f809");
      const transaction = await cko.payments.get(
        "pay_je5hbbb4u3oe7k4u3lbwlu3zkq"
      );
    } catch (err) {
      expect(err).to.be.instanceOf(AuthenticationError);
    }
  });

  it("should throw payment not found error", async () => {
    nock("https://api.sandbox.checkout.com")
      .get("/payments/pay_je5hbbb4u3oe7k4u3lbwlu3zkv")
      .reply(404);

    try {
      const cko = new Checkout(SK);
      const transaction = await cko.payments.get(
        "pay_je5hbbb4u3oe7k4u3lbwlu3zkv"
      );
    } catch (err) {
      expect(err).to.be.instanceOf(NotFoundError);
    }
  });
});
