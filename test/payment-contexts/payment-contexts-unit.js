import nock from "nock";
import { expect } from "chai";
import Checkout from "../../src/Checkout.js";
import {
  AuthenticationError,
  BadGateway,
  NotFoundError,
  TooManyRequestsError,
  ValidationError
} from "../../src/services/errors.js";


describe('Unit::Payment-Contexts', () => {
  const SK = 'sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808';
  const commonRequest = {
    "source": {
      "type": "paypal"
    },
    "amount": 6540,
    "currency": "USD",
    "payment_type": "Recurring",
    "capture": true,
    "shipping": {
      "first_name": "John",
      "last_name": "Smith",
      "email": "john.smith@example.com",
      "address": {
        "address_line1": "123 High St.",
        "address_line2": "Flat 456",
        "city": "London",
        "state": "str",
        "zip": "SW1A 1AA",
        "country": "GB"
      },
      "phone": {
        "country_code": "+1",
        "number": "415 555 2671"
      },
      "from_address_zip": "123456",
      "timeframe": "SameDay",
      "method": "BillingAddress",
      "delay": 5
    },
    "processing": {
      "plan": {
        "type": "MERCHANT_INITIATED_BILLING",
        "skip_shipping_address": true,
        "immutable_shipping_address": true
      },
      "shipping_amount": 300,
      "invoice_id": "string",
      "brand_name": "Acme Corporation",
      "locale": "en-US",
      "shipping_preference": "set_provided_address",
      "user_action": "pay_now",
      "partner_customer_risk_data": {
        "key": "string",
        "value": "string"
      },
      "airline_data": [
        {
          "ticket": {
            "number": "045-21351455613",
            "issue_date": "2023-05-20",
            "issuing_carrier_code": "AI",
            "travel_package_indicator": "B",
            "travel_agency_name": "World Tours",
            "travel_agency_code": "01"
          },
          "passenger": [
            {
              "first_name": "John",
              "last_name": "White",
              "date_of_birth": "1990-05-26",
              "address": {
                "country": "US"
              }
            }
          ],
          "flight_leg_details": [
            {
              "flight_number": "101",
              "carrier_code": "BA",
              "class_of_travelling": "J",
              "departure_airport": "LHR",
              "departure_date": "2023-06-19",
              "departure_time": "15:30",
              "arrival_airport": "LAX",
              "stop_over_code": "x",
              "fare_basis_code": "SPRSVR"
            }
          ]
        }
      ]
    },
    "processing_channel_id": "pc_q4dbxom5jbgudnjzjpz7j2z6uq",
    "reference": "ORD-5023-4E89",
    "description": "Set of 3 masks",
    "success_url": "https://example.com/payments/success",
    "failure_url": "https://example.com/payments/fail",
    "items": [
      {
        "name": "Test item",
        "quantity": 2,
        "unit_price": 50,
        "reference": "858818ac",
        "total_amount": 29000,
        "tax_amount": 1000,
        "discount_amount": 1000,
        "url": "string",
        "image_url": "string"
      }
    ]
  };
  const commonResponse = {
    "payment_request": {
      "source": {
        "type": "paypal"
      },
      "amount": 6540,
      "currency": "USD",
      "payment_type": "Recurring",
      "capture": true,
      "customer": {
        "email": "johnsmith@example.com",
        "name": "John Smith"
      },
      "shipping": {
        "first_name": "John",
        "last_name": "Smith",
        "email": "john.smith@example.com",
        "address": {
          "address_line1": "123 High St.",
          "address_line2": "Flat 456",
          "city": "London",
          "state": "str",
          "zip": "SW1A 1AA",
          "country": "GB"
        },
        "phone": {
          "country_code": "+1",
          "number": "415 555 2671"
        },
        "from_address_zip": "123456",
        "timeframe": "SameDay",
        "method": "BillingAddress",
        "delay": 5
      },
      "processing": {
        "plan": {
          "type": "MERCHANT_INITIATED_BILLING",
          "skip_shipping_address": true,
          "immutable_shipping_address": true
        },
        "shipping_amount": 300,
        "invoice_id": "string",
        "brand_name": "Acme Corporation",
        "locale": "en-US",
        "shipping_preference": "set_provided_address",
        "user_action": "pay_now",
        "partner_customer_risk_data": {
          "key": "string",
          "value": "string"
        },
        "airline_data": [
          {
            "ticket": {
              "number": "045-21351455613",
              "issue_date": "2023-05-20",
              "issuing_carrier_code": "AI",
              "travel_package_indicator": "B",
              "travel_agency_name": "World Tours",
              "travel_agency_code": "01"
            },
            "passenger": [
              {
                "first_name": "John",
                "last_name": "White",
                "date_of_birth": "1990-05-26",
                "address": {
                  "country": null
                }
              }
            ],
            "flight_leg_details": [
              {
                "flight_number": "101",
                "carrier_code": "BA",
                "class_of_travelling": "J",
                "departure_airport": "LHR",
                "departure_date": "2023-06-19",
                "departure_time": "15:30",
                "arrival_airport": "LAX",
                "stop_over_code": "x",
                "fare_basis_code": "SPRSVR"
              }
            ]
          }
        ]
      },
      "processing_channel_id": "pc_q4dbxom5jbgudnjzjpz7j2z6uq",
      "reference": "ORD-5023-4E89",
      "description": "Set of 3 masks",
      "success_url": "https://example.com/payments/success",
      "failure_url": "https://example.com/payments/fail",
      "items": [
        {
          "name": "Test item",
          "quantity": 2,
          "unit_price": 50,
          "reference": "858818ac",
          "total_amount": 29000,
          "tax_amount": 1000,
          "discount_amount": 1000,
          "url": "string",
          "image_url": "string"
        }
      ]
    },
    "partner_metadata": {
      "order_id": "test_order_123",
      "customer_id": "cus_123"
    }
  };

  it('should request a payment context', async () => {
    nock('https://api.sandbox.checkout.com')
      .post('/payment-contexts')
      .reply(201, {
        id: 'pct_y3oqhf46pyzuxjbcn2giaqnb44',
        partner_metadata: {
          order_id: 'test_order_123',
          customer_id: 'cus_123'
        },
        _links: {
          self: 'https://api.checkout.com/payment-contexts/pct_y3oqhf46pyzuxjbcn2giaqnb44'
        }
      });

    const cko = new Checkout(SK);

    const paymentContextResponse = await cko.paymentContexts.request(commonRequest);

    expect(paymentContextResponse.id).to.equal('pct_y3oqhf46pyzuxjbcn2giaqnb44')
    expect(paymentContextResponse.partner_metadata.order_id).to.equal('test_order_123')
    expect(paymentContextResponse.partner_metadata.customer_id).to.equal('cus_123')
  });

  it('should throw 401 when request a payment context', async () => {
    nock('https://api.sandbox.checkout.com').post('/payment-contexts').reply(401);

    const cko = new Checkout('sk_123');

    try {
      await cko.paymentContexts.request(commonRequest);
    } catch (error) {
      expect(error).to.be.instanceOf(AuthenticationError);
    }
  });

  it('should throw 422 when request a payment context', async () => {
    nock('https://api.sandbox.checkout.com').post('/payment-contexts').reply(422);

    const cko = new Checkout(SK);

    try {
      await cko.paymentContexts.request({
        amount: 10,
        currency: 'USD'
      });
    } catch (error) {
      expect(error).to.be.instanceOf(ValidationError);
    }
  });

  it('should throw 429 when request a payment context', async () => {
    nock('https://api.sandbox.checkout.com').post('/payment-contexts').reply(429);

    const cko = new Checkout(SK);

    try {
      await cko.paymentContexts.request(commonRequest);
    } catch (error) {
      expect(error).to.be.instanceOf(TooManyRequestsError);
    }
  });

  it('should throw 502 when request a payment context', async () => {
    nock('https://api.sandbox.checkout.com').post('/payment-contexts').reply(502);

    const cko = new Checkout(SK);

    try {
      await cko.paymentContexts.request(commonRequest);
    } catch (error) {
      expect(error).to.be.instanceOf(BadGateway);
    }
  });

  it('should get a payment context details', async () => {
    nock('https://api.sandbox.checkout.com')
      .get('/payment-contexts/pct_y3oqhf46pyzuxjbcn2giaqnb44')
      .reply(200, commonResponse);

    const cko = new Checkout(SK);

    const paymentContextResponse = await cko.paymentContexts.get('pct_y3oqhf46pyzuxjbcn2giaqnb44');

    expect(paymentContextResponse.payment_request.source.type).to.equal('paypal')
  });

  it('should throw 401 when getting a payment context details', async () => {
    nock('https://api.sandbox.checkout.com').get('/payment-contexts/pct_y3oqhf46pyzuxjbcn2giaqnb44').reply(401);

    const cko = new Checkout('sk_123');

    try {
      await cko.paymentContexts.get('pct_y3oqhf46pyzuxjbcn2giaqnb44');
    } catch (error) {
      expect(error).to.be.instanceOf(AuthenticationError);
    }
  });

  it('should throw 404 when getting a payment context details', async () => {
    nock('https://api.sandbox.checkout.com').get('/payment-contexts/pct_y3oqhf46pyzuxjbcn2giaqnb44').reply(404);

    const cko = new Checkout(SK);

    try {
      await cko.paymentContexts.get('pct_y3oqhf46pyzuxjbcn2giaqnb44');
    } catch (error) {
      expect(error).to.be.instanceOf(NotFoundError);
    }
  });
});