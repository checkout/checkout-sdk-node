import { expect } from "chai";
import nock from "nock";
import Checkout from '../../src/Checkout.js'
import { NotFoundError } from "../../src/services/errors.js";

afterEach(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

const cko = new Checkout(process.env.CHECKOUT_DEFAULT_SECRET_KEY);
const processingChannelId = process.env.CHECKOUT_PROCESSING_CHANNEL_ID;

describe('Integration::Payment-Contexts', () => {

  const request = {
    source: {
      type: "paypal"
    },
    amount: 100,
    currency: "USD",
    capture: true,
    shipping: {
      first_name: "John",
      last_name: "Smith",
      address: {
        address_line1: "Checkout.com",
        address_line2: "90 Tottenham Court Road",
        city: "London",
        state: "str",
        zip: "W1T 4TJ",
        country: "GB"
      },
      phone: {
        country_code: "+1",
        number: "415 555 2671"
      },
      from_address_zip: "10014",
      type: "pickup_in_person"
    },
    processing: {
      order_id: "123456789",
      tax_amount: 3000,
      discount_amount: 0,
      duty_amount: 0,
      shipping_amount: 300,
      shipping_tax_amount: 100,
      aft: true,
      preferred_scheme: "mastercard",
      merchant_initiated_reason: "Delayed_charge",
      campaign_id: 0,
      product_type: "QR Code",
      open_id: "oUpF8uMuAJO_M2pxb1Q9zNjWeS6o",
      original_order_amount: 10,
      receipt_id: 10,
      terminal_type: "WAP",
      os_type: "ANDROID",
      invoice_id: "string",
      brand_name: "Super Brand",
      locale: "en-US",
      shipping_preference: "SET_PROVIDED_ADDRESS",
      user_action: "PAY_NOW",
      set_transaction_context: {
        key: "string",
        value: "string"
      },
      purchase_country: "GB",
      custom_payment_method_ids: [
        "string"
      ],
      merchant_callback_url: "string",
      line_of_business: "Flights"
    },
    processing_channel_id: processingChannelId,
    reference: "ORD-5023-4E89",
    description: "Set of 3 masks",
    success_url: "https://example.com/payments/success",
    failure_url: "https://example.com/payments/fail",
    items: [
      {
        name: "Kevlar batterang",
        quantity: 2,
        unit_price: 50,
        reference: "858818ac",
        commodity_code: "DEF123",
        unit_of_measure: "metres",
        total_amount: 29000,
        tax_amount: 1000,
        discount_amount: 1000,
        wxpay_goods_id: 1001,
        url: "https://example.com/",
        image_url: "https://example.com/"
      }
    ]
  }

  it('should request a payment context', async () => {
    const response = await cko.paymentContexts.request(request);

    expect(response.id).not.to.be.null;
    expect(response.partner_metadata.order_id).not.to.be.null;
  });

  it('should get a payment context', async () => {
    const responseRquest = await cko.paymentContexts.request(request);
    const response = await cko.paymentContexts.get(responseRquest.id);

    expect(response.payment_request.source.type).to.equal('paypal');
    expect(response.payment_request.amount).to.equal(100);
    expect(response.payment_request.currency).to.equal("USD");
    expect(response.payment_request.currency.shipping).to.not.be.null
    expect(response.payment_request.currency.processing).to.not.be.null
    expect(response.payment_request.currency.items).to.not.be.null
    expect(response.payment_request.success_url).to.equal('https://example.com/payments/success');
    expect(response.payment_request.failure_url).to.equal('https://example.com/payments/fail');
  });

  it('should throw NotFoundError when getting an unexistant payment context', async () => {
    try {
        await cko.paymentContexts.get('not_found');
    } catch (err) {
        expect(err).to.be.instanceOf(NotFoundError);
    }
});
});