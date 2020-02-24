import {
  BadGateway,
  TooManyRequestsError,
  ValidationError,
  ValueError,
  AuthenticationError,
  NotFoundError,
  ActionNotAllowed
} from "../../src/services/errors";
import { Checkout } from "../../src/index";
import { expect } from "chai";
import nock from "nock";

const SK = "sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808";

describe("Sources", () => {
  it("should create SEPA source", async () => {
    nock("https://api.sandbox.checkout.com")
      .post("/sources")
      .reply(201, {
        id: "src_327s3pwdcx3upjqzu4uk66ecim",
        type: "Sepa",
        response_code: "10000",
        response_data: { mandate_reference: "Z10001204720545" },
        customer: {
          id: "cus_w3kii25gnzmuphtb3ublwt52au",
          email: "sophie.bonneville@ckomail.com"
        },
        _links: {
          "sepa:mandate-cancel": {
            href:
              "https://nginxtest.ckotech.co/sepa-external/mandates/src_327s3pwdcx3upjqzu4uk66ecim/cancel"
          },
          "sepa:mandate-get": {
            href:
              "https://nginxtest.ckotech.co/sepa-external/mandates/src_327s3pwdcx3upjqzu4uk66ecim"
          }
        }
      });

    const cko = new Checkout(SK);

    const transaction = await cko.sources.add({
      type: "sepa",
      reference: "X-080957-N34",
      source_data: {
        first_name: "Sophie",
        last_name: "Bonneville",
        account_iban: "DE25100100101234567893",
        bic: "PBNKDEFFXXX",
        billing_descriptor: "Thanks for shopping",
        mandate_type: "recurring"
      },
      billing_address: {
        address_line1: "101 Avenue de Gaulle",
        city: "Paris",
        zip: "75013",
        country: "FR"
      },
      phone: {
        country_code: "+33",
        number: "6 78 91 01 11"
      },
      customer: {
        email: "sophie.bonneville@ckomail.com"
      }
    });

    expect(transaction.type).to.equal("Sepa");
  });

  it("should create ACH source", async () => {
    nock("https://api.sandbox.checkout.com")
      .post("/sources")
      .reply(201, {
        id: "src_txjdrahbkglexgili6al2x2lk4",
        type: "ACH",
        response_code: "10000",
        response_data: {},
        customer: { id: "cus_x7eabeo2dlquzk2bmltz4bsr4q" }
      });

    const cko = new Checkout(SK);

    const transaction = await cko.sources.add({
      type: "ach",
      billing_address: {
        address_line1: "Wayne Plaza 1",
        address_line2: null,
        city: "Gotham City",
        state: null,
        zip: "12345",
        country: "US"
      },
      source_data: {
        account_holder_name: "Bruce Wayne",
        account_type: "Checking",
        account_number: "0123456789",
        routing_number: "211370545",
        billing_descriptor: "ACH Demo",
        company_name: null
      }
    });

    expect(transaction.type).to.equal("ACH");
  });

  it("should dynamically determine ACH source", async () => {
    nock("https://api.sandbox.checkout.com")
      .post("/sources")
      .reply(201, {
        id: "src_txjdrahbkglexgili6al2x2lk4",
        type: "ACH",
        response_code: "10000",
        response_data: {},
        customer: { id: "cus_x7eabeo2dlquzk2bmltz4bsr4q" }
      });

    const cko = new Checkout(SK);

    const transaction = await cko.sources.add({
      billing_address: {
        address_line1: "Wayne Plaza 1",
        address_line2: null,
        city: "Gotham City",
        state: null,
        zip: "12345",
        country: "US"
      },
      source_data: {
        account_holder_name: "Bruce Wayne",
        account_type: "Checking",
        account_number: "0123456789",
        routing_number: "211370545",
        billing_descriptor: "ACH Demo",
        company_name: null
      }
    });

    expect(transaction.type).to.equal("ACH");
  });

  it("should throw AuthenticationError", async () => {
    nock("https://api.sandbox.checkout.com")
      .post("/sources")
      .reply(201, {
        id: "src_327s3pwdcx3upjqzu4uk66ecim",
        type: "Sepa",
        response_code: "10000",
        response_data: { mandate_reference: "Z10001204720545" },
        customer: {
          id: "cus_w3kii25gnzmuphtb3ublwt52au",
          email: "sophie.bonneville@ckomail.com"
        },
        _links: {
          "sepa:mandate-cancel": {
            href:
              "https://nginxtest.ckotech.co/sepa-external/mandates/src_327s3pwdcx3upjqzu4uk66ecim/cancel"
          },
          "sepa:mandate-get": {
            href:
              "https://nginxtest.ckotech.co/sepa-external/mandates/src_327s3pwdcx3upjqzu4uk66ecim"
          }
        }
      });

    const cko = new Checkout(SK);

    const transaction = await cko.sources.add({
      reference: "X-080957-N34",
      source_data: {
        first_name: "Sophie",
        last_name: "Bonneville",
        account_iban: "DE25100100101234567893",
        bic: "PBNKDEFFXXX",
        billing_descriptor: "Thanks for shopping",
        mandate_type: "recurring"
      },
      billing_address: {
        address_line1: "101 Avenue de Gaulle",
        city: "Paris",
        zip: "75013",
        country: "FR"
      },
      phone: {
        country_code: "+33",
        number: "6 78 91 01 11"
      },
      customer: {
        email: "sophie.bonneville@ckomail.com"
      }
    });

    expect(transaction.type).to.equal("Sepa");
  });

  it("should create SEPA source", async () => {
    nock("https://api.sandbox.checkout.com")
      .post("/sources")
      .reply(401);

    const cko = new Checkout("sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f801");

    try {
      const transaction = await cko.sources.add({
        type: "sepa",
        reference: "X-080957-N34",
        source_data: {
          first_name: "Sophie",
          last_name: "Bonneville",
          account_iban: "DE25100100101234567893",
          bic: "PBNKDEFFXXX",
          billing_descriptor: "Thanks for shopping",
          mandate_type: "recurring"
        },
        billing_address: {
          address_line1: "101 Avenue de Gaulle",
          city: "Paris",
          zip: "75013",
          country: "FR"
        },
        phone: {
          country_code: "+33",
          number: "6 78 91 01 11"
        },
        customer: {
          email: "sophie.bonneville@ckomail.com"
        }
      });
    } catch (err) {
      expect(err).to.be.instanceOf(AuthenticationError);
    }
  });

  it("should throw ValidationError", async () => {
    nock("https://api.sandbox.checkout.com")
      .post("/sources")
      .reply(422, {
        request_id: "32f5a283-2bd0-4a5b-b548-d52b755dbbdb",
        error_type: "request_invalid",
        error_codes: ["request_data_required"]
      });

    const cko = new Checkout(SK);

    try {
      const transaction = await cko.sources.add({
        type: "sepa",
        reference: "X-080957-N34"
      });
    } catch (err) {
      expect(err).to.be.instanceOf(ValidationError);
    }
  });
});
