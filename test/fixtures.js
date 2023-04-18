import {cleanAll, enableNetConnect} from "nock";
import Checkout from "../src";

afterEach(() => {
    cleanAll();
    enableNetConnect();
});

const cko_issuing = new Checkout(process.env.CHECKOUT_DEFAULT_OAUTH_ISSUING_CLIENT_SECRET, {
    client: process.env.CHECKOUT_DEFAULT_OAUTH_ISSUING_CLIENT_ID,
    scope: ['issuing:card-mgmt issuing:client issuing:controls-read issuing:controls-write vault'],
    environment: 'sandbox',
});

module.exports = {
    afterEach,
    cko_issuing
};