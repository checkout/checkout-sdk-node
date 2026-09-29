import { expect } from "chai";
import nock from "nock";
import Checkout from "../../src/Checkout.js";

afterEach(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

const cko = new Checkout(process.env.CHECKOUT_DEFAULT_SECRET_KEY, {
  useLegacyDomain: true,
});

// Live coverage for the airline and accommodation processing sub-tree.
//
// The whole reason this file exists: the specification declares `passenger` array-only, and the
// live API rejects the array on three of five request surfaces. No spec-derived test can catch
// that, only a real request. Node passes `body` through untouched, so the JSDoc is the only thing
// standing between a merchant and a 422, which makes a live check the only real verification.
const airlineData = (passenger) => [
  {
    ticket: {
      number: "045-21351455613",
      issue_date: "2023-05-20",
      issuing_carrier_code: "AI",
      travel_package_indicator: "B",
      travel_agency_name: "World Tours",
      travel_agency_code: "01",
    },
    passenger,
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
        fare_basis_code: "SPRSVR",
      },
    ],
  },
];

const onePassenger = {
  first_name: "John",
  last_name: "White",
  date_of_birth: "1990-05-26",
  address: { country: "US" },
};

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
    guests: [{ first_name: "Jane", last_name: "Doe", date_of_birth: "1985-07-14" }],
    room: [{ rate: "70", number_of_nights_at_room_rate: "3" }],
    property_phone: [{ country_code: "44", number: "7123456789" }],
    customer_service_phone: [{ country_code: "44", number: "7123456789" }],
  },
];

const paymentWith = (processing) => ({
  source: {
    type: "card",
    number: "4242424242424242",
    expiry_month: 6,
    expiry_year: 2029,
    cvv: "100",
  },
  amount: 10,
  currency: "USD",
  processing,
});

describe("Integration::Payments-Airline", () => {
  it("should request a payment with a single passenger as an object", async () => {
    const response = await cko.payments.request(
      paymentWith({ airline_data: airlineData(onePassenger) })
    );

    expect(response.id).to.not.be.undefined;
    expect(response.approved).to.equal(true);
  });

  it("should request a payment with several passengers as an array", async () => {
    // POST /payments is one of only two surfaces that accept the array form. Hosted payments,
    // payment links and payment contexts all return 422 for it.
    const response = await cko.payments.request(
      paymentWith({
        airline_data: airlineData([onePassenger, { first_name: "Jane", last_name: "Doe" }]),
      })
    );

    expect(response.id).to.not.be.undefined;
    expect(response.approved).to.equal(true);
  });

  it("should request a payment with accommodation data including both phone arrays", async () => {
    const response = await cko.payments.request(
      paymentWith({
        airline_data: airlineData(onePassenger),
        accommodation_data: accommodationData,
      })
    );

    expect(response.id).to.not.be.undefined;
    expect(response.approved).to.equal(true);
  });

  it("should accept a fractional tax_amount and echo it back", async () => {
    // The swagger types the six processing amount fields as `number`, not `integer`. Node passes
    // the value through untouched, so this is the surface where that is observable end to end;
    // Java threw and Go failed the whole response on this payload before being retyped.
    const created = await cko.payments.request(paymentWith({ tax_amount: 10.5 }));
    const fetched = await cko.payments.get(created.id);

    expect(fetched.processing.tax_amount).to.equal(10.5);
  });
});
