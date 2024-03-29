import { expect } from "chai";
import nock from "nock";
import Checkout from '../../src/Checkout.js'
import { commonRequest, commonResponse } from "./payment-sessions-common.js";

afterEach(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

const cko = new Checkout(process.env.CHECKOUT_DEFAULT_SECRET_KEY);

describe('Integration::Payment-Sessions', () => {

  it('should request a payment session', async () => {
    const response = await cko.paymentSessions.request(commonRequest);

    expect(response.id).not.to.be.null;
    expect(response._links).not.to.be.null;
  });

});