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
    source: {
      type: 'paypal'
    },
    amount: 6540,
    currency: 'USD',
    payment_type: 'Recurring',
    capture: true,
    shipping: {
      first_name: 'John',
      last_name: 'Smith',
      address: {
        address_line1: 'Checkout.com',
        address_line2: '90 Tottenham Court Road',
        city: 'London',
        state: 'str',
        zip: 'W1T 4TJ',
        country: 'GB'
      },
      phone: {
        country_code: '+1',
        number: '415 555 2671'
      },
      from_address_zip: '10014',
      type: 'pickup_in_person'
    },
    processing: {
      order_id: '123456789',
      tax_amount: 3000,
      discount_amount: 0,
      duty_amount: 0,
      shipping_amount: 300,
      shipping_tax_amount: 100,
      aft: true,
      preferred_scheme: 'mastercard',
      merchant_initiated_reason: 'Delayed_charge',
      campaign_id: 0,
      product_type: 'QR Code',
      open_id: 'oUpF8uMuAJO_M2pxb1Q9zNjWeS6o',
      original_order_amount: 10,
      receipt_id: 10,
      terminal_type: 'WAP',
      os_type: 'ANDROID',
      invoice_id: 'string',
      brand_name: 'Super Brand',
      locale: 'en-US',
      shipping_preference: 'SET_PROVIDED_ADDRESS',
      user_action: 'PAY_NOW',
      set_transaction_context: {
        key: 'string',
        value: 'string'
      },
      airline_data: [
        {
          ticket: {
            number: 'string',
            issue_date: 'stringstri',
            issuing_carrier_code: 'st',
            travel_agency_name: 'string',
            travel_agency_code: 'string'
          },
          passenger: {
            name: {
              full_name: 'string'
            },
            date_of_birth: 'stringstri',
            country_code: 'st'
          },
          flight_leg_details: [
            {
              flight_number: 0,
              carrier_code: 'string',
              service_class: 'string',
              departure_date: 'string',
              departure_time: 'string',
              departure_airport: 'string',
              arrival_airport: 'string',
              stopover_code: 'string',
              fare_basis_code: 'string'
            }
          ]
        }
      ],
      purchase_country: 'GB',
      custom_payment_method_ids: [
        'string'
      ],
      merchant_callback_url: 'string',
      line_of_business: 'Flights'
    },
    processing_channel_id: 'pc_q4dbxom5jbgudnjzjpz7j2z6uq',
    reference: 'ORD-5023-4E89',
    description: 'Set of 3 masks',
    success_url: 'https://example.com/payments/success',
    failure_url: 'https://example.com/payments/fail',
    items: [
      {
        name: 'Kevlar batterang',
        quantity: 2,
        unit_price: 50,
        reference: '858818ac',
        commodity_code: 'DEF123',
        unit_of_measure: 'metres',
        total_amount: 29000,
        tax_amount: 1000,
        discount_amount: 1000,
        wxpay_goods_id: 1001,
        url: 'string',
        image_url: 'string'
      }
    ]
  };
  const commonResponse = {
    payment_request: {
      source: {
        type: 'paypal'
      },
      amount: 6540,
      currency: 'USD',
      payment_type: 'Recurring',
      capture: true,
      shipping: {
        first_name: 'John',
        last_name: 'Smith',
        address: {
          address_line1: 'Checkout.com',
          address_line2: '90 Tottenham Court Road',
          city: 'London',
          state: 'str',
          zip: 'W1T 4TJ',
          country: 'GB'
        },
        phone: {
          country_code: '+1',
          number: '415 555 2671'
        },
        from_address_zip: '10014',
        type: 'pickup_in_person'
      },
      processing: {
        order_id: '123456789',
        tax_amount: 3000,
        discount_amount: 0,
        duty_amount: 0,
        shipping_amount: 300,
        shipping_tax_amount: 100,
        aft: true,
        preferred_scheme: 'mastercard',
        merchant_initiated_reason: 'Delayed_charge',
        campaign_id: 0,
        product_type: 'QR Code',
        open_id: 'oUpF8uMuAJO_M2pxb1Q9zNjWeS6o',
        original_order_amount: 10,
        receipt_id: 10,
        terminal_type: 'WAP',
        os_type: 'ANDROID',
        invoice_id: 'string',
        brand_name: 'Super Brand',
        locale: 'en-US',
        shipping_preference: 'SET_PROVIDED_ADDRESS',
        user_action: 'PAY_NOW',
        set_transaction_context: {
          key: 'string',
          value: 'string'
        },
        airline_data: [
          {
            ticket: {
              number: 'string',
              issue_date: 'stringstri',
              issuing_carrier_code: 'st',
              travel_agency_name: 'string',
              travel_agency_code: 'string'
            },
            passenger: {
              name: {
                full_name: 'string'
              },
              date_of_birth: 'stringstri',
              country_code: 'st'
            },
            flight_leg_details: [
              {
                flight_number: 0,
                carrier_code: 'string',
                service_class: 'string',
                departure_date: 'string',
                departure_time: 'string',
                departure_airport: 'string',
                arrival_airport: 'string',
                stopover_code: 'string',
                fare_basis_code: 'string'
              }
            ]
          }
        ],
        purchase_country: 'GB',
        custom_payment_method_ids: [
          'string'
        ],
        merchant_callback_url: 'string',
        line_of_business: 'Flights'
      },
      processing_channel_id: 'pc_q4dbxom5jbgudnjzjpz7j2z6uq',
      reference: 'ORD-5023-4E89',
      description: 'Set of 3 masks',
      success_url: 'https://example.com/payments/success',
      failure_url: 'https://example.com/payments/fail',
      items: [
        {
          name: 'Kevlar batterang',
          quantity: 2,
          unit_price: 50,
          reference: '858818ac',
          commodity_code: 'DEF123',
          unit_of_measure: 'metres',
          total_amount: 29000,
          tax_amount: 1000,
          discount_amount: 1000,
          wxpay_goods_id: 1001,
          url: 'string',
          image_url: 'string'
        }
      ]
    },
    partner_metadata: {
      order_id: 'test_order_123',
      customer_id: 'cus_123'
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