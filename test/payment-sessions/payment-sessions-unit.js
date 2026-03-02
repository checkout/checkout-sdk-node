import nock from "nock";
import { expect } from "chai";
import Checkout from "../../src/Checkout.js";
import { ValidationError, NotFoundError } from "../../src/services/errors.js";
import { commonRequest, commonResponse, commonSubmitRequest, commonSubmitResponseAccepted, commonSubmitResponseCreated } from "./payment-sessions-common.js";


describe('Unit::Payment-Sessions', () => {
  const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';

  it('should request a payment session', async () => {
    nock('https://123456789.api.sandbox.checkout.com')
      .post('/payment-sessions')
      .reply(201, commonResponse);

    const cko = new Checkout(SK, { subdomain: '123456789' });

    const paymentContextResponse = await cko.paymentSessions.request(commonRequest);

    expect(paymentContextResponse.id).to.equal('ps_2aOig7knIeGNYPlyuxUEPQyOmxN');
    expect(paymentContextResponse.amount).to.equal(1000);
    expect(paymentContextResponse.locale).to.equal('en-GB');
    expect(paymentContextResponse.currency).to.equal('GBP');
    expect(paymentContextResponse.payment_methods[0].type).to.equal('card');
    expect(paymentContextResponse.risk.enabled).to.equal(true);
    expect(paymentContextResponse._links.self.href).to.equal('https://123456789.api.sandbox.checkout.com/payment-sessions/ps_2aOig7knIeGNYPlyuxUEPQyOmxN');
  });

  it('should submit and create a payment session', async () => {
    nock('https://123456789.api.sandbox.checkout.com')
      .post('/payment-sessions/pay_mbabizu24mvu3mela5njyhpit4/submit')
      .reply(201, commonSubmitResponseCreated);

    const cko = new Checkout(SK, { subdomain: '123456789' });

    const paymentContextResponse = await cko.paymentSessions.submit('pay_mbabizu24mvu3mela5njyhpit4', commonSubmitRequest);

    expect(paymentContextResponse.id).to.equal('pay_mbabizu24mvu3mela5njyhpit4');
    expect(paymentContextResponse.status).to.equal('Approved');
    expect(paymentContextResponse.type).to.equal("alipay_cn");
  });

  it('should submit and accept payment session', async () => {
    nock('https://123456789.api.sandbox.checkout.com')
      .post('/payment-sessions/pay_mbabizu24mvu3mela5njyhpit4/submit')
      .reply(202, commonSubmitResponseAccepted);

    const cko = new Checkout(SK, { subdomain: '123456789' });

    const paymentContextResponse = await cko.paymentSessions.submit('pay_mbabizu24mvu3mela5njyhpit4', commonSubmitRequest);

    expect(paymentContextResponse.id).to.equal('pay_mbabizu24mvu3mela5njyhpit4');
    expect(paymentContextResponse.status).to.equal('Action Required');
  });

  it('should throw ValidationError when requesting payment session with invalid data', async () => {
    nock('https://123456789.api.sandbox.checkout.com')
      .post('/payment-sessions')
      .reply(422, {
        request_id: 'req_123',
        error_type: 'request_invalid',
        error_codes: ['amount_invalid']
      });

    const cko = new Checkout(SK, { subdomain: '123456789' });

    try {
      await cko.paymentSessions.request({ ...commonRequest, amount: -100 });
      expect.fail('Should have thrown ValidationError');
    } catch (err) {
      expect(err).to.be.instanceOf(ValidationError);
    }
  });

  it('should throw NotFoundError when submitting to non-existent session', async () => {
    nock('https://123456789.api.sandbox.checkout.com')
      .post('/payment-sessions/pay_nonexistent/submit')
      .reply(404, {
        request_id: 'req_123',
        error_type: 'resource_not_found'
      });

    const cko = new Checkout(SK, { subdomain: '123456789' });

    try {
      await cko.paymentSessions.submit('pay_nonexistent', commonSubmitRequest);
      expect.fail('Should have thrown NotFoundError');
    } catch (err) {
      expect(err).to.be.instanceOf(NotFoundError);
    }
  });

  it('should complete a payment session (create and submit)', async () => {
    nock('https://123456789.api.sandbox.checkout.com')
      .post('/payment-sessions/complete')
      .reply(201, {
        id: 'pay_mbabizu24mvu3mela5njyhpit4',
        status: 'Approved',
        type: 'card',
        amount: 1000,
        currency: 'GBP',
        approved: true,
      });

    const cko = new Checkout(SK, { subdomain: '123456789' });

    const paymentResponse = await cko.paymentSessions.complete({
      amount: 1000,
      currency: 'GBP',
      payment_method: {
        type: 'card',
        number: '4242424242424242',
        expiry_month: 12,
        expiry_year: 2025,
        cvv: '100',
      },
    });

    expect(paymentResponse.id).to.equal('pay_mbabizu24mvu3mela5njyhpit4');
    expect(paymentResponse.status).to.equal('Approved');
  });

  it('should complete and accept a payment session (202)', async () => {
    nock('https://123456789.api.sandbox.checkout.com')
      .post('/payment-sessions/complete')
      .reply(202, {
        id: 'pay_mbabizu24mvu3mela5njyhpit4',
        status: 'Pending',
        _links: {
          redirect: {
            href: 'https://example.com/redirect',
          },
        },
      });

    const cko = new Checkout(SK, { subdomain: '123456789' });

    const paymentResponse = await cko.paymentSessions.complete({
      amount: 1000,
      currency: 'GBP',
      payment_method: {
        type: 'alipay_cn',
      },
    });

    expect(paymentResponse.id).to.equal('pay_mbabizu24mvu3mela5njyhpit4');
    expect(paymentResponse.status).to.equal('Pending');
  });

  it('should throw ValidationError when completing payment session with invalid data', async () => {
    nock('https://123456789.api.sandbox.checkout.com')
      .post('/payment-sessions/complete')
      .reply(422, {
        request_id: 'req_123',
        error_type: 'request_invalid',
        error_codes: ['amount_invalid'],
      });

    const cko = new Checkout(SK, { subdomain: '123456789' });

    try {
      await cko.paymentSessions.complete({
        amount: -100,
        currency: 'GBP',
      });
      expect.fail('Should have thrown ValidationError');
    } catch (err) {
      expect(err).to.be.instanceOf(ValidationError);
    }
  });

});