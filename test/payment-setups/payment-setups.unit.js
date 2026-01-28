import { AuthenticationError, ActionNotAllowed, ValidationError } from '../../src/services/errors.js';
import Checkout from '../../src/index.js';
import { expect } from 'chai';
import nock from 'nock';

describe('Unit::Payment-Setups', () => {
    describe('ConfirmAPaymentSetup response 201', () => {
        it('should match response schema 1', async () => {
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
                  href: 'https://api.sandbox.checkout.com/payments/pay_mbabizu24mvu3mela5njyhpit4'
                },
                actions: {
                  href: 'https://api.sandbox.checkout.com/payments/pay_mbabizu24mvu3mela5njyhpit4/actions'
                },
                void: {
                  href: 'https://api.sandbox.checkout.com/payments/pay_mbabizu24mvu3mela5njyhpit4/voids'
                },
                capture: {
                  href: 'https://api.sandbox.checkout.com/payments/pay_mbabizu24mvu3mela5njyhpit4/captures'
                }
              }
            };

            nock('https://api.sandbox.checkout.com')
                .post('/payments/setups/pay_setup_123/confirm/pmo_456')
                .reply(201, response
            );

            // Act
            const id = "pay_setup_123";
            const payment_method_option_id = "pmo_456";

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK);

            const result = await cko.paymentSetups.confirmAPaymentSetup(id, payment_method_option_id);

            // Assert
            expect(result).to.deep.equal(response);
        });

    });
    describe('ConfirmAPaymentSetup response 400', () => {
        it('should match response schema 2', async () => {
            // Arrange
            var err = null;
            const response = {};

            nock('https://api.sandbox.checkout.com')
                .post('/payments/setups/pay_setup_123/confirm/pmo_456')
                .reply(400
            );

            // Act
            const id = "pay_setup_123";
            const payment_method_option_id = "pmo_456";

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK);

            try
            {
              const result = await cko.paymentSetups.confirmAPaymentSetup(id, payment_method_option_id);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(Error);
        });

    });
    describe('ConfirmAPaymentSetup response 401', () => {
        it('should match response schema 3', async () => {
            // Arrange
            var err = null;
            const response = {};

            nock('https://api.sandbox.checkout.com')
                .post('/payments/setups/pay_setup_123/confirm/pmo_456')
                .reply(401
            );

            // Act
            const id = "pay_setup_123";
            const payment_method_option_id = "pmo_456";

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK);

            try
            {
              const id = "pay_setup_123";
              const payment_method_option_id = "pmo_456";
              const result = await cko.paymentSetups.confirmAPaymentSetup(id, payment_method_option_id); 
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(AuthenticationError);
        });

    });
    describe('ConfirmAPaymentSetup response 403', () => {
        it('should match response schema 4', async () => {
            // Arrange
            var err = null;
            const response = {};

            nock('https://api.sandbox.checkout.com')
                .post('/payments/setups/pay_setup_123/confirm/pmo_456')
                .reply(403
            );

            // Act
            const id = "pay_setup_123";
            const payment_method_option_id = "pmo_456";

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK);

            try
            {
              const result = await cko.paymentSetups.confirmAPaymentSetup(id, payment_method_option_id);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(ActionNotAllowed);
        });

    });
    describe('ConfirmAPaymentSetup response 422', () => {
        it('should match response schema 5', async () => {
            // Arrange
            var err = null;
            const response = {
              request_id: '0HL80RJLS76I7',
              error_type: 'request_invalid',
              error_codes: [
                'amount_required'
              ]
            };

            nock('https://api.sandbox.checkout.com')
                .post('/payments/setups/pay_setup_123/confirm/pmo_456')
                .reply(422
            );

            // Act
            const id = "pay_setup_123";
            const payment_method_option_id = "pmo_456";

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK);

            try
            {
              const result = await cko.paymentSetups.confirmAPaymentSetup(id, payment_method_option_id);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(ValidationError);
        });

    });

    describe('CreateAPaymentSetup response 200', () => {
        it('should match response schema 1', async () => {
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
                    address_line_1: '10 Canterbury Road',
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
                airline_data: {
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
                },
                accommodation_data: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line_1: '123 High Street',
                      address_line_2: 'Flat 456',
                      city: 'London',
                      state: 'Greater London',
                      country: 'United Kingdom',
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

            nock('https://api.sandbox.checkout.com')
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
                    address_line_1: '10 Canterbury Road',
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
                airline_data: {
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
                },
                accommodation_data: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line_1: '123 High Street',
                      address_line_2: 'Flat 456',
                      city: 'London',
                      state: 'Greater London',
                      country: 'United Kingdom',
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
            const cko = new Checkout(SK);

            const result = await cko.paymentSetups.createAPaymentSetup(request);

            // Assert
            expect(result).to.deep.equal(response);
        });

    });
    describe('CreateAPaymentSetup response 400', () => {
        it('should match response schema 2', async () => {
            // Arrange
            var err = null;
            const response = {};

            nock('https://api.sandbox.checkout.com')
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
                    address_line_1: '10 Canterbury Road',
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
                airline_data: {
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
                },
                accommodation_data: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line_1: '123 High Street',
                      address_line_2: 'Flat 456',
                      city: 'London',
                      state: 'Greater London',
                      country: 'United Kingdom',
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
            const cko = new Checkout(SK);

            try {
              const result = await cko.paymentSetups.createAPaymentSetup(request);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(Error);
        });

    });
    describe('CreateAPaymentSetup response 401', () => {
        it('should match response schema 3', async () => {
            // Arrange
            var err = null;
            const response = {};

            nock('https://api.sandbox.checkout.com')
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
                    address_line_1: '10 Canterbury Road',
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
                airline_data: {
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
                },
                accommodation_data: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line_1: '123 High Street',
                      address_line_2: 'Flat 456',
                      city: 'London',
                      state: 'Greater London',
                      country: 'United Kingdom',
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
            const cko = new Checkout(SK);

            try {
              const result = await cko.paymentSetups.createAPaymentSetup(request);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(AuthenticationError);
        });

    });
    describe('CreateAPaymentSetup response 403', () => {
        it('should match response schema 4', async () => {
            // Arrange
            var err = null;
            const response = {};

            nock('https://api.sandbox.checkout.com')
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
                    address_line_1: '10 Canterbury Road',
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
                airline_data: {
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
                },
                accommodation_data: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line_1: '123 High Street',
                      address_line_2: 'Flat 456',
                      city: 'London',
                      state: 'Greater London',
                      country: 'United Kingdom',
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
            const cko = new Checkout(SK);

            try {
              const result = await cko.paymentSetups.createAPaymentSetup(request);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(ActionNotAllowed);
        });

    });
    describe('CreateAPaymentSetup response 422', () => {
        it('should match response schema 5', async () => {
            // Arrange
            var err = null;
            const response = {
              request_id: '0HL80RJLS76I7',
              error_type: 'request_invalid',
              error_codes: [
                'amount_required'
              ]
            };

            nock('https://api.sandbox.checkout.com')
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
                    address_line_1: '10 Canterbury Road',
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
                airline_data: {
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
                },
                accommodation_data: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line_1: '123 High Street',
                      address_line_2: 'Flat 456',
                      city: 'London',
                      state: 'Greater London',
                      country: 'United Kingdom',
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
            const cko = new Checkout(SK);

            try {
              const result = await cko.paymentSetups.createAPaymentSetup(request);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(ValidationError);
        });

    });

    describe('GetAPaymentSetup response 200', () => {
        it('should match response schema 1', async () => {
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
                    address_line_1: '10 Canterbury Road',
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
                airline_data: {
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
                },
                accommodation_data: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line_1: '123 High Street',
                      address_line_2: 'Flat 456',
                      city: 'London',
                      state: 'Greater London',
                      country: 'United Kingdom',
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

            nock('https://api.sandbox.checkout.com')
                .get('/payments/setups/pay_setup_123')
                .reply(200, response
            );

            // Act
            const id = "pay_setup_123";
            const request = {};

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK);

            const result = await cko.paymentSetups.getAPaymentSetup(id);

            // Assert
            expect(result).to.deep.equal(response);
        });

    });
    describe('GetAPaymentSetup response 401', () => {
        it('should match response schema 2', async () => {
            // Arrange
            var err = null;
            const response = {};

            nock('https://api.sandbox.checkout.com')
                .get('/payments/setups/pay_setup_123')
                .reply(401
            );

            // Act
            const id = "pay_setup_123";

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK);

            try {
              const result = await cko.paymentSetups.getAPaymentSetup(id);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(AuthenticationError);
        });

    });
    describe('GetAPaymentSetup response 403', () => {
        it('should match response schema 3', async () => {
            // Arrange
            var err = null;
            const response = {};

            nock('https://api.sandbox.checkout.com')
                .get('/payments/setups/pay_setup_123')
                .reply(403
            );

            // Act
            const id = "pay_setup_123";

            const SK = 'sk_test_xxx';
            const cko = new Checkout(SK);

            try {
              const result = await cko.paymentSetups.getAPaymentSetup(id);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(ActionNotAllowed);
        });

    });

    describe('UpdateAPaymentSetup response 200', () => {
        it('should match response schema 1', async () => {
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
                    address_line_1: '10 Canterbury Road',
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
                airline_data: {
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
                },
                accommodation_data: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line_1: '123 High Street',
                      address_line_2: 'Flat 456',
                      city: 'London',
                      state: 'Greater London',
                      country: 'United Kingdom',
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

            nock('https://api.sandbox.checkout.com')
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
                    address_line_1: '10 Canterbury Road',
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
                airline_data: {
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
                },
                accommodation_data: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line_1: '123 High Street',
                      address_line_2: 'Flat 456',
                      city: 'London',
                      state: 'Greater London',
                      country: 'United Kingdom',
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
            const cko = new Checkout(SK);

            const result = await cko.paymentSetups.updateAPaymentSetup(id, request);

            // Assert
            expect(result).to.deep.equal(response);
        });

    });
    describe('UpdateAPaymentSetup response 400', () => {
        it('should match response schema 2', async () => {
            // Arrange
            var err = null;
            const response = {};

            nock('https://api.sandbox.checkout.com')
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
                    address_line_1: '10 Canterbury Road',
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
                airline_data: {
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
                },
                accommodation_data: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line_1: '123 High Street',
                      address_line_2: 'Flat 456',
                      city: 'London',
                      state: 'Greater London',
                      country: 'United Kingdom',
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
            const cko = new Checkout(SK);

            try {
              const result = await cko.paymentSetups.updateAPaymentSetup(id, request);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(Error);
        });

    });
    describe('UpdateAPaymentSetup response 401', () => {
        it('should match response schema 3', async () => {
            // Arrange
            var err = null;
            const response = {};

            nock('https://api.sandbox.checkout.com')
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
                    address_line_1: '10 Canterbury Road',
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
                airline_data: {
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
                },
                accommodation_data: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line_1: '123 High Street',
                      address_line_2: 'Flat 456',
                      city: 'London',
                      state: 'Greater London',
                      country: 'United Kingdom',
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
            const cko = new Checkout(SK);

            try {
              const result = await cko.paymentSetups.updateAPaymentSetup(id, request);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(AuthenticationError);
        });

    });
    describe('UpdateAPaymentSetup response 403', () => {
        it('should match response schema 4', async () => {
            // Arrange
            var err = null;
            const response = {};

            nock('https://api.sandbox.checkout.com')
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
                    address_line_1: '10 Canterbury Road',
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
                airline_data: {
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
                },
                accommodation_data: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line_1: '123 High Street',
                      address_line_2: 'Flat 456',
                      city: 'London',
                      state: 'Greater London',
                      country: 'United Kingdom',
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
            const cko = new Checkout(SK);

            try {
              const result = await cko.paymentSetups.updateAPaymentSetup(id, request);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(ActionNotAllowed);
        });

    });
    describe('UpdateAPaymentSetup response 422', () => {
        it('should match response schema 5', async () => {
            // Arrange
            var err = null;
            const response = {
              request_id: '0HL80RJLS76I7',
              error_type: 'request_invalid',
              error_codes: [
                'amount_required'
              ]
            };

            nock('https://api.sandbox.checkout.com')
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
                    address_line_1: '10 Canterbury Road',
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
                airline_data: {
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
                },
                accommodation_data: [
                  {
                    name: 'Checkout Lodge',
                    booking_reference: 'REF9083748',
                    check_in_date: '2025-04-11',
                    check_out_date: '2025-04-18',
                    address: {
                      address_line_1: '123 High Street',
                      address_line_2: 'Flat 456',
                      city: 'London',
                      state: 'Greater London',
                      country: 'United Kingdom',
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
            const cko = new Checkout(SK);

            try {
              const result = await cko.paymentSetups.updateAPaymentSetup(id, request);
            } catch (error) {
              err = error;
            }

            // Assert
            expect(err).to.be.instanceOf(ValidationError);
        });

    });
});
