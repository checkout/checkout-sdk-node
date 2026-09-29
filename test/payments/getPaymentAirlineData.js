import { Checkout } from "../../src/index.js";
import { expect } from "chai";
import nock from "nock";

const SK = "sk_test_0b9b5db6-f223-49d0-b68f-f6643dd4f808";

// Node returns `response.json` untouched, so the pass-through IS the feature: whatever shape the
// API sends under `processing.airline_data` is what the caller receives. These tests pin that,
// including the two things a typed SDK gets wrong on this sub-tree: `passenger` arriving as a bare
// object rather than an array, and the `class_of_travelling` / `stop_over_code` / string
// `flight_number` keys that six SDKs previously misspelled or mistyped.
describe("Get payment details with airline and accommodation data", () => {
  const airlineData = [
    {
      ticket: {
        number: "045-21351455613",
        issue_date: "2023-05-20",
        issuing_carrier_code: "AI",
        travel_package_indicator: "B",
        travel_agency_name: "World Tours",
        travel_agency_code: "01"
      },
      passenger: {
        first_name: "John",
        last_name: "White",
        date_of_birth: "1990-05-26",
        address: { country: "US" }
      },
      flight_leg_details: [
        {
          flight_number: "101",
          carrier_code: "BA",
          class_of_travelling: "J",
          departure_airport: "LHR",
          departure_date: "2023-06-19",
          departure_time: "15:30",
          arrival_airport: "LAX",
          stop_over_code: "x",
          fare_basis_code: "SPRSVR"
        }
      ]
    }
  ];

  const accommodationData = [
    {
      name: "The Sea View Hotel",
      booking_reference: "HOTEL123",
      check_in_date: "2023-06-20",
      check_out_date: "2023-06-23",
      address: { address_line1: "123 Beach Road", zip: "10001" },
      state: "FL",
      country: "USA",
      city: "Los Angeles",
      number_of_rooms: 2,
      guests: [
        { first_name: "Jane", last_name: "Doe", date_of_birth: "1985-07-14" }
      ],
      room: [{ rate: "70", number_of_nights_at_room_rate: "3" }],
      property_phone: [{ country_code: "44", number: "7123456789" }],
      customer_service_phone: [{ country_code: "44", number: "7123456789" }]
    }
  ];

  const reply = (processing) => ({
    id: "pay_je5hbbb4u3oe7k4u3lbwlu3zkq",
    amount: 10,
    currency: "USD",
    status: "Authorized",
    approved: true,
    processing
  });

  it("passes a single-object passenger through unchanged", async () => {
    nock("https://test.api.sandbox.checkout.com")
      .get("/payments/pay_je5hbbb4u3oe7k4u3lbwlu3zkq")
      .reply(200, reply({ airline_data: airlineData }));

    const cko = new Checkout(SK, { subdomain: "test" });
    const payment = await cko.payments.get("pay_je5hbbb4u3oe7k4u3lbwlu3zkq");

    // Not normalised into an array: a bare object stays a bare object.
    expect(payment.processing.airline_data[0].passenger).to.be.an("object");
    expect(payment.processing.airline_data[0].passenger).to.not.be.an("array");
    expect(payment.processing.airline_data[0].passenger.first_name).to.equal("John");
    expect(payment.processing.airline_data[0].passenger.address.country).to.equal("US");
    expect(payment.processing.airline_data).to.deep.equal(airlineData);
  });

  it("passes an array of passengers through unchanged", async () => {
    const twoPassengers = [
      {
        ...airlineData[0],
        passenger: [
          airlineData[0].passenger,
          { first_name: "Jane", last_name: "Doe" }
        ]
      }
    ];

    nock("https://test.api.sandbox.checkout.com")
      .get("/payments/pay_je5hbbb4u3oe7k4u3lbwlu3zkq")
      .reply(200, reply({ airline_data: twoPassengers }));

    const cko = new Checkout(SK, { subdomain: "test" });
    const payment = await cko.payments.get("pay_je5hbbb4u3oe7k4u3lbwlu3zkq");

    expect(payment.processing.airline_data[0].passenger).to.be.an("array");
    expect(payment.processing.airline_data[0].passenger).to.have.lengthOf(2);
    expect(payment.processing.airline_data).to.deep.equal(twoPassengers);
  });

  it("preserves the flight leg keys and the string flight_number", async () => {
    nock("https://test.api.sandbox.checkout.com")
      .get("/payments/pay_je5hbbb4u3oe7k4u3lbwlu3zkq")
      .reply(200, reply({ airline_data: airlineData }));

    const cko = new Checkout(SK, { subdomain: "test" });
    const payment = await cko.payments.get("pay_je5hbbb4u3oe7k4u3lbwlu3zkq");
    const leg = payment.processing.airline_data[0].flight_leg_details[0];

    expect(leg.class_of_travelling).to.equal("J");
    expect(leg.stop_over_code).to.equal("x");
    expect(leg.flight_number).to.be.a("string");
    expect(leg.flight_number).to.equal("101");
    // The misspellings that six SDKs shipped must not appear.
    expect(leg).to.not.have.property("service_class");
    expect(leg).to.not.have.property("stopover_code");
    expect(leg).to.not.have.property("class_of_traveling");
  });

  it("passes the accommodation block through including both phone arrays", async () => {
    nock("https://test.api.sandbox.checkout.com")
      .get("/payments/pay_je5hbbb4u3oe7k4u3lbwlu3zkq")
      .reply(200, reply({ accommodation_data: accommodationData }));

    const cko = new Checkout(SK, { subdomain: "test" });
    const payment = await cko.payments.get("pay_je5hbbb4u3oe7k4u3lbwlu3zkq");
    const accommodation = payment.processing.accommodation_data[0];

    expect(payment.processing.accommodation_data).to.deep.equal(accommodationData);
    expect(accommodation.property_phone[0].number).to.equal("7123456789");
    expect(accommodation.customer_service_phone[0].country_code).to.equal("44");
    // Plain strings, so the three-letter "USA" survives where a country enum would not.
    expect(accommodation.country).to.equal("USA");
    expect(accommodation.state).to.equal("FL");
    // Strings, not numbers, on both room fields.
    expect(accommodation.room[0].rate).to.be.a("string");
    expect(accommodation.room[0].number_of_nights_at_room_rate).to.be.a("string");
  });
});

