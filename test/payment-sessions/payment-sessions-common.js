export const commonRequest = {
  amount: 1000,
  currency: 'GBP',
  reference: 'ORD-123A',
  billing: {
    address: {
      country: 'GB'
    }
  },
  customer: {
    name: 'John Smith',
    email: 'john.smith@example.com'
  },
  success_url: 'https://example.com/payments/success',
  failure_url: 'https://example.com/payments/failure'
};

export const commonResponse = {
  id: 'ps_2aOig7knIeGNYPlyuxUEPQyOmxN',
  amount: 1000,
  locale: 'en-GB',
  currency: 'GBP',
  payment_methods: [
    {
      type: 'card',
      scheme_choice_enabled: false,
      store_payment_details: 'disabled'
    },
    {
      type: 'applepay',
      display_name: 'Parser Digital',
      country_code: 'GB',
      currency_code: 'GBP',
    },
    {
      type: 'googlepay',
    }
  ],
  feature_flags: [],
  risk: { enabled: true },
  _links: {
    self: {
      href: 'https://api.sandbox.checkout.com/payment-sessions/ps_2aOig7knIeGNYPlyuxUEPQyOmxN'
    }
  }
};

export const commonSubmitRequest = {
  session_data: "string",
  amount: 1000,
  reference: "ORD-123A",
  items: [
    {
      reference: "string",
      commodity_code: "string",
      unit_of_measure: "string",
      total_amount: 1000,
      tax_amount: 1000,
      discount_amount: 1000,
      url: "string",
      image_url: "string",
      name: "Gold Necklace",
      quantity: 1,
      unit_price: 1000
    }
  ],
  "3ds": {
    enabled: false,
    attempt_n3d: false,
    challenge_indicator: "no_preference",
    exemption: "low_value",
    allow_upgrade: true
  },
  ip_address: "90.197.169.245"
};

export const commonSubmitResponseCreated = {
  id: "pay_mbabizu24mvu3mela5njyhpit4",
  status: "Approved",
  type: "alipay_cn"
};

export const commonSubmitResponseAccepted = {
  id: "pay_mbabizu24mvu3mela5njyhpit4",
  status: "Action Required",
  type: "string",
  action: {}
};