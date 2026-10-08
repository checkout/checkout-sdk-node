import { AuthenticationError, ActionNotAllowed, ValidationError } from '../../src/services/errors.js';
import Checkout from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

describe('Unit::Payment-Setups', () => {
    describe('Confirm payment setup - Success (201)', () => {
        it('should return approved payment with valid response structure', async () => {
            // Arrange
            const response = {
              id: 'pay_mbabizu24mvu3mela5njyhpit4',
              action_id: 'act_mbabizu24mvu3mela5njyhpit4',
              amount: 6540,
              currency: 'USD',
              approved: true,
              status: 'Authorized',
              auth_code: '770687',
              response_code: '10000',
              response_summary: 'Approved',
              '3ds': {
                downgraded: true,
                enrolled: 'N'
              },
              risk: {
                flagged: true
              },
              source: {
                type: 'card',
                id: 'src_nwd3m4in3hkuddfpjsaevunhdy',
                billing_address: {
                  address_line1: '123 High St.',
                  address_line2: 'Flat 456',
                  city: 'London',
                  state: 'GB',
                  zip: 'SW1A 1AA',
                  country: 'GB'
                },
                phone: {
                  country_code: '+1',
                  number: '415 555 2671'
                },
                scheme: 'Visa',
                last4: '6584',
                fingerprint: 'B16D9C2EF0C861A8825C9BD59CCE9171D84EBC45E89CC792B5D1D2D0DDE3DAB7',
                bin: '448504',
                card_type: 'CREDIT',
                card_category: 'COMMERCIAL',
                issuer: 'GE CAPITAL FINANCIAL, INC.',
                issuer_country: 'US',
                product_type: 'PURCHASING',
                avs_check: 'G',
                cvv_check: 'Y',
                payment_account_reference: 'V001898055688657091'
              },
              customer: {
                id: 'cus_udst2tfldj6upmye2reztkmm4i',
                email: 'johnsmith@example.com',
                name: 'John Smith',
                phone: {
                  country_code: '+1',
                  number: '415 555 2671'
                }
              },
              processed_on: '2019-09-10T10:11:12Z',
              reference: 'ORD-5023-4E89',
              processing: {
                retrieval_reference_number: '909913440644',
                acquirer_transaction_id: '440644309099499894406',
                recommendation_code: '02',
                partner_order_id: '5GK24544NA744002L'
              },
              eci: '06',
              scheme_id: '489341065491658',
              _links: {
                self: {
                  href: 'https://123456789.api.sandbox.checkout.com/payments/pay_mbabizu24mvu3mela5njyhpit4'
                },
                actions: {
                  href: 'https://123456789.api.sandbox.checkout.com/payments/pay_mbabizu24mvu3mela5njyhpit4/actions'
                },
                void: {
                  href: 'https://123456789.api.sandbox.checkout.com/payments/pay_mbabizu24mvu3mela5njyhpit4/voids'
                },
                capture: {
                  href: 'https://123456789.api.sandbox.checkout.com/payments/pay_mbabizu24mvu3mela5njyhpit4/captures'
                }
              }
            };

            nock('https://123456789.api.sandbox.checkout.com')
                .post('/payments/setups/pay_setup_123/confirm/tabby')
                .reply(201, response
            );

            // Act
            const id = "pay_setup_123";
            const payment_method_name = "tabby";

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK, { subdomain: '123456789' });

            const result = await cko.paymentSetups.confirmAPaymentSetup(id, payment_method_name);

            // Assert
            expect(result).to.deep.equal(response);
        });

    });
    describe('Confirm payment setup - Bad Request (400)', () => {
        it('should throw ValidationError for malformed request', async () => {
            // Arrange
            var err = null;
            const response = {};

            nock('https://123456789.api.sandbox.checkout.com')
                .post('/payments/setups/pay_setup_123/confirm/tabby')
                .reply(400
            );

            // Act
            const id = "pay_setup_123";
            const payment_method_name = "tabby";

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK, { subdomain: '123456789' });

            try
            {
              const result = await cko.paymentSetups.confirmAPaymentSetup(id, payment_method_name);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(Error);
        });

    });
    describe('Confirm payment setup - Unauthorized (401)', () => {
        it('should throw AuthenticationError for invalid credentials', async () => {
            // Arrange
            var err = null;
            const response = {};

            nock('https://123456789.api.sandbox.checkout.com')
                .post('/payments/setups/pay_setup_123/confirm/tabby')
                .reply(401
            );

            // Act
            const id = "pay_setup_123";
            const payment_method_name = "tabby";

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK, { subdomain: '123456789' });

            try
            {
              const id = "pay_setup_123";
              const payment_method_name = "tabby";
              const result = await cko.paymentSetups.confirmAPaymentSetup(id, payment_method_name); 
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(AuthenticationError);
        });

    });
    describe('Confirm payment setup - Forbidden (403)', () => {
        it('should throw ActionNotAllowed for insufficient permissions', async () => {
            // Arrange
            var err = null;
            const response = {};

            nock('https://123456789.api.sandbox.checkout.com')
                .post('/payments/setups/pay_setup_123/confirm/tabby')
                .reply(403
            );

            // Act
            const id = "pay_setup_123";
            const payment_method_name = "tabby";

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK, { subdomain: '123456789' });

            try
            {
              const result = await cko.paymentSetups.confirmAPaymentSetup(id, payment_method_name);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(ActionNotAllowed);
        });

    });
    describe('Confirm payment setup - Validation Error (422)', () => {
        it('should throw ValidationError for invalid payment data', async () => {
            // Arrange
            var err = null;
            const response = {
              request_id: '0HL80RJLS76I7',
              error_type: 'request_invalid',
              error_codes: [
                'amount_required'
              ]
            };

            nock('https://123456789.api.sandbox.checkout.com')
                .post('/payments/setups/pay_setup_123/confirm/tabby')
                .reply(422
            );

            // Act
            const id = "pay_setup_123";
            const payment_method_name = "tabby";

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK, { subdomain: '123456789' });

            try
            {
              const result = await cko.paymentSetups.confirmAPaymentSetup(id, payment_method_name);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(ValidationError);
        });

    });

    describe('Create payment setup - Success (200) with billing_descriptor, presentment_details and terminal', () => {
        it('should send and receive billing_descriptor, presentment_details and terminal', async () => {
            // Arrange
            const request = {
              processing_channel_id: 'pc_q4dbxom5jbgudnjzjpz7j2z6uq',
              amount: 10000,
              currency: 'GBP',
              payment_type: 'Regular',
              reference: 'REF-0987-475',
              description: 'Set of three t-shirts.',
              billing_descriptor: {
                name: 'Checkout.com',
                city: 'London',
                reference: 'Payment for order 123456'
              },
              presentment_details: {
                amount: 110,
                currency: 'EUR'
              },
              terminal: {
                id: '12345678',
                local_date_time: '2026-05-26T13:05:14+01:00'
              }
            };

            const response = {
              id: 'psu_mbabizu24mvu3mela5njyhpit4',
              processing_channel_id: 'pc_q4dbxom5jbgudnjzjpz7j2z6uq',
              amount: 10000,
              currency: 'GBP',
              payment_type: 'Regular',
              reference: 'REF-0987-475',
              description: 'Set of three t-shirts.',
              billing_descriptor: {
                name: 'Checkout.com',
                city: 'London',
                reference: 'Payment for order 123456'
              },
              presentment_details: {
                amount: 110,
                currency: 'EUR'
              },
              terminal: {
                id: '12345678',
                local_date_time: '2026-05-26T13:05:14+01:00'
              }
            };

            nock('https://123456789.api.sandbox.checkout.com')
                .post('/payments/setups', request)
                .reply(200, response
            );

            // Act
            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK, { subdomain: '123456789' });

            const result = await cko.paymentSetups.createAPaymentSetup(request);

            // Assert
            expect(result).to.deep.equal(response);
            expect(result.billing_descriptor).to.deep.equal(request.billing_descriptor);
            expect(result.presentment_details).to.deep.equal(request.presentment_details);
            expect(result.terminal).to.deep.equal(request.terminal);
        });
    });

    describe('Confirm payment setup - uses payment_method_name path segment', () => {
        it('should build the confirm URL with the payment_method_name value, not payment_method_option_id', async () => {
            // Arrange
            const response = {
              id: 'pay_mbabizu24mvu3mela5njyhpit4',
              status: 'Authorized',
              approved: true
            };

            nock('https://123456789.api.sandbox.checkout.com')
                .post('/payments/setups/pay_setup_123/confirm/klarna')
                .reply(201, response
            );

            // Act
            const id = "pay_setup_123";
            const payment_method_name = "klarna";

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK, { subdomain: '123456789' });

            const result = await cko.paymentSetups.confirmAPaymentSetup(id, payment_method_name);

            // Assert
            expect(result).to.deep.equal(response);
        });
    });

    describe('Create payment setup - Success (200)', () => {
        it('should create payment setup with payment method options', async () => {
            // Arrange
            const response = {
              processing_channel_id: 'pc_q4dbxom5jbgudnjzjpz7j2z6uq',
              amount: 10000,
              currency: 'GBP',
              payment_type: 'Regular',
              reference: 'REF-0987-475',
              description: 'Set of three t-shirts.',
              payment_methods: {
                klarna: {
                  status: 'available',
                  flags: [
                    'string'
                  ],
                  initialization: 'disabled',
                  account_holder: {
                    billing_address: {
                      country: 'GB'
                    }
                  },
                  payment_method_options: {
                    sdk: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      status: 'pending',
                      flags: [
                        'string'
                      ],
                      action: {
                        type: 'sdk',
                        client_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJzZXNzaW9uX2lkIiA6ICIw',
                        session_id: '0b1d9815-165e-42e2-8867-35bc03789e00'
                      }
                    }
                  }
                },
                stcpay: {
                  status: 'available',
                  flags: [
                    'string'
                  ],
                  initialization: 'disabled',
                  otp: '123456',
                  payment_method_options: {
                    pay_in_full: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      status: 'pending',
                      flags: [
                        'string'
                      ],
                      action: {
                        type: 'otp'
                      }
                    }
                  }
                },
                tabby: {
                  status: 'available',
                  flags: [
                    'string'
                  ],
                  initialization: 'disabled',
                  payment_method_options: {
                    installments: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      status: 'pending',
                      flags: [
                        'string'
                      ]
                    }
                  }
                },
                bizum: {
                  status: 'available',
                  flags: [
                    'string'
                  ],
                  initialization: 'disabled',
                  payment_method_options: {
                    pay_now: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      status: 'pending',
                      flags: [
                        'string'
                      ]
                    }
                  }
                }
              },
              settings: {
                success_url: 'http://example.com/payments/success',
                failure_url: 'http://example.com/payments/fail'
              },
              customer: {
                email: {
                  address: 'johnsmith@example.com',
                  verified: true
                },
                name: 'John Smith',
                phone: {
                  country_code: '44',
                  number: '207 946 0000'
                },
                device: {
                  locale: 'en_GB'
                },
                merchant_account: {
                  id: '1234',
                  registration_date: '2023-05-01',
                  last_modified: '2023-05-01',
                  returning_customer: true,
                  first_transaction_date: '2023-09-15',
                  last_transaction_date: '2025-03-28',
                  total_order_count: 6,
                  last_payment_amount: 55.99
                }
              },
              order: {
                items: [
                  {
                    name: 'Battery Power Pack',
                    quantity: 1,
                    unit_price: 1000,
                    total_amount: 1000,
                    reference: 'BA67A',
                    discount_amount: 150,
                    url: 'http://shoppingsite.com/my-item',
                    image_url: 'http://shoppingsite.com/my-item/image',
                    type: 'digital'
                  }
                ],
                shipping: {
                  address: {
                    address_line1: '10 Canterbury Road',
                    city: 'London',
                    zip: 'SW1 1AA'
                  },
                  method: 'string'
                },
                sub_merchants: [
                  {
                    id: 'SUB12345',
                    product_category: 'Electronics',
                    number_of_trades: 500,
                    registration_date: '2023-01-15'
                  }
                ],
                discount_amount: 10
              },
              industry: {
                airline: [
                  {
                  ticket: {
                  number: '0742464639523',
                  issue_date: '2025-05-01',
                  issuing_carrier_code: '042',
                  travel_package_indicator: 'A',
                  travel_agency_name: 'Checkout Travel Agents',
                  travel_agency_code: '91114362'
                  },
                  passengers: [
                  {
                  first_name: 'John',
                  last_name: 'Smith',
                  date_of_birth: '1990-10-31',
                  address: {
                  country: 'GB'
                  }
                  }
                  ],
                  flight_leg_details: [
                  {
                  flight_number: 'BA1483',
                  carrier_code: 'BA',
                  class_of_travelling: 'W',
                  departure_airport: 'LHW',
                  departure_date: '2025-10-13',
                  departure_time: '18:30',
                  arrival_airport: 'JFK',
                  stop_over_code: 'X',
                  fare_basis_code: 'WUP14B'
                  }
                  ]
                  }
                ],
                accommodation: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line1: '123 High Street',
                      city: 'London',
                      state: 'Greater London',
                      country: 'GB',
                      zip: 'SW1 1AA'
                    },
                    number_of_rooms: 2,
                    guests: [
                      {
                        first_name: 'Jia',
                        last_name: 'Tsang',
                        date_of_birth: '1970-03-19'
                      }
                    ],
                    room: [
                      {
                        rate: 42.3,
                        number_of_nights: 5
                      }
                    ]
                  }
                ]
              }
            };

            nock('https://123456789.api.sandbox.checkout.com')
                .post('/payments/setups')
                .reply(200, response
            );

            // Act
            const request = {
              processing_channel_id: 'pc_q4dbxom5jbgudnjzjpz7j2z6uq',
              amount: 10000,
              currency: 'GBP',
              payment_type: 'Regular',
              reference: 'REF-0987-475',
              description: 'Set of three t-shirts.',
              payment_methods: {
                klarna: {
                  initialization: 'disabled',
                  account_holder: {
                    billing_address: {
                      country: 'GB'
                    }
                  },
                  payment_method_options: {
                    sdk: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      action: {
                        type: 'sdk',
                        client_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJzZXNzaW9uX2lkIiA6ICIw',
                        session_id: '0b1d9815-165e-42e2-8867-35bc03789e00'
                      }
                    }
                  }
                },
                stcpay: {
                  initialization: 'disabled',
                  otp: '123456',
                  payment_method_options: {
                    pay_in_full: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      action: {
                        type: 'otp'
                      }
                    }
                  }
                },
                tabby: {
                  initialization: 'disabled',
                  payment_method_options: {
                    installments: {
                      id: 'opt_drzstxerxrku3apsepshbslssu'
                    }
                  }
                },
                bizum: {
                  initialization: 'disabled',
                  payment_method_options: {
                    pay_now: {
                      id: 'opt_drzstxerxrku3apsepshbslssu'
                    }
                  }
                }
              },
              settings: {
                success_url: 'http://example.com/payments/success',
                failure_url: 'http://example.com/payments/fail'
              },
              customer: {
                email: {
                  address: 'johnsmith@example.com',
                  verified: true
                },
                name: 'John Smith',
                phone: {
                  country_code: '44',
                  number: '207 946 0000'
                },
                device: {
                  locale: 'en_GB'
                },
                merchant_account: {
                  id: '1234',
                  registration_date: '2023-05-01',
                  last_modified: '2023-05-01',
                  returning_customer: true,
                  first_transaction_date: '2023-09-15',
                  last_transaction_date: '2025-03-28',
                  total_order_count: 6,
                  last_payment_amount: 55.99
                }
              },
              order: {
                items: [
                  {
                    name: 'Battery Power Pack',
                    quantity: 1,
                    unit_price: 1000,
                    total_amount: 1000,
                    reference: 'BA67A',
                    discount_amount: 150,
                    url: 'http://shoppingsite.com/my-item',
                    image_url: 'http://shoppingsite.com/my-item/image',
                    type: 'digital'
                  }
                ],
                shipping: {
                  address: {
                    address_line1: '10 Canterbury Road',
                    city: 'London',
                    zip: 'SW1 1AA'
                  },
                  method: 'string'
                },
                sub_merchants: [
                  {
                    id: 'SUB12345',
                    product_category: 'Electronics',
                    number_of_trades: 500,
                    registration_date: '2023-01-15'
                  }
                ],
                discount_amount: 10
              },
              industry: {
                airline: [
                  {
                  ticket: {
                  number: '0742464639523',
                  issue_date: '2025-05-01',
                  issuing_carrier_code: '042',
                  travel_package_indicator: 'A',
                  travel_agency_name: 'Checkout Travel Agents',
                  travel_agency_code: '91114362'
                  },
                  passengers: [
                  {
                  first_name: 'John',
                  last_name: 'Smith',
                  date_of_birth: '1990-10-31',
                  address: {
                  country: 'GB'
                  }
                  }
                  ],
                  flight_leg_details: [
                  {
                  flight_number: 'BA1483',
                  carrier_code: 'BA',
                  class_of_travelling: 'W',
                  departure_airport: 'LHW',
                  departure_date: '2025-10-13',
                  departure_time: '18:30',
                  arrival_airport: 'JFK',
                  stop_over_code: 'X',
                  fare_basis_code: 'WUP14B'
                  }
                  ]
                  }
                ],
                accommodation: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line1: '123 High Street',
                      city: 'London',
                      state: 'Greater London',
                      country: 'GB',
                      zip: 'SW1 1AA'
                    },
                    number_of_rooms: 2,
                    guests: [
                      {
                        first_name: 'Jia',
                        last_name: 'Tsang',
                        date_of_birth: '1970-03-19'
                      }
                    ],
                    room: [
                      {
                        rate: 42.3,
                        number_of_nights: 5
                      }
                    ]
                  }
                ]
              }
            };

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK, { subdomain: '123456789' });

            const result = await cko.paymentSetups.createAPaymentSetup(request);

            // Assert
            expect(result).to.deep.equal(response);
        });

    });
    describe('Create payment setup - Bad Request (400)', () => {
        it('should throw ValidationError for malformed request', async () => {
            // Arrange
            var err = null;
            const response = {};

            nock('https://123456789.api.sandbox.checkout.com')
                .post('/payments/setups')
                .reply(400
            );

            // Act
            const request = {
              processing_channel_id: 'pc_q4dbxom5jbgudnjzjpz7j2z6uq',
              amount: 10000,
              currency: 'GBP',
              payment_type: 'Regular',
              reference: 'REF-0987-475',
              description: 'Set of three t-shirts.',
              payment_methods: {
                klarna: {
                  initialization: 'disabled',
                  account_holder: {
                    billing_address: {
                      country: 'GB'
                    }
                  },
                  payment_method_options: {
                    sdk: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      action: {
                        type: 'sdk',
                        client_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJzZXNzaW9uX2lkIiA6ICIw',
                        session_id: '0b1d9815-165e-42e2-8867-35bc03789e00'
                      }
                    }
                  }
                },
                stcpay: {
                  initialization: 'disabled',
                  otp: '123456',
                  payment_method_options: {
                    pay_in_full: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      action: {
                        type: 'otp'
                      }
                    }
                  }
                },
                tabby: {
                  initialization: 'disabled',
                  payment_method_options: {
                    installments: {
                      id: 'opt_drzstxerxrku3apsepshbslssu'
                    }
                  }
                },
                bizum: {
                  initialization: 'disabled',
                  payment_method_options: {
                    pay_now: {
                      id: 'opt_drzstxerxrku3apsepshbslssu'
                    }
                  }
                }
              },
              settings: {
                success_url: 'http://example.com/payments/success',
                failure_url: 'http://example.com/payments/fail'
              },
              customer: {
                email: {
                  address: 'johnsmith@example.com',
                  verified: true
                },
                name: 'John Smith',
                phone: {
                  country_code: '44',
                  number: '207 946 0000'
                },
                device: {
                  locale: 'en_GB'
                },
                merchant_account: {
                  id: '1234',
                  registration_date: '2023-05-01',
                  last_modified: '2023-05-01',
                  returning_customer: true,
                  first_transaction_date: '2023-09-15',
                  last_transaction_date: '2025-03-28',
                  total_order_count: 6,
                  last_payment_amount: 55.99
                }
              },
              order: {
                items: [
                  {
                    name: 'Battery Power Pack',
                    quantity: 1,
                    unit_price: 1000,
                    total_amount: 1000,
                    reference: 'BA67A',
                    discount_amount: 150,
                    url: 'http://shoppingsite.com/my-item',
                    image_url: 'http://shoppingsite.com/my-item/image',
                    type: 'digital'
                  }
                ],
                shipping: {
                  address: {
                    address_line1: '10 Canterbury Road',
                    city: 'London',
                    zip: 'SW1 1AA'
                  },
                  method: 'string'
                },
                sub_merchants: [
                  {
                    id: 'SUB12345',
                    product_category: 'Electronics',
                    number_of_trades: 500,
                    registration_date: '2023-01-15'
                  }
                ],
                discount_amount: 10
              },
              industry: {
                airline: [
                  {
                  ticket: {
                  number: '0742464639523',
                  issue_date: '2025-05-01',
                  issuing_carrier_code: '042',
                  travel_package_indicator: 'A',
                  travel_agency_name: 'Checkout Travel Agents',
                  travel_agency_code: '91114362'
                  },
                  passengers: [
                  {
                  first_name: 'John',
                  last_name: 'Smith',
                  date_of_birth: '1990-10-31',
                  address: {
                  country: 'GB'
                  }
                  }
                  ],
                  flight_leg_details: [
                  {
                  flight_number: 'BA1483',
                  carrier_code: 'BA',
                  class_of_travelling: 'W',
                  departure_airport: 'LHW',
                  departure_date: '2025-10-13',
                  departure_time: '18:30',
                  arrival_airport: 'JFK',
                  stop_over_code: 'X',
                  fare_basis_code: 'WUP14B'
                  }
                  ]
                  }
                ],
                accommodation: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line1: '123 High Street',
                      city: 'London',
                      state: 'Greater London',
                      country: 'GB',
                      zip: 'SW1 1AA'
                    },
                    number_of_rooms: 2,
                    guests: [
                      {
                        first_name: 'Jia',
                        last_name: 'Tsang',
                        date_of_birth: '1970-03-19'
                      }
                    ],
                    room: [
                      {
                        rate: 42.3,
                        number_of_nights: 5
                      }
                    ]
                  }
                ]
              }
            };

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK, { subdomain: '123456789' });

            try {
              const result = await cko.paymentSetups.createAPaymentSetup(request);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(Error);
        });

    });
    describe('Create payment setup - Unauthorized (401)', () => {
        it('should throw AuthenticationError for invalid credentials', async () => {
            // Arrange
            var err = null;
            const response = {};

            nock('https://123456789.api.sandbox.checkout.com')
                .post('/payments/setups')
                .reply(401
            );

            // Act
            const request = {
              processing_channel_id: 'pc_q4dbxom5jbgudnjzjpz7j2z6uq',
              amount: 10000,
              currency: 'GBP',
              payment_type: 'Regular',
              reference: 'REF-0987-475',
              description: 'Set of three t-shirts.',
              payment_methods: {
                klarna: {
                  initialization: 'disabled',
                  account_holder: {
                    billing_address: {
                      country: 'GB'
                    }
                  },
                  payment_method_options: {
                    sdk: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      action: {
                        type: 'sdk',
                        client_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJzZXNzaW9uX2lkIiA6ICIw',
                        session_id: '0b1d9815-165e-42e2-8867-35bc03789e00'
                      }
                    }
                  }
                },
                stcpay: {
                  initialization: 'disabled',
                  otp: '123456',
                  payment_method_options: {
                    pay_in_full: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      action: {
                        type: 'otp'
                      }
                    }
                  }
                },
                tabby: {
                  initialization: 'disabled',
                  payment_method_options: {
                    installments: {
                      id: 'opt_drzstxerxrku3apsepshbslssu'
                    }
                  }
                },
                bizum: {
                  initialization: 'disabled',
                  payment_method_options: {
                    pay_now: {
                      id: 'opt_drzstxerxrku3apsepshbslssu'
                    }
                  }
                }
              },
              settings: {
                success_url: 'http://example.com/payments/success',
                failure_url: 'http://example.com/payments/fail'
              },
              customer: {
                email: {
                  address: 'johnsmith@example.com',
                  verified: true
                },
                name: 'John Smith',
                phone: {
                  country_code: '44',
                  number: '207 946 0000'
                },
                device: {
                  locale: 'en_GB'
                },
                merchant_account: {
                  id: '1234',
                  registration_date: '2023-05-01',
                  last_modified: '2023-05-01',
                  returning_customer: true,
                  first_transaction_date: '2023-09-15',
                  last_transaction_date: '2025-03-28',
                  total_order_count: 6,
                  last_payment_amount: 55.99
                }
              },
              order: {
                items: [
                  {
                    name: 'Battery Power Pack',
                    quantity: 1,
                    unit_price: 1000,
                    total_amount: 1000,
                    reference: 'BA67A',
                    discount_amount: 150,
                    url: 'http://shoppingsite.com/my-item',
                    image_url: 'http://shoppingsite.com/my-item/image',
                    type: 'digital'
                  }
                ],
                shipping: {
                  address: {
                    address_line1: '10 Canterbury Road',
                    city: 'London',
                    zip: 'SW1 1AA'
                  },
                  method: 'string'
                },
                sub_merchants: [
                  {
                    id: 'SUB12345',
                    product_category: 'Electronics',
                    number_of_trades: 500,
                    registration_date: '2023-01-15'
                  }
                ],
                discount_amount: 10
              },
              industry: {
                airline: [
                  {
                  ticket: {
                  number: '0742464639523',
                  issue_date: '2025-05-01',
                  issuing_carrier_code: '042',
                  travel_package_indicator: 'A',
                  travel_agency_name: 'Checkout Travel Agents',
                  travel_agency_code: '91114362'
                  },
                  passengers: [
                  {
                  first_name: 'John',
                  last_name: 'Smith',
                  date_of_birth: '1990-10-31',
                  address: {
                  country: 'GB'
                  }
                  }
                  ],
                  flight_leg_details: [
                  {
                  flight_number: 'BA1483',
                  carrier_code: 'BA',
                  class_of_travelling: 'W',
                  departure_airport: 'LHW',
                  departure_date: '2025-10-13',
                  departure_time: '18:30',
                  arrival_airport: 'JFK',
                  stop_over_code: 'X',
                  fare_basis_code: 'WUP14B'
                  }
                  ]
                  }
                ],
                accommodation: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line1: '123 High Street',
                      city: 'London',
                      state: 'Greater London',
                      country: 'GB',
                      zip: 'SW1 1AA'
                    },
                    number_of_rooms: 2,
                    guests: [
                      {
                        first_name: 'Jia',
                        last_name: 'Tsang',
                        date_of_birth: '1970-03-19'
                      }
                    ],
                    room: [
                      {
                        rate: 42.3,
                        number_of_nights: 5
                      }
                    ]
                  }
                ]
              }
            };

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK, { subdomain: '123456789' });

            try {
              const result = await cko.paymentSetups.createAPaymentSetup(request);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(AuthenticationError);
        });

    });
    describe('Create payment setup - Forbidden (403)', () => {
        it('should throw ActionNotAllowed for insufficient permissions', async () => {
            // Arrange
            var err = null;
            const response = {};

            nock('https://123456789.api.sandbox.checkout.com')
                .post('/payments/setups')
                .reply(403
            );

            // Act
            const request = {
              processing_channel_id: 'pc_q4dbxom5jbgudnjzjpz7j2z6uq',
              amount: 10000,
              currency: 'GBP',
              payment_type: 'Regular',
              reference: 'REF-0987-475',
              description: 'Set of three t-shirts.',
              payment_methods: {
                klarna: {
                  initialization: 'disabled',
                  account_holder: {
                    billing_address: {
                      country: 'GB'
                    }
                  },
                  payment_method_options: {
                    sdk: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      action: {
                        type: 'sdk',
                        client_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJzZXNzaW9uX2lkIiA6ICIw',
                        session_id: '0b1d9815-165e-42e2-8867-35bc03789e00'
                      }
                    }
                  }
                },
                stcpay: {
                  initialization: 'disabled',
                  otp: '123456',
                  payment_method_options: {
                    pay_in_full: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      action: {
                        type: 'otp'
                      }
                    }
                  }
                },
                tabby: {
                  initialization: 'disabled',
                  payment_method_options: {
                    installments: {
                      id: 'opt_drzstxerxrku3apsepshbslssu'
                    }
                  }
                },
                bizum: {
                  initialization: 'disabled',
                  payment_method_options: {
                    pay_now: {
                      id: 'opt_drzstxerxrku3apsepshbslssu'
                    }
                  }
                }
              },
              settings: {
                success_url: 'http://example.com/payments/success',
                failure_url: 'http://example.com/payments/fail'
              },
              customer: {
                email: {
                  address: 'johnsmith@example.com',
                  verified: true
                },
                name: 'John Smith',
                phone: {
                  country_code: '44',
                  number: '207 946 0000'
                },
                device: {
                  locale: 'en_GB'
                },
                merchant_account: {
                  id: '1234',
                  registration_date: '2023-05-01',
                  last_modified: '2023-05-01',
                  returning_customer: true,
                  first_transaction_date: '2023-09-15',
                  last_transaction_date: '2025-03-28',
                  total_order_count: 6,
                  last_payment_amount: 55.99
                }
              },
              order: {
                items: [
                  {
                    name: 'Battery Power Pack',
                    quantity: 1,
                    unit_price: 1000,
                    total_amount: 1000,
                    reference: 'BA67A',
                    discount_amount: 150,
                    url: 'http://shoppingsite.com/my-item',
                    image_url: 'http://shoppingsite.com/my-item/image',
                    type: 'digital'
                  }
                ],
                shipping: {
                  address: {
                    address_line1: '10 Canterbury Road',
                    city: 'London',
                    zip: 'SW1 1AA'
                  },
                  method: 'string'
                },
                sub_merchants: [
                  {
                    id: 'SUB12345',
                    product_category: 'Electronics',
                    number_of_trades: 500,
                    registration_date: '2023-01-15'
                  }
                ],
                discount_amount: 10
              },
              industry: {
                airline: [
                  {
                  ticket: {
                  number: '0742464639523',
                  issue_date: '2025-05-01',
                  issuing_carrier_code: '042',
                  travel_package_indicator: 'A',
                  travel_agency_name: 'Checkout Travel Agents',
                  travel_agency_code: '91114362'
                  },
                  passengers: [
                  {
                  first_name: 'John',
                  last_name: 'Smith',
                  date_of_birth: '1990-10-31',
                  address: {
                  country: 'GB'
                  }
                  }
                  ],
                  flight_leg_details: [
                  {
                  flight_number: 'BA1483',
                  carrier_code: 'BA',
                  class_of_travelling: 'W',
                  departure_airport: 'LHW',
                  departure_date: '2025-10-13',
                  departure_time: '18:30',
                  arrival_airport: 'JFK',
                  stop_over_code: 'X',
                  fare_basis_code: 'WUP14B'
                  }
                  ]
                  }
                ],
                accommodation: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line1: '123 High Street',
                      city: 'London',
                      state: 'Greater London',
                      country: 'GB',
                      zip: 'SW1 1AA'
                    },
                    number_of_rooms: 2,
                    guests: [
                      {
                        first_name: 'Jia',
                        last_name: 'Tsang',
                        date_of_birth: '1970-03-19'
                      }
                    ],
                    room: [
                      {
                        rate: 42.3,
                        number_of_nights: 5
                      }
                    ]
                  }
                ]
              }
            };

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK, { subdomain: '123456789' });

            try {
              const result = await cko.paymentSetups.createAPaymentSetup(request);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(ActionNotAllowed);
        });

    });
    describe('Create payment setup - Validation Error (422)', () => {
        it('should throw ValidationError for invalid payment data', async () => {
            // Arrange
            var err = null;
            const response = {
              request_id: '0HL80RJLS76I7',
              error_type: 'request_invalid',
              error_codes: [
                'amount_required'
              ]
            };

            nock('https://123456789.api.sandbox.checkout.com')
                .post('/payments/setups')
                .reply(422
            );

            // Act
            const request = {
              processing_channel_id: 'pc_q4dbxom5jbgudnjzjpz7j2z6uq',
              amount: 10000,
              currency: 'GBP',
              payment_type: 'Regular',
              reference: 'REF-0987-475',
              description: 'Set of three t-shirts.',
              payment_methods: {
                klarna: {
                  initialization: 'disabled',
                  account_holder: {
                    billing_address: {
                      country: 'GB'
                    }
                  },
                  payment_method_options: {
                    sdk: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      action: {
                        type: 'sdk',
                        client_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJzZXNzaW9uX2lkIiA6ICIw',
                        session_id: '0b1d9815-165e-42e2-8867-35bc03789e00'
                      }
                    }
                  }
                },
                stcpay: {
                  initialization: 'disabled',
                  otp: '123456',
                  payment_method_options: {
                    pay_in_full: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      action: {
                        type: 'otp'
                      }
                    }
                  }
                },
                tabby: {
                  initialization: 'disabled',
                  payment_method_options: {
                    installments: {
                      id: 'opt_drzstxerxrku3apsepshbslssu'
                    }
                  }
                },
                bizum: {
                  initialization: 'disabled',
                  payment_method_options: {
                    pay_now: {
                      id: 'opt_drzstxerxrku3apsepshbslssu'
                    }
                  }
                }
              },
              settings: {
                success_url: 'http://example.com/payments/success',
                failure_url: 'http://example.com/payments/fail'
              },
              customer: {
                email: {
                  address: 'johnsmith@example.com',
                  verified: true
                },
                name: 'John Smith',
                phone: {
                  country_code: '44',
                  number: '207 946 0000'
                },
                device: {
                  locale: 'en_GB'
                },
                merchant_account: {
                  id: '1234',
                  registration_date: '2023-05-01',
                  last_modified: '2023-05-01',
                  returning_customer: true,
                  first_transaction_date: '2023-09-15',
                  last_transaction_date: '2025-03-28',
                  total_order_count: 6,
                  last_payment_amount: 55.99
                }
              },
              order: {
                items: [
                  {
                    name: 'Battery Power Pack',
                    quantity: 1,
                    unit_price: 1000,
                    total_amount: 1000,
                    reference: 'BA67A',
                    discount_amount: 150,
                    url: 'http://shoppingsite.com/my-item',
                    image_url: 'http://shoppingsite.com/my-item/image',
                    type: 'digital'
                  }
                ],
                shipping: {
                  address: {
                    address_line1: '10 Canterbury Road',
                    city: 'London',
                    zip: 'SW1 1AA'
                  },
                  method: 'string'
                },
                sub_merchants: [
                  {
                    id: 'SUB12345',
                    product_category: 'Electronics',
                    number_of_trades: 500,
                    registration_date: '2023-01-15'
                  }
                ],
                discount_amount: 10
              },
              industry: {
                airline: [
                  {
                  ticket: {
                  number: '0742464639523',
                  issue_date: '2025-05-01',
                  issuing_carrier_code: '042',
                  travel_package_indicator: 'A',
                  travel_agency_name: 'Checkout Travel Agents',
                  travel_agency_code: '91114362'
                  },
                  passengers: [
                  {
                  first_name: 'John',
                  last_name: 'Smith',
                  date_of_birth: '1990-10-31',
                  address: {
                  country: 'GB'
                  }
                  }
                  ],
                  flight_leg_details: [
                  {
                  flight_number: 'BA1483',
                  carrier_code: 'BA',
                  class_of_travelling: 'W',
                  departure_airport: 'LHW',
                  departure_date: '2025-10-13',
                  departure_time: '18:30',
                  arrival_airport: 'JFK',
                  stop_over_code: 'X',
                  fare_basis_code: 'WUP14B'
                  }
                  ]
                  }
                ],
                accommodation: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line1: '123 High Street',
                      city: 'London',
                      state: 'Greater London',
                      country: 'GB',
                      zip: 'SW1 1AA'
                    },
                    number_of_rooms: 2,
                    guests: [
                      {
                        first_name: 'Jia',
                        last_name: 'Tsang',
                        date_of_birth: '1970-03-19'
                      }
                    ],
                    room: [
                      {
                        rate: 42.3,
                        number_of_nights: 5
                      }
                    ]
                  }
                ]
              }
            };

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK, { subdomain: '123456789' });

            try {
              const result = await cko.paymentSetups.createAPaymentSetup(request);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(ValidationError);
        });

    });

    describe('Get payment setup - Success (200)', () => {
        it('should return payment setup details with complete data', async () => {
            // Arrange
            const response = {
              id: 'string',
              processing_channel_id: 'pc_q4dbxom5jbgudnjzjpz7j2z6uq',
              amount: 10000,
              currency: 'GBP',
              payment_type: 'Regular',
              reference: 'REF-0987-475',
              description: 'Set of three t-shirts.',
              payment_methods: {
                klarna: {
                  status: 'available',
                  flags: [
                    'string'
                  ],
                  initialization: 'disabled',
                  account_holder: {
                    billing_address: {
                      country: 'GB'
                    }
                  },
                  payment_method_options: {
                    sdk: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      status: 'pending',
                      flags: [
                        'string'
                      ],
                      action: {
                        type: 'sdk',
                        client_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJzZXNzaW9uX2lkIiA6ICIw',
                        session_id: '0b1d9815-165e-42e2-8867-35bc03789e00'
                      }
                    }
                  }
                },
                stcpay: {
                  status: 'available',
                  flags: [
                    'string'
                  ],
                  initialization: 'disabled',
                  otp: '123456',
                  payment_method_options: {
                    pay_in_full: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      status: 'pending',
                      flags: [
                        'string'
                      ],
                      action: {
                        type: 'otp'
                      }
                    }
                  }
                },
                tabby: {
                  status: 'available',
                  flags: [
                    'string'
                  ],
                  initialization: 'disabled',
                  payment_method_options: {
                    installments: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      status: 'pending',
                      flags: [
                        'string'
                      ]
                    }
                  }
                },
                bizum: {
                  status: 'available',
                  flags: [
                    'string'
                  ],
                  initialization: 'disabled',
                  payment_method_options: {
                    pay_now: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      status: 'pending',
                      flags: [
                        'string'
                      ]
                    }
                  }
                }
              },
              settings: {
                success_url: 'http://example.com/payments/success',
                failure_url: 'http://example.com/payments/fail'
              },
              customer: {
                email: {
                  address: 'johnsmith@example.com',
                  verified: true
                },
                name: 'John Smith',
                phone: {
                  country_code: '44',
                  number: '207 946 0000'
                },
                device: {
                  locale: 'en_GB'
                },
                merchant_account: {
                  id: '1234',
                  registration_date: '2023-05-01',
                  last_modified: '2023-05-01',
                  returning_customer: true,
                  first_transaction_date: '2023-09-15',
                  last_transaction_date: '2025-03-28',
                  total_order_count: 6,
                  last_payment_amount: 55.99
                }
              },
              order: {
                items: [
                  {
                    name: 'Battery Power Pack',
                    quantity: 1,
                    unit_price: 1000,
                    total_amount: 1000,
                    reference: 'BA67A',
                    discount_amount: 150,
                    url: 'http://shoppingsite.com/my-item',
                    image_url: 'http://shoppingsite.com/my-item/image',
                    type: 'digital'
                  }
                ],
                shipping: {
                  address: {
                    address_line1: '10 Canterbury Road',
                    city: 'London',
                    zip: 'SW1 1AA'
                  },
                  method: 'string'
                },
                sub_merchants: [
                  {
                    id: 'SUB12345',
                    product_category: 'Electronics',
                    number_of_trades: 500,
                    registration_date: '2023-01-15'
                  }
                ],
                discount_amount: 10
              },
              industry: {
                airline: [
                  {
                  ticket: {
                  number: '0742464639523',
                  issue_date: '2025-05-01',
                  issuing_carrier_code: '042',
                  travel_package_indicator: 'A',
                  travel_agency_name: 'Checkout Travel Agents',
                  travel_agency_code: '91114362'
                  },
                  passengers: [
                  {
                  first_name: 'John',
                  last_name: 'Smith',
                  date_of_birth: '1990-10-31',
                  address: {
                  country: 'GB'
                  }
                  }
                  ],
                  flight_leg_details: [
                  {
                  flight_number: 'BA1483',
                  carrier_code: 'BA',
                  class_of_travelling: 'W',
                  departure_airport: 'LHW',
                  departure_date: '2025-10-13',
                  departure_time: '18:30',
                  arrival_airport: 'JFK',
                  stop_over_code: 'X',
                  fare_basis_code: 'WUP14B'
                  }
                  ]
                  }
                ],
                accommodation: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line1: '123 High Street',
                      city: 'London',
                      state: 'Greater London',
                      country: 'GB',
                      zip: 'SW1 1AA'
                    },
                    number_of_rooms: 2,
                    guests: [
                      {
                        first_name: 'Jia',
                        last_name: 'Tsang',
                        date_of_birth: '1970-03-19'
                      }
                    ],
                    room: [
                      {
                        rate: 42.3,
                        number_of_nights: 5
                      }
                    ]
                  }
                ]
              }
            };

            nock('https://123456789.api.sandbox.checkout.com')
                .get('/payments/setups/pay_setup_123')
                .reply(200, response
            );

            // Act
            const id = "pay_setup_123";
            const request = {};

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK, { subdomain: '123456789' });

            const result = await cko.paymentSetups.getAPaymentSetup(id);

            // Assert
            expect(result).to.deep.equal(response);
        });

    });
    describe('Get payment setup - Unauthorized (401)', () => {
        it('should throw AuthenticationError for invalid credentials', async () => {
            // Arrange
            var err = null;
            const response = {};

            nock('https://123456789.api.sandbox.checkout.com')
                .get('/payments/setups/pay_setup_123')
                .reply(401
            );

            // Act
            const id = "pay_setup_123";

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK, { subdomain: '123456789' });

            try {
              const result = await cko.paymentSetups.getAPaymentSetup(id);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(AuthenticationError);
        });

    });
    describe('Get payment setup - Forbidden (403)', () => {
        it('should throw ActionNotAllowed for insufficient permissions', async () => {
            // Arrange
            var err = null;
            const response = {};

            nock('https://123456789.api.sandbox.checkout.com')
                .get('/payments/setups/pay_setup_123')
                .reply(403
            );

            // Act
            const id = "pay_setup_123";

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK, { subdomain: '123456789' });

            try {
              const result = await cko.paymentSetups.getAPaymentSetup(id);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(ActionNotAllowed);
        });

    });

    describe('Update payment setup - Success (200)', () => {
        it('should update payment setup with new configuration', async () => {
            // Arrange
            const response = {
              id: 'string',
              processing_channel_id: 'pc_q4dbxom5jbgudnjzjpz7j2z6uq',
              amount: 10000,
              currency: 'GBP',
              payment_type: 'Regular',
              reference: 'REF-0987-475',
              description: 'Set of three t-shirts.',
              payment_methods: {
                klarna: {
                  status: 'available',
                  flags: [
                    'string'
                  ],
                  initialization: 'disabled',
                  account_holder: {
                    billing_address: {
                      country: 'GB'
                    }
                  },
                  payment_method_options: {
                    sdk: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      status: 'pending',
                      flags: [
                        'string'
                      ],
                      action: {
                        type: 'sdk',
                        client_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJzZXNzaW9uX2lkIiA6ICIw',
                        session_id: '0b1d9815-165e-42e2-8867-35bc03789e00'
                      }
                    }
                  }
                },
                stcpay: {
                  status: 'available',
                  flags: [
                    'string'
                  ],
                  initialization: 'disabled',
                  otp: '123456',
                  payment_method_options: {
                    pay_in_full: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      status: 'pending',
                      flags: [
                        'string'
                      ],
                      action: {
                        type: 'otp'
                      }
                    }
                  }
                },
                tabby: {
                  status: 'available',
                  flags: [
                    'string'
                  ],
                  initialization: 'disabled',
                  payment_method_options: {
                    installments: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      status: 'pending',
                      flags: [
                        'string'
                      ]
                    }
                  }
                },
                bizum: {
                  status: 'available',
                  flags: [
                    'string'
                  ],
                  initialization: 'disabled',
                  payment_method_options: {
                    pay_now: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      status: 'pending',
                      flags: [
                        'string'
                      ]
                    }
                  }
                }
              },
              settings: {
                success_url: 'http://example.com/payments/success',
                failure_url: 'http://example.com/payments/fail'
              },
              customer: {
                email: {
                  address: 'johnsmith@example.com',
                  verified: true
                },
                name: 'John Smith',
                phone: {
                  country_code: '44',
                  number: '207 946 0000'
                },
                device: {
                  locale: 'en_GB'
                },
                merchant_account: {
                  id: '1234',
                  registration_date: '2023-05-01',
                  last_modified: '2023-05-01',
                  returning_customer: true,
                  first_transaction_date: '2023-09-15',
                  last_transaction_date: '2025-03-28',
                  total_order_count: 6,
                  last_payment_amount: 55.99
                }
              },
              order: {
                items: [
                  {
                    name: 'Battery Power Pack',
                    quantity: 1,
                    unit_price: 1000,
                    total_amount: 1000,
                    reference: 'BA67A',
                    discount_amount: 150,
                    url: 'http://shoppingsite.com/my-item',
                    image_url: 'http://shoppingsite.com/my-item/image',
                    type: 'digital'
                  }
                ],
                shipping: {
                  address: {
                    address_line1: '10 Canterbury Road',
                    city: 'London',
                    zip: 'SW1 1AA'
                  },
                  method: 'string'
                },
                sub_merchants: [
                  {
                    id: 'SUB12345',
                    product_category: 'Electronics',
                    number_of_trades: 500,
                    registration_date: '2023-01-15'
                  }
                ],
                discount_amount: 10
              },
              industry: {
                airline: [
                  {
                  ticket: {
                  number: '0742464639523',
                  issue_date: '2025-05-01',
                  issuing_carrier_code: '042',
                  travel_package_indicator: 'A',
                  travel_agency_name: 'Checkout Travel Agents',
                  travel_agency_code: '91114362'
                  },
                  passengers: [
                  {
                  first_name: 'John',
                  last_name: 'Smith',
                  date_of_birth: '1990-10-31',
                  address: {
                  country: 'GB'
                  }
                  }
                  ],
                  flight_leg_details: [
                  {
                  flight_number: 'BA1483',
                  carrier_code: 'BA',
                  class_of_travelling: 'W',
                  departure_airport: 'LHW',
                  departure_date: '2025-10-13',
                  departure_time: '18:30',
                  arrival_airport: 'JFK',
                  stop_over_code: 'X',
                  fare_basis_code: 'WUP14B'
                  }
                  ]
                  }
                ],
                accommodation: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line1: '123 High Street',
                      city: 'London',
                      state: 'Greater London',
                      country: 'GB',
                      zip: 'SW1 1AA'
                    },
                    number_of_rooms: 2,
                    guests: [
                      {
                        first_name: 'Jia',
                        last_name: 'Tsang',
                        date_of_birth: '1970-03-19'
                      }
                    ],
                    room: [
                      {
                        rate: 42.3,
                        number_of_nights: 5
                      }
                    ]
                  }
                ]
              }
            };

            nock('https://123456789.api.sandbox.checkout.com')
                .put('/payments/setups/pay_setup_123')
                .reply(200, response
            );

            // Act
            const id = "pay_setup_123";
            const request = {
              processing_channel_id: 'pc_q4dbxom5jbgudnjzjpz7j2z6uq',
              amount: 10000,
              currency: 'GBP',
              payment_type: 'Regular',
              reference: 'REF-0987-475',
              description: 'Set of three t-shirts.',
              payment_methods: {
                klarna: {
                  initialization: 'disabled',
                  account_holder: {
                    billing_address: {
                      country: 'GB'
                    }
                  },
                  payment_method_options: {
                    sdk: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      action: {
                        type: 'sdk',
                        client_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJzZXNzaW9uX2lkIiA6ICIw',
                        session_id: '0b1d9815-165e-42e2-8867-35bc03789e00'
                      }
                    }
                  }
                },
                stcpay: {
                  initialization: 'disabled',
                  otp: '123456',
                  payment_method_options: {
                    pay_in_full: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      action: {
                        type: 'otp'
                      }
                    }
                  }
                },
                tabby: {
                  initialization: 'disabled',
                  payment_method_options: {
                    installments: {
                      id: 'opt_drzstxerxrku3apsepshbslssu'
                    }
                  }
                },
                bizum: {
                  initialization: 'disabled',
                  payment_method_options: {
                    pay_now: {
                      id: 'opt_drzstxerxrku3apsepshbslssu'
                    }
                  }
                }
              },
              settings: {
                success_url: 'http://example.com/payments/success',
                failure_url: 'http://example.com/payments/fail'
              },
              customer: {
                email: {
                  address: 'johnsmith@example.com',
                  verified: true
                },
                name: 'John Smith',
                phone: {
                  country_code: '44',
                  number: '207 946 0000'
                },
                device: {
                  locale: 'en_GB'
                },
                merchant_account: {
                  id: '1234',
                  registration_date: '2023-05-01',
                  last_modified: '2023-05-01',
                  returning_customer: true,
                  first_transaction_date: '2023-09-15',
                  last_transaction_date: '2025-03-28',
                  total_order_count: 6,
                  last_payment_amount: 55.99
                }
              },
              order: {
                items: [
                  {
                    name: 'Battery Power Pack',
                    quantity: 1,
                    unit_price: 1000,
                    total_amount: 1000,
                    reference: 'BA67A',
                    discount_amount: 150,
                    url: 'http://shoppingsite.com/my-item',
                    image_url: 'http://shoppingsite.com/my-item/image',
                    type: 'digital'
                  }
                ],
                shipping: {
                  address: {
                    address_line1: '10 Canterbury Road',
                    city: 'London',
                    zip: 'SW1 1AA'
                  },
                  method: 'string'
                },
                sub_merchants: [
                  {
                    id: 'SUB12345',
                    product_category: 'Electronics',
                    number_of_trades: 500,
                    registration_date: '2023-01-15'
                  }
                ],
                discount_amount: 10
              },
              industry: {
                airline: [
                  {
                  ticket: {
                  number: '0742464639523',
                  issue_date: '2025-05-01',
                  issuing_carrier_code: '042',
                  travel_package_indicator: 'A',
                  travel_agency_name: 'Checkout Travel Agents',
                  travel_agency_code: '91114362'
                  },
                  passengers: [
                  {
                  first_name: 'John',
                  last_name: 'Smith',
                  date_of_birth: '1990-10-31',
                  address: {
                  country: 'GB'
                  }
                  }
                  ],
                  flight_leg_details: [
                  {
                  flight_number: 'BA1483',
                  carrier_code: 'BA',
                  class_of_travelling: 'W',
                  departure_airport: 'LHW',
                  departure_date: '2025-10-13',
                  departure_time: '18:30',
                  arrival_airport: 'JFK',
                  stop_over_code: 'X',
                  fare_basis_code: 'WUP14B'
                  }
                  ]
                  }
                ],
                accommodation: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line1: '123 High Street',
                      city: 'London',
                      state: 'Greater London',
                      country: 'GB',
                      zip: 'SW1 1AA'
                    },
                    number_of_rooms: 2,
                    guests: [
                      {
                        first_name: 'Jia',
                        last_name: 'Tsang',
                        date_of_birth: '1970-03-19'
                      }
                    ],
                    room: [
                      {
                        rate: 42.3,
                        number_of_nights: 5
                      }
                    ]
                  }
                ]
              }
            };
            
            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK, { subdomain: '123456789' });

            const result = await cko.paymentSetups.updateAPaymentSetup(id, request);

            // Assert
            expect(result).to.deep.equal(response);
        });

    });
    describe('Update payment setup - Bad Request (400)', () => {
        it('should throw ValidationError for malformed request', async () => {
            // Arrange
            var err = null;
            const response = {};

            nock('https://123456789.api.sandbox.checkout.com')
                .put('/payments/setups/pay_setup_123')
                .reply(400
            );

            // Act
            const id = "pay_setup_123";
            const request = {
              processing_channel_id: 'pc_q4dbxom5jbgudnjzjpz7j2z6uq',
              amount: 10000,
              currency: 'GBP',
              payment_type: 'Regular',
              reference: 'REF-0987-475',
              description: 'Set of three t-shirts.',
              payment_methods: {
                klarna: {
                  initialization: 'disabled',
                  account_holder: {
                    billing_address: {
                      country: 'GB'
                    }
                  },
                  payment_method_options: {
                    sdk: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      action: {
                        type: 'sdk',
                        client_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJzZXNzaW9uX2lkIiA6ICIw',
                        session_id: '0b1d9815-165e-42e2-8867-35bc03789e00'
                      }
                    }
                  }
                },
                stcpay: {
                  initialization: 'disabled',
                  otp: '123456',
                  payment_method_options: {
                    pay_in_full: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      action: {
                        type: 'otp'
                      }
                    }
                  }
                },
                tabby: {
                  initialization: 'disabled',
                  payment_method_options: {
                    installments: {
                      id: 'opt_drzstxerxrku3apsepshbslssu'
                    }
                  }
                },
                bizum: {
                  initialization: 'disabled',
                  payment_method_options: {
                    pay_now: {
                      id: 'opt_drzstxerxrku3apsepshbslssu'
                    }
                  }
                }
              },
              settings: {
                success_url: 'http://example.com/payments/success',
                failure_url: 'http://example.com/payments/fail'
              },
              customer: {
                email: {
                  address: 'johnsmith@example.com',
                  verified: true
                },
                name: 'John Smith',
                phone: {
                  country_code: '44',
                  number: '207 946 0000'
                },
                device: {
                  locale: 'en_GB'
                },
                merchant_account: {
                  id: '1234',
                  registration_date: '2023-05-01',
                  last_modified: '2023-05-01',
                  returning_customer: true,
                  first_transaction_date: '2023-09-15',
                  last_transaction_date: '2025-03-28',
                  total_order_count: 6,
                  last_payment_amount: 55.99
                }
              },
              order: {
                items: [
                  {
                    name: 'Battery Power Pack',
                    quantity: 1,
                    unit_price: 1000,
                    total_amount: 1000,
                    reference: 'BA67A',
                    discount_amount: 150,
                    url: 'http://shoppingsite.com/my-item',
                    image_url: 'http://shoppingsite.com/my-item/image',
                    type: 'digital'
                  }
                ],
                shipping: {
                  address: {
                    address_line1: '10 Canterbury Road',
                    city: 'London',
                    zip: 'SW1 1AA'
                  },
                  method: 'string'
                },
                sub_merchants: [
                  {
                    id: 'SUB12345',
                    product_category: 'Electronics',
                    number_of_trades: 500,
                    registration_date: '2023-01-15'
                  }
                ],
                discount_amount: 10
              },
              industry: {
                airline: [
                  {
                  ticket: {
                  number: '0742464639523',
                  issue_date: '2025-05-01',
                  issuing_carrier_code: '042',
                  travel_package_indicator: 'A',
                  travel_agency_name: 'Checkout Travel Agents',
                  travel_agency_code: '91114362'
                  },
                  passengers: [
                  {
                  first_name: 'John',
                  last_name: 'Smith',
                  date_of_birth: '1990-10-31',
                  address: {
                  country: 'GB'
                  }
                  }
                  ],
                  flight_leg_details: [
                  {
                  flight_number: 'BA1483',
                  carrier_code: 'BA',
                  class_of_travelling: 'W',
                  departure_airport: 'LHW',
                  departure_date: '2025-10-13',
                  departure_time: '18:30',
                  arrival_airport: 'JFK',
                  stop_over_code: 'X',
                  fare_basis_code: 'WUP14B'
                  }
                  ]
                  }
                ],
                accommodation: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line1: '123 High Street',
                      city: 'London',
                      state: 'Greater London',
                      country: 'GB',
                      zip: 'SW1 1AA'
                    },
                    number_of_rooms: 2,
                    guests: [
                      {
                        first_name: 'Jia',
                        last_name: 'Tsang',
                        date_of_birth: '1970-03-19'
                      }
                    ],
                    room: [
                      {
                        rate: 42.3,
                        number_of_nights: 5
                      }
                    ]
                  }
                ]
              }
            };

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK, { subdomain: '123456789' });

            try {
              const result = await cko.paymentSetups.updateAPaymentSetup(id, request);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(Error);
        });

    });
    describe('Update payment setup - Unauthorized (401)', () => {
        it('should throw AuthenticationError for invalid credentials', async () => {
            // Arrange
            var err = null;
            const response = {};

            nock('https://123456789.api.sandbox.checkout.com')
                .put('/payments/setups/pay_setup_123')
                .reply(401
            );

            // Act
            const id = "pay_setup_123";
            const request = {
              processing_channel_id: 'pc_q4dbxom5jbgudnjzjpz7j2z6uq',
              amount: 10000,
              currency: 'GBP',
              payment_type: 'Regular',
              reference: 'REF-0987-475',
              description: 'Set of three t-shirts.',
              payment_methods: {
                klarna: {
                  initialization: 'disabled',
                  account_holder: {
                    billing_address: {
                      country: 'GB'
                    }
                  },
                  payment_method_options: {
                    sdk: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      action: {
                        type: 'sdk',
                        client_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJzZXNzaW9uX2lkIiA6ICIw',
                        session_id: '0b1d9815-165e-42e2-8867-35bc03789e00'
                      }
                    }
                  }
                },
                stcpay: {
                  initialization: 'disabled',
                  otp: '123456',
                  payment_method_options: {
                    pay_in_full: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      action: {
                        type: 'otp'
                      }
                    }
                  }
                },
                tabby: {
                  initialization: 'disabled',
                  payment_method_options: {
                    installments: {
                      id: 'opt_drzstxerxrku3apsepshbslssu'
                    }
                  }
                },
                bizum: {
                  initialization: 'disabled',
                  payment_method_options: {
                    pay_now: {
                      id: 'opt_drzstxerxrku3apsepshbslssu'
                    }
                  }
                }
              },
              settings: {
                success_url: 'http://example.com/payments/success',
                failure_url: 'http://example.com/payments/fail'
              },
              customer: {
                email: {
                  address: 'johnsmith@example.com',
                  verified: true
                },
                name: 'John Smith',
                phone: {
                  country_code: '44',
                  number: '207 946 0000'
                },
                device: {
                  locale: 'en_GB'
                },
                merchant_account: {
                  id: '1234',
                  registration_date: '2023-05-01',
                  last_modified: '2023-05-01',
                  returning_customer: true,
                  first_transaction_date: '2023-09-15',
                  last_transaction_date: '2025-03-28',
                  total_order_count: 6,
                  last_payment_amount: 55.99
                }
              },
              order: {
                items: [
                  {
                    name: 'Battery Power Pack',
                    quantity: 1,
                    unit_price: 1000,
                    total_amount: 1000,
                    reference: 'BA67A',
                    discount_amount: 150,
                    url: 'http://shoppingsite.com/my-item',
                    image_url: 'http://shoppingsite.com/my-item/image',
                    type: 'digital'
                  }
                ],
                shipping: {
                  address: {
                    address_line1: '10 Canterbury Road',
                    city: 'London',
                    zip: 'SW1 1AA'
                  },
                  method: 'string'
                },
                sub_merchants: [
                  {
                    id: 'SUB12345',
                    product_category: 'Electronics',
                    number_of_trades: 500,
                    registration_date: '2023-01-15'
                  }
                ],
                discount_amount: 10
              },
              industry: {
                airline: [
                  {
                  ticket: {
                  number: '0742464639523',
                  issue_date: '2025-05-01',
                  issuing_carrier_code: '042',
                  travel_package_indicator: 'A',
                  travel_agency_name: 'Checkout Travel Agents',
                  travel_agency_code: '91114362'
                  },
                  passengers: [
                  {
                  first_name: 'John',
                  last_name: 'Smith',
                  date_of_birth: '1990-10-31',
                  address: {
                  country: 'GB'
                  }
                  }
                  ],
                  flight_leg_details: [
                  {
                  flight_number: 'BA1483',
                  carrier_code: 'BA',
                  class_of_travelling: 'W',
                  departure_airport: 'LHW',
                  departure_date: '2025-10-13',
                  departure_time: '18:30',
                  arrival_airport: 'JFK',
                  stop_over_code: 'X',
                  fare_basis_code: 'WUP14B'
                  }
                  ]
                  }
                ],
                accommodation: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line1: '123 High Street',
                      city: 'London',
                      state: 'Greater London',
                      country: 'GB',
                      zip: 'SW1 1AA'
                    },
                    number_of_rooms: 2,
                    guests: [
                      {
                        first_name: 'Jia',
                        last_name: 'Tsang',
                        date_of_birth: '1970-03-19'
                      }
                    ],
                    room: [
                      {
                        rate: 42.3,
                        number_of_nights: 5
                      }
                    ]
                  }
                ]
              }
            };

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK, { subdomain: '123456789' });

            try {
              const result = await cko.paymentSetups.updateAPaymentSetup(id, request);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(AuthenticationError);
        });

    });
    describe('Update payment setup - Forbidden (403)', () => {
        it('should throw ActionNotAllowed for insufficient permissions', async () => {
            // Arrange
            var err = null;
            const response = {};

            nock('https://123456789.api.sandbox.checkout.com')
                .put('/payments/setups/pay_setup_123')
                .reply(403
            );

            // Act
            const id = "pay_setup_123";
            const request = {
              processing_channel_id: 'pc_q4dbxom5jbgudnjzjpz7j2z6uq',
              amount: 10000,
              currency: 'GBP',
              payment_type: 'Regular',
              reference: 'REF-0987-475',
              description: 'Set of three t-shirts.',
              payment_methods: {
                klarna: {
                  initialization: 'disabled',
                  account_holder: {
                    billing_address: {
                      country: 'GB'
                    }
                  },
                  payment_method_options: {
                    sdk: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      action: {
                        type: 'sdk',
                        client_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJzZXNzaW9uX2lkIiA6ICIw',
                        session_id: '0b1d9815-165e-42e2-8867-35bc03789e00'
                      }
                    }
                  }
                },
                stcpay: {
                  initialization: 'disabled',
                  otp: '123456',
                  payment_method_options: {
                    pay_in_full: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      action: {
                        type: 'otp'
                      }
                    }
                  }
                },
                tabby: {
                  initialization: 'disabled',
                  payment_method_options: {
                    installments: {
                      id: 'opt_drzstxerxrku3apsepshbslssu'
                    }
                  }
                },
                bizum: {
                  initialization: 'disabled',
                  payment_method_options: {
                    pay_now: {
                      id: 'opt_drzstxerxrku3apsepshbslssu'
                    }
                  }
                }
              },
              settings: {
                success_url: 'http://example.com/payments/success',
                failure_url: 'http://example.com/payments/fail'
              },
              customer: {
                email: {
                  address: 'johnsmith@example.com',
                  verified: true
                },
                name: 'John Smith',
                phone: {
                  country_code: '44',
                  number: '207 946 0000'
                },
                device: {
                  locale: 'en_GB'
                },
                merchant_account: {
                  id: '1234',
                  registration_date: '2023-05-01',
                  last_modified: '2023-05-01',
                  returning_customer: true,
                  first_transaction_date: '2023-09-15',
                  last_transaction_date: '2025-03-28',
                  total_order_count: 6,
                  last_payment_amount: 55.99
                }
              },
              order: {
                items: [
                  {
                    name: 'Battery Power Pack',
                    quantity: 1,
                    unit_price: 1000,
                    total_amount: 1000,
                    reference: 'BA67A',
                    discount_amount: 150,
                    url: 'http://shoppingsite.com/my-item',
                    image_url: 'http://shoppingsite.com/my-item/image',
                    type: 'digital'
                  }
                ],
                shipping: {
                  address: {
                    address_line1: '10 Canterbury Road',
                    city: 'London',
                    zip: 'SW1 1AA'
                  },
                  method: 'string'
                },
                sub_merchants: [
                  {
                    id: 'SUB12345',
                    product_category: 'Electronics',
                    number_of_trades: 500,
                    registration_date: '2023-01-15'
                  }
                ],
                discount_amount: 10
              },
              industry: {
                airline: [
                  {
                  ticket: {
                  number: '0742464639523',
                  issue_date: '2025-05-01',
                  issuing_carrier_code: '042',
                  travel_package_indicator: 'A',
                  travel_agency_name: 'Checkout Travel Agents',
                  travel_agency_code: '91114362'
                  },
                  passengers: [
                  {
                  first_name: 'John',
                  last_name: 'Smith',
                  date_of_birth: '1990-10-31',
                  address: {
                  country: 'GB'
                  }
                  }
                  ],
                  flight_leg_details: [
                  {
                  flight_number: 'BA1483',
                  carrier_code: 'BA',
                  class_of_travelling: 'W',
                  departure_airport: 'LHW',
                  departure_date: '2025-10-13',
                  departure_time: '18:30',
                  arrival_airport: 'JFK',
                  stop_over_code: 'X',
                  fare_basis_code: 'WUP14B'
                  }
                  ]
                  }
                ],
                accommodation: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line1: '123 High Street',
                      city: 'London',
                      state: 'Greater London',
                      country: 'GB',
                      zip: 'SW1 1AA'
                    },
                    number_of_rooms: 2,
                    guests: [
                      {
                        first_name: 'Jia',
                        last_name: 'Tsang',
                        date_of_birth: '1970-03-19'
                      }
                    ],
                    room: [
                      {
                        rate: 42.3,
                        number_of_nights: 5
                      }
                    ]
                  }
                ]
              }
            };

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK, { subdomain: '123456789' });

            try {
              const result = await cko.paymentSetups.updateAPaymentSetup(id, request);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(ActionNotAllowed);
        });

    });
    describe('Update payment setup - Validation Error (422)', () => {
        it('should throw ValidationError for invalid payment data', async () => {
            // Arrange
            var err = null;
            const response = {
              request_id: '0HL80RJLS76I7',
              error_type: 'request_invalid',
              error_codes: [
                'amount_required'
              ]
            };

            nock('https://123456789.api.sandbox.checkout.com')
                .put('/payments/setups/pay_setup_123')
                .reply(422
            );

            // Act
            const id = "pay_setup_123";
            const request = {
              processing_channel_id: 'pc_q4dbxom5jbgudnjzjpz7j2z6uq',
              amount: 10000,
              currency: 'GBP',
              payment_type: 'Regular',
              reference: 'REF-0987-475',
              description: 'Set of three t-shirts.',
              payment_methods: {
                klarna: {
                  initialization: 'disabled',
                  account_holder: {
                    billing_address: {
                      country: 'GB'
                    }
                  },
                  payment_method_options: {
                    sdk: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      action: {
                        type: 'sdk',
                        client_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJzZXNzaW9uX2lkIiA6ICIw',
                        session_id: '0b1d9815-165e-42e2-8867-35bc03789e00'
                      }
                    }
                  }
                },
                stcpay: {
                  initialization: 'disabled',
                  otp: '123456',
                  payment_method_options: {
                    pay_in_full: {
                      id: 'opt_drzstxerxrku3apsepshbslssu',
                      action: {
                        type: 'otp'
                      }
                    }
                  }
                },
                tabby: {
                  initialization: 'disabled',
                  payment_method_options: {
                    installments: {
                      id: 'opt_drzstxerxrku3apsepshbslssu'
                    }
                  }
                },
                bizum: {
                  initialization: 'disabled',
                  payment_method_options: {
                    pay_now: {
                      id: 'opt_drzstxerxrku3apsepshbslssu'
                    }
                  }
                }
              },
              settings: {
                success_url: 'http://example.com/payments/success',
                failure_url: 'http://example.com/payments/fail'
              },
              customer: {
                email: {
                  address: 'johnsmith@example.com',
                  verified: true
                },
                name: 'John Smith',
                phone: {
                  country_code: '44',
                  number: '207 946 0000'
                },
                device: {
                  locale: 'en_GB'
                },
                merchant_account: {
                  id: '1234',
                  registration_date: '2023-05-01',
                  last_modified: '2023-05-01',
                  returning_customer: true,
                  first_transaction_date: '2023-09-15',
                  last_transaction_date: '2025-03-28',
                  total_order_count: 6,
                  last_payment_amount: 55.99
                }
              },
              order: {
                items: [
                  {
                    name: 'Battery Power Pack',
                    quantity: 1,
                    unit_price: 1000,
                    total_amount: 1000,
                    reference: 'BA67A',
                    discount_amount: 150,
                    url: 'http://shoppingsite.com/my-item',
                    image_url: 'http://shoppingsite.com/my-item/image',
                    type: 'digital'
                  }
                ],
                shipping: {
                  address: {
                    address_line1: '10 Canterbury Road',
                    city: 'London',
                    zip: 'SW1 1AA'
                  },
                  method: 'string'
                },
                sub_merchants: [
                  {
                    id: 'SUB12345',
                    product_category: 'Electronics',
                    number_of_trades: 500,
                    registration_date: '2023-01-15'
                  }
                ],
                discount_amount: 10
              },
              industry: {
                airline: [
                  {
                  ticket: {
                  number: '0742464639523',
                  issue_date: '2025-05-01',
                  issuing_carrier_code: '042',
                  travel_package_indicator: 'A',
                  travel_agency_name: 'Checkout Travel Agents',
                  travel_agency_code: '91114362'
                  },
                  passengers: [
                  {
                  first_name: 'John',
                  last_name: 'Smith',
                  date_of_birth: '1990-10-31',
                  address: {
                  country: 'GB'
                  }
                  }
                  ],
                  flight_leg_details: [
                  {
                  flight_number: 'BA1483',
                  carrier_code: 'BA',
                  class_of_travelling: 'W',
                  departure_airport: 'LHW',
                  departure_date: '2025-10-13',
                  departure_time: '18:30',
                  arrival_airport: 'JFK',
                  stop_over_code: 'X',
                  fare_basis_code: 'WUP14B'
                  }
                  ]
                  }
                ],
                accommodation: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line1: '123 High Street',
                      city: 'London',
                      state: 'Greater London',
                      country: 'GB',
                      zip: 'SW1 1AA'
                    },
                    number_of_rooms: 2,
                    guests: [
                      {
                        first_name: 'Jia',
                        last_name: 'Tsang',
                        date_of_birth: '1970-03-19'
                      }
                    ],
                    room: [
                      {
                        rate: 42.3,
                        number_of_nights: 5
                      }
                    ]
                  }
                ]
              }
            };

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK, { subdomain: '123456789' });

            try {
              const result = await cko.paymentSetups.updateAPaymentSetup(id, request);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(ValidationError);
        });

    });

    describe('Confirm payment setup - End-to-end flow', () => {
        it('should successfully confirm payment setup with payment method name', async () => {
            nock('https://123456789.api.sandbox.checkout.com')
                .post('/payments/setups/psu_abc123/confirm/tabby')
                .reply(200, {
                    id: "psu_abc123",
                    status: "confirmed"
                });

            const cko = new Checkout('sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808', { subdomain: '123456789' });
            const response = await cko.paymentSetups.confirmAPaymentSetup("psu_abc123", "tabby");

            expect(response).to.not.be.null;
            expect(response.status).to.equal("confirmed");
        });

        it('should build the confirm URL from id and payment_method_name (not payment_method_option_id)', async () => {
            // Arrange: the path param is `payment_method_name` in swagger, e.g. "tabby"
            const scope = nock('https://123456789.api.sandbox.checkout.com')
                .post('/payments/setups/pay_setup_123/confirm/tabby')
                .reply(200, { id: 'pay_setup_123', status: 'confirmed' });

            const cko = new Checkout('sk_test_xxx', { subdomain: '123456789' });

            // Act
            const result = await cko.paymentSetups.confirmAPaymentSetup('pay_setup_123', 'tabby');

            // Assert
            expect(scope.isDone()).to.be.true;
            expect(result).to.deep.equal({ id: 'pay_setup_123', status: 'confirmed' });
        });
    });

    describe('Create payment setup - billing_descriptor, presentment_details and terminal', () => {
        it('should send and receive billing_descriptor, presentment_details and terminal', async () => {
            // Arrange
            const request = {
                processing_channel_id: 'pc_q4dbxom5jbgudnjzjpz7j2z6uq',
                amount: 10000,
                currency: 'GBP',
                payment_type: 'Regular',
                billing_descriptor: {
                    name: 'Checkout.com',
                    city: 'London',
                    reference: 'REF-0987-475'
                },
                presentment_details: {
                    amount: 10000,
                    currency: 'GBP'
                },
                terminal: {
                    id: 'TID12345',
                    local_date_time: '2026-01-01T10:00:00Z'
                }
            };

            const response = {
                id: 'psu_wmakpe4nrza3rv2vhtwzoszja',
                processing_channel_id: 'pc_q4dbxom5jbgudnjzjpz7j2z6uq',
                amount: 10000,
                currency: 'GBP',
                payment_type: 'Regular',
                billing_descriptor: {
                    name: 'Checkout.com',
                    city: 'London',
                    reference: 'REF-0987-475'
                },
                presentment_details: {
                    amount: 10000,
                    currency: 'GBP'
                },
                terminal: {
                    id: 'TID12345',
                    local_date_time: '2026-01-01T10:00:00Z'
                }
            };

            nock('https://123456789.api.sandbox.checkout.com')
                .post('/payments/setups', request)
                .reply(200, response);

            // Act
            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK, { subdomain: '123456789' });
            const result = await cko.paymentSetups.createAPaymentSetup(request);

            // Assert
            expect(result).to.deep.equal(response);
            expect(result.billing_descriptor).to.deep.equal(request.billing_descriptor);
            expect(result.presentment_details).to.deep.equal(request.presentment_details);
            expect(result.terminal).to.deep.equal(request.terminal);
        });
    });

    describe('Cash App Pay, customer device and customer identifiers', () => {
        const host = 'https://123456789.api.sandbox.checkout.com';

        const cashAppRequest = {
            processing_channel_id: 'pc_aaaaaaaaaaaaaaaaaaaaaaaaaa',
            amount: 1000,
            currency: 'USD',
            payment_methods: {
                cashapp: {
                    initialization: 'enabled',
                    customer_profile_sharing: true
                }
            },
            customer: {
                id: 'cus_123456789',
                country: 'GB',
                tax_number: 'GB123456789',
                device: {
                    locale: 'en_US',
                    fingerprint: 'fp_abc123xyz',
                    ipv4: '203.0.113.0',
                    ipv6: '2001:db8:85a3::8a2e:370:7334',
                    client: 'web',
                    os: 'android'
                }
            }
        };

        const cashAppResponse = {
            status: 'action_required',
            flags: [],
            initialization: 'enabled',
            customer_profile_sharing: true,
            reference: 'ORDER-99',
            action: {
                type: 'redirect',
                redirect_url: 'https://sandbox.api.cash.app/customer-request/v1/requests/GRR_f5xg6wrxhtv3p4w24g0wrexa/interstitial?validity_token=bap03y'
            },
            customer_profile: {
                customer_id: 'CST_AYVkuLzfsRqEhf4OyQFxQNv22m7IjNFjO6f2J5CDE2nxAC4-21wJ2H8_2kvsdIsDZMN4',
                cashtag: '$CASHTAG_C_TOKEN',
                reference_id: 'value',
                full_name: 'John Middle Doe',
                given_name: 'John',
                middle_name: 'Middle',
                family_name: 'Doe',
                suffix: 'Jr.',
                birth_date: '1990-01-01T00:00:00.0000000',
                address: {
                    address_line_1: '123 Main St',
                    address_line_2: 'Apt 2',
                    address_line_3: 'Floor 3',
                    locality: 'Springfield',
                    sublocality: 'Downtown',
                    administrative_district_level_1: 'IL',
                    postal_code: '62701',
                    country: 'US'
                },
                phone_number: '5555555555',
                email_address: 'cash@cash.com',
                customer_since: '1970-01-18T12:46:04.8000000+00:00'
            }
        };

        const setupResponse = {
            id: 'psu_wmakpe4nrza3rv2vhtwzoszja',
            processing_channel_id: 'pc_aaaaaaaaaaaaaaaaaaaaaaaaaa',
            amount: 1000,
            currency: 'USD',
            customer: cashAppRequest.customer,
            payment_methods: {
                cashapp: cashAppResponse
            }
        };

        it('should send payment_methods.cashapp, the device fields and the customer identifiers unchanged on create', async () => {
            // Arrange
            let received;
            const scope = nock(host)
                .post('/payments/setups', (body) => {
                    received = body;
                    return true;
                })
                .reply(200, setupResponse);

            const cko = new Checkout('sk_test_xxx', { subdomain: '123456789' });

            // Act
            const result = await cko.paymentSetups.createAPaymentSetup(cashAppRequest);

            // Assert
            expect(scope.isDone()).to.be.true;
            expect(received).to.deep.equal(cashAppRequest);
            const wire = JSON.stringify(received);
            expect(wire).to.include('"cashapp":{');
            expect(wire).to.not.include('cash_app');
            expect(wire).to.not.include('cashApp');
            expect(wire).to.include('"customer_profile_sharing":true');
            expect(wire).to.not.include('customerProfileSharing');
            expect(received.payment_methods.cashapp).to.deep.equal({
                initialization: 'enabled',
                customer_profile_sharing: true
            });
            expect(received.customer.device).to.deep.equal({
                locale: 'en_US',
                fingerprint: 'fp_abc123xyz',
                ipv4: '203.0.113.0',
                ipv6: '2001:db8:85a3::8a2e:370:7334',
                client: 'web',
                os: 'android'
            });
            expect(received.customer.id).to.equal('cus_123456789');
            expect(received.customer.country).to.equal('GB');
            expect(received.customer.tax_number).to.equal('GB123456789');
            expect(wire).to.not.include('taxNumber');
            expect(result).to.deep.equal(setupResponse);
        });

        it('should send the same cashapp, device and customer body unchanged on update', async () => {
            // Arrange
            let received;
            const scope = nock(host)
                .put('/payments/setups/psu_wmakpe4nrza3rv2vhtwzoszja', (body) => {
                    received = body;
                    return true;
                })
                .reply(200, setupResponse);

            const cko = new Checkout('sk_test_xxx', { subdomain: '123456789' });

            // Act
            const result = await cko.paymentSetups.updateAPaymentSetup('psu_wmakpe4nrza3rv2vhtwzoszja', cashAppRequest);

            // Assert
            expect(scope.isDone()).to.be.true;
            expect(received).to.deep.equal(cashAppRequest);
            expect(JSON.stringify(received)).to.include('"cashapp":{');
            expect(result).to.deep.equal(setupResponse);
        });

        it('should send every customer.device client and os value as given', async () => {
            const cko = new Checkout('sk_test_xxx', { subdomain: '123456789' });
            const devices = [
                { client: 'web', os: 'android' },
                { client: 'mobile_web', os: 'ios' },
                { client: 'app', os: 'android' }
            ];

            for (const device of devices) {
                // Arrange
                let received;
                const scope = nock(host)
                    .post('/payments/setups', (body) => {
                        received = body;
                        return true;
                    })
                    .reply(200, { id: 'psu_wmakpe4nrza3rv2vhtwzoszja' });

                // Act
                await cko.paymentSetups.createAPaymentSetup({
                    processing_channel_id: 'pc_aaaaaaaaaaaaaaaaaaaaaaaaaa',
                    amount: 1000,
                    currency: 'USD',
                    customer: { device }
                });

                // Assert
                expect(scope.isDone()).to.be.true;
                expect(received.customer.device).to.deep.equal(device);
            }
        });

        it('should send exactly the locale when the device has only a locale', async () => {
            // Arrange
            let received;
            nock(host)
                .post('/payments/setups', (body) => {
                    received = body;
                    return true;
                })
                .reply(200, { id: 'psu_wmakpe4nrza3rv2vhtwzoszja' });

            const cko = new Checkout('sk_test_xxx', { subdomain: '123456789' });

            // Act
            await cko.paymentSetups.createAPaymentSetup({
                processing_channel_id: 'pc_aaaaaaaaaaaaaaaaaaaaaaaaaa',
                amount: 1000,
                currency: 'USD',
                customer: { device: { locale: 'en_US' } }
            });

            // Assert
            expect(JSON.stringify(received.customer.device)).to.equal('{"locale":"en_US"}');
        });

        it('should read the cashapp action, reference, customer_profile and customer fields from get', async () => {
            // Arrange
            nock(host)
                .get('/payments/setups/psu_wmakpe4nrza3rv2vhtwzoszja')
                .reply(200, setupResponse);

            const cko = new Checkout('sk_test_xxx', { subdomain: '123456789' });

            // Act
            const result = await cko.paymentSetups.getAPaymentSetup('psu_wmakpe4nrza3rv2vhtwzoszja');

            // Assert
            expect(result).to.deep.equal(setupResponse);
            const cashapp = result.payment_methods.cashapp;
            expect(cashapp.status).to.equal('action_required');
            expect(cashapp.flags).to.deep.equal([]);
            expect(cashapp.initialization).to.equal('enabled');
            expect(cashapp.customer_profile_sharing).to.be.true;
            expect(cashapp.reference).to.equal('ORDER-99');
            expect(cashapp.action.type).to.equal('redirect');
            expect(cashapp.action.redirect_url).to.equal(
                'https://sandbox.api.cash.app/customer-request/v1/requests/GRR_f5xg6wrxhtv3p4w24g0wrexa/interstitial?validity_token=bap03y'
            );

            const profile = cashapp.customer_profile;
            expect(Object.keys(profile)).to.have.lengthOf(13);
            expect(profile.customer_id).to.equal('CST_AYVkuLzfsRqEhf4OyQFxQNv22m7IjNFjO6f2J5CDE2nxAC4-21wJ2H8_2kvsdIsDZMN4');
            expect(profile.cashtag).to.equal('$CASHTAG_C_TOKEN');
            expect(profile.reference_id).to.equal('value');
            expect(profile.full_name).to.equal('John Middle Doe');
            expect(profile.given_name).to.equal('John');
            expect(profile.middle_name).to.equal('Middle');
            expect(profile.family_name).to.equal('Doe');
            expect(profile.suffix).to.equal('Jr.');
            expect(profile.birth_date).to.equal('1990-01-01T00:00:00.0000000');
            expect(profile.phone_number).to.equal('5555555555');
            expect(profile.email_address).to.equal('cash@cash.com');
            expect(profile.customer_since).to.equal('1970-01-18T12:46:04.8000000+00:00');

            expect(Object.keys(profile.address)).to.have.lengthOf(8);
            expect(profile.address.address_line_1).to.equal('123 Main St');
            expect(profile.address.address_line_2).to.equal('Apt 2');
            expect(profile.address.address_line_3).to.equal('Floor 3');
            expect(profile.address.locality).to.equal('Springfield');
            expect(profile.address.sublocality).to.equal('Downtown');
            expect(profile.address.administrative_district_level_1).to.equal('IL');
            expect(profile.address.postal_code).to.equal('62701');
            expect(profile.address.country).to.equal('US');

            expect(result.customer.device).to.deep.equal(cashAppRequest.customer.device);
            expect(result.customer.id).to.equal('cus_123456789');
            expect(result.customer.country).to.equal('GB');
            expect(result.customer.tax_number).to.equal('GB123456789');
        });

        it('should confirm with "cashapp" on payments/setups/{id}/confirm/cashapp and read the cashapp response', async () => {
            // Arrange
            const scope = nock(host)
                .post('/payments/setups/psu_wmakpe4nrza3rv2vhtwzoszja/confirm/cashapp')
                .reply(200, setupResponse);

            const cko = new Checkout('sk_test_xxx', { subdomain: '123456789' });

            // Act
            const result = await cko.paymentSetups.confirmAPaymentSetup('psu_wmakpe4nrza3rv2vhtwzoszja', 'cashapp');

            // Assert
            expect(scope.isDone()).to.be.true;
            expect(result.payment_methods.cashapp).to.deep.equal(cashAppResponse);
            expect(result.payment_methods.cashapp.action.redirect_url).to.equal(cashAppResponse.action.redirect_url);
        });

        it('should send and read the customer spec example with id, country and tax_number', async () => {
            // Arrange
            const customer = {
                id: 'cus_123456789',
                country: 'GB',
                email: { address: 'johnsmith@example.com', verified: true },
                name: 'John Smith',
                tax_number: 'GB123456789',
                phone: { country_code: '+44', number: '207 946 0000' },
                device: { locale: 'en_GB' }
            };
            const request = {
                processing_channel_id: 'pc_aaaaaaaaaaaaaaaaaaaaaaaaaa',
                amount: 1000,
                currency: 'GBP',
                customer
            };
            let received;
            nock(host)
                .post('/payments/setups', (body) => {
                    received = body;
                    return true;
                })
                .reply(200, { id: 'psu_wmakpe4nrza3rv2vhtwzoszja', ...request });

            const cko = new Checkout('sk_test_xxx', { subdomain: '123456789' });

            // Act
            const result = await cko.paymentSetups.createAPaymentSetup(request);

            // Assert
            expect(received.customer).to.deep.equal(customer);
            expect(result.customer).to.deep.equal(customer);
            expect(result.customer.id).to.equal('cus_123456789');
            expect(result.customer.country).to.equal('GB');
            expect(result.customer.tax_number).to.equal('GB123456789');
        });
    });
});