// Request-side pass-through. Node sends `body` untouched, so what the caller builds is what goes
// on the wire. These assert the outgoing JSON with nock's request-body matcher, the same form
// requestPaymentBacs.js uses, because the cardinality problem bites on the way out: an array sent
// to hosted payments, payment links or payment contexts returns 422.
describe("Request airline data, outgoing body", () => {
  const passenger = {
    first_name: "John",
    last_name: "White",
    date_of_birth: "1990-05-26",
    address: { country: "US" }
  };
  const leg = {
    flight_number: "101",
    carrier_code: "BA",
    class_of_travelling: "J",
    departure_airport: "LHR",
    departure_date: "2023-06-19",
    departure_time: "15:30",
    arrival_airport: "LAX",
    stop_over_code: "x",
    fare_basis_code: "SPRSVR"
  };
  const cardSource = {
    type: "card",
    number: "4242424242424242",
    expiry_month: 6,
    expiry_year: 2029,
    cvv: "100"
  };

  const paymentBody = (airline) => ({
    source: cardSource,
    amount: 10,
    currency: "USD",
    processing: { airline_data: [airline] }
  });

  it("sends a single passenger as an object, not wrapped in an array", async () => {
    let sent;
    nock("https://test.api.sandbox.checkout.com")
      .post("/payments", (body) => {
        sent = body;
        return true;
      })
      .reply(201, { id: "pay_x", approved: true });

    const cko = new Checkout(SK, { subdomain: "test" });
    await cko.payments.request(paymentBody({ passenger, flight_leg_details: [leg] }));

    // The object must survive as an object: the SDK does not normalise it into a list.
    expect(sent.processing.airline_data[0].passenger).to.be.an("object");
    expect(sent.processing.airline_data[0].passenger).to.not.be.an("array");
    expect(sent.processing.airline_data[0].passenger).to.deep.equal(passenger);
  });

  it("sends several passengers as an array", async () => {
    let sent;
    nock("https://test.api.sandbox.checkout.com")
      .post("/payments", (body) => {
        sent = body;
        return true;
      })
      .reply(201, { id: "pay_x", approved: true });

    const cko = new Checkout(SK, { subdomain: "test" });
    await cko.payments.request(
      paymentBody({ passenger: [passenger, { first_name: "Jane" }], flight_leg_details: [leg] })
    );

    expect(sent.processing.airline_data[0].passenger).to.be.an("array");
    expect(sent.processing.airline_data[0].passenger).to.have.lengthOf(2);
  });

  it("omits passenger entirely when it was never set", async () => {
    let sent;
    nock("https://test.api.sandbox.checkout.com")
      .post("/payments", (body) => {
        sent = body;
        return true;
      })
      .reply(201, { id: "pay_x", approved: true });

    const cko = new Checkout(SK, { subdomain: "test" });
    await cko.payments.request(paymentBody({ flight_leg_details: [leg] }));

    // An empty array and an explicit null are both rejected with
    // processing_airline_data_0_passenger_invalid, so absence is the only safe zero-passenger form.
    expect(sent.processing.airline_data[0]).to.not.have.property("passenger");
  });

  it("sends the renamed flight leg keys and the string flight_number on the wire", async () => {
    let sent;
    nock("https://test.api.sandbox.checkout.com")
      .post("/payments", (body) => {
        sent = body;
        return true;
      })
      .reply(201, { id: "pay_x", approved: true });

    const cko = new Checkout(SK, { subdomain: "test" });
    await cko.payments.request(paymentBody({ passenger, flight_leg_details: [leg] }));

    const outgoing = sent.processing.airline_data[0].flight_leg_details[0];
    expect(outgoing.class_of_travelling).to.equal("J");
    expect(outgoing.stop_over_code).to.equal("x");
    expect(outgoing.flight_number).to.equal("101");
    expect(outgoing.flight_number).to.be.a("string");
    expect(outgoing).to.not.have.property("service_class");
    expect(outgoing).to.not.have.property("stopover_code");
  });
});
