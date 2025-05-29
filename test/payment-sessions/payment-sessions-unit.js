import nock from "nock";
import { expect } from "chai";
import Checkout from "../../src/Checkout.js";
import { commonRequest, commonResponse, commonSubmitRequest, commonSubmitResponseAccepted, commonSubmitResponseCreated } from "./payment-sessions-common.js";


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

  it('should submit and create a payment session', async () => {
    nock('https://api.sandbox.checkout.com')
      .post('/payment-sessions/pay_mbabizu24mvu3mela5njyhpit4/submit')
      .reply(201, commonSubmitResponseCreated);

    const cko = new Checkout(SK);

    const paymentContextResponse = await cko.paymentSessions.submit('pay_mbabizu24mvu3mela5njyhpit4', commonSubmitRequest);

    expect(paymentContextResponse.id).to.equal('pay_mbabizu24mvu3mela5njyhpit4');
    expect(paymentContextResponse.status).to.equal('Approved');
    expect(paymentContextResponse.type).to.equal("alipay_cn");
  });

  it('should submit and accept payment session', async () => {
    nock('https://api.sandbox.checkout.com')
      .post('/payment-sessions/pay_mbabizu24mvu3mela5njyhpit4/submit')
      .reply(202, commonSubmitResponseAccepted);

    const cko = new Checkout(SK);

    const paymentContextResponse = await cko.paymentSessions.submit('pay_mbabizu24mvu3mela5njyhpit4', commonSubmitRequest);

    expect(paymentContextResponse.id).to.equal('pay_mbabizu24mvu3mela5njyhpit4');
    expect(paymentContextResponse.status).to.equal('Action Required');
  });

});