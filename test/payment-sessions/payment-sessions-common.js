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