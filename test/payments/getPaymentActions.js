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

describe("Get payment actions", () => {
  it("should get payment acrtions", async () => {
    nock("https://api.sandbox.checkout.com")
      .get("/payments/pay_juevt3h5mcjulir2t5g3wfug6u/actions")
      .reply(200, [
        {
          id: "act_t6ksnbs3tguu7iblmk22jjimca",
          type: "Capture",
          processed_on: "2020-01-29T11:53:40Z",
          amount: 100,
          approved: true,
          response_code: "10000",
          response_summary: "Approved",
          processing: {
            acquirer_transaction_id: "7290001341",
            acquirer_reference_number: "175286612147"
          }
        },
        {
          id: "act_juevt3h5mcjulir2t5g3wfug6u",
          type: "Authorization",
          processed_on: "2020-01-29T11:53:40Z",
          amount: 100,
          approved: true,
          auth_code: "745837",
          response_code: "10000",
          response_summary: "Approved",
          processing: {
            acquirer_transaction_id: "9691257557",
            retrieval_reference_number: "564911204253"
          }
        }
      ]);
    const cko = new Checkout(SK);
    const transaction = await cko.payments.getActions(
      "pay_juevt3h5mcjulir2t5g3wfug6u"
    );
    /* eslint-disable no-unused-expressions */
    expect(transaction.length).to.equal(2);
    expect(transaction[0].type).to.equal("Capture");
  });

  it("should throw AuthenticationError", async () => {
    nock("https://api.sandbox.checkout.com")
      .get("/payments/pay_juevt3h5mcjulir2t5g3wfug6u/actions")
      .reply(401);

    try {
      const cko = new Checkout("sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f801");
      const transaction = await cko.payments.getActions(
        "pay_juevt3h5mcjulir2t5g3wfug6u"
      );
    } catch (err) {
      expect(err.name).to.equal("AuthenticationError");
    }
  });

  it("should throw payment not found error", async () => {
    nock("https://api.sandbox.checkout.com")
      .get("/payments/pay_juevt3h5mcjulir2t5g3wfug6u/actions")
      .reply(404);

    try {
      const cko = new Checkout(SK);
      const transaction = await cko.payments.getActions(
        "pay_juevt3h5mcjulir2t5g3wfug6u"
      );
    } catch (err) {
      expect(err).to.be.instanceOf(NotFoundError);
    }
  });
});
