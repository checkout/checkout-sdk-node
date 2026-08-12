import { expect } from "chai";
import nock from "nock";
import Checkout from '../../src/Checkout.js'
import { commonRequest, commonSubmitRequest } from "./payment-sessions-common.js";

afterEach(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

const cko = new Checkout(process.env.CHECKOUT_DEFAULT_SECRET_KEY, {
    // The sandbox OAuth clients are not provisioned for the merchant-specific
    // subdomain, so the token request would come back invalid_client. Opting out
    // explicitly until they are.
    useLegacyDomain: true,
});

describe('Integration::Payment-Sessions', () => {

  it('should request a payment session', async () => {
    const response = await cko.paymentSessions.request(commonRequest);

    expect(response.id).not.to.be.null;
    expect(response._links).not.to.be.null;
  });

  it.skip('should submit a payment session', async () => {
    const response1 = await cko.paymentSessions.request(commonRequest);
    const response2 = await cko.paymentSessions.submit(response1.id, commonSubmitRequest);

    expect(response2.id).not.to.be.null;
  });

});