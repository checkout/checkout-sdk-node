import nock from "nock";
import { expect } from "chai";
import Checkout from "../../src/Checkout.js";
import { commonRequest, commonResponse } from "./payment-sessions-common.js";


describe('Unit::Payment-Sessions', () => {
  const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

  it('should request a payment session', async () => {
    nock('https://api.sandbox.checkout.com')
      .post('/payment-sessions')
      .reply(201, commonResponse);

    const cko = new Checkout(SK);

    const paymentContextResponse = await cko.paymentSessions.request(commonRequest);

    expect(paymentContextResponse.id).to.equal('ps_2aOig7knIeGNYPlyuxUEPQyOmxN');
    expect(paymentContextResponse.amount).to.equal(1000);
    expect(paymentContextResponse.locale).to.equal('en-GB');
    expect(paymentContextResponse.currency).to.equal('GBP');
    expect(paymentContextResponse.payment_methods[0].type).to.equal('card');
    expect(paymentContextResponse.risk.enabled).to.equal(true);
    expect(paymentContextResponse._links.self.href).to.equal('https://api.sandbox.checkout.com/payment-sessions/ps_2aOig7knIeGNYPlyuxUEPQyOmxN');
  });

});