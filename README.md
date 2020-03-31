![Status](https://img.shields.io/badge/status-BETA-red.svg)

# checkout-sdk-node

[![codecov](https://codecov.io/gh/checkout/checkout-sdk-node/branch/master/graph/badge.svg)](https://codecov.io/gh/checkout/checkout-sdk-node)
[![Build Status](https://travis-ci.org/checkout/checkout-sdk-node.svg?branch=master)](https://travis-ci.orgcheckout/checkout-sdk-node)
[![codebeat badge](https://codebeat.co/badges/b41734ff-7fb5-4867-94d3-ab0729bb6b69)](https://codebeat.co/projects/github-com-ioan-ghisoi-cko-checkout-node-sdk-remake)
[![Try it on RunKit](https://badge.runkitcdn.com/checkout-sdk-node.svg)](https://npm.runkit.com/checkout-sdk-node)

# Import

```js
import { Checkout } from 'checkout-sdk-node';
```

> If you don't have your own API keys, you can sign up for a test account [here](https://www.checkout.com/get-test-account).

# Initialize

> Picks up your environment variables set as **CKO_SECRET_KEY** and **CKO_PUBLIC_KEY**

```js
const cko = new Checkout();
```

> With your secret key.

```js
const cko = new Checkout('sk_XXXX');
```

> With your secret key and custom config

```js
const cko = new Checkout('sk_XXXX', { timeout: 7000 });
```

# Environment

> Unless you specify the host, the SDK will determine the environemnt based on your secret key

```js
const cko = new Checkout('sk_XXXX'); // Live Environemnt
const cko = new Checkout('sk_test_XXXX'); // Sandbox Environemnt
const cko = new Checkout('sk_XXXX', { host: 'test.com' }); // custom host
```

> In case you use the token endpoint you can set your public key like this:

```js
const cko = new Checkout('sk_XXXX', { pk: 'pk_XXX' });
// or cko.config.pk = "pk_XXX"
```

# Payments

The SDK will infer the `type` of the payment `source` or `destination`, if not provided, for: `token`, `id`, `card`, `customer`, `network_token`

> The request body is dynamic so if you want to see the paramenters check [the docs](https://api-reference.checkout.com/#tag/Payments)

### Request a payment or a payout

#### Source Type: `token`

```js
const payment = await cko.payments.request({
    source: {
        token: 'tok_bzi43qc6jeee5mmnfo4gnsnera'
    },
    currency: 'USD',
    amount: 1000 // cents
});
```

#### Source Type: `card`

```js
const payment = await cko.payments.request({
    source: {
        number: '4242424242424242',
        expiry_month: 6,
        expiry_year: 2029,
        cvv: '100'
    },
    currency: 'USD',
    amount: 1000 // cents
});
```

#### Source Type: `id`

```js
const payment = await cko.payments.request({
    source: {
        id: 'src_vg3tm54ndfbefotjlmgrrvbxli'
    },
    currency: 'USD',
    amount: 1000 // cents
});
```

#### Source Type: `customer`

```js
const payment = await cko.payments.request({
    source: {
        id: 'cus_6artgoevd77u7ojah2wled32sa'
    },
    currency: 'USD',
    amount: 1000 // cents
});
```

#### Source Type: Alternative Payment Method (APM)

```js
const payment = await cko.payments.request({
    source: {
        type: 'sofort'
    },
    currency: 'EUR',
    amount: 1000 // cents
});
```

#### Destination Type: `id`

```js
const payment = await cko.payments.request({
    destination: {
        id: 'src_vg3tm54ndfbefotjlmgrrvbxli'
    },
    currency: 'USD',
    amount: 1000 // cents
});
```

### Get payment details

#### With: `payment id`

```js
const payment = await cko.payments.get('pay_je5hbbb4u3oe7k4u3lbwlu3zkq');
```

#### With: `session id`

```js
const payment = await cko.payments.get('sid_pm6woylsb23efp37npxgmml4ti');
```

### Get payment actions

#### With: `payment id`

```js
const payment = await cko.payments.getActions('pay_je5hbbb4u3oe7k4u3lbwlu3zkq');
```

### Payment flow

#### Perform: `Capture` `Void` `Refund`

```js
const capture = await cko.payments.capture('pay_je5hbbb4u3oe7k4u3lbwlu3zkq', {
    reference: 'capture'
});
const void = await cko.payments.void('pay_je5hbbb4u3oe7k4u3lbwlu3zkq', {
    reference: 'void'
});
const refund = await cko.payments.refund('pay_je5hbbb4u3oe7k4u3lbwlu3zkq', {
    reference: 'refund'
});
```

### 3DS Support

#### Payment Request Example

```js
const payment = await cko.payments.request({
    source: {
        number: '4242424242424242',
        expiry_month: 6,
        expiry_year: 2029,
        cvv: '100'
    },
    '3ds': {
        enabled: true
    },
    currency: 'USD',
    amount: 1000 // cents
});

if (payment.requiresRedirect) {
    let redirectionUrl = payment.redirectLink;
    // redirect to the redirectionUrl
}
```

# Tokens

The SDK will infer the `type` of the payload, if not provided

> The request body is dynamic so if you want to see the paramenters check [the docs](https://api-reference.checkout.com/#tag/Tokens)

### Request a token

#### Token Type: `applepay`

```js
const token = await cko.tokens.request({
    token_data: {
        version: 'EC_v1',
        data: 'XXX',
        signature: 'XXX',
        header: {
            ephemeralPublicKey: 'XXX',
            publicKeyHash: 'XXX',
            transactionId: 'XXX'
        }
    }
});
```

#### Token Type: `googlepay`

```js
const token = await cko.tokens.request({
    token_data: {
        protocolVersion: 'EC_v1',
        signature: 'XXX',
        signedMessage: 'XXX'
    }
});
```

#### Token Type: `card`

```js
const token = await cko.tokens.request({
    number: '4242424242424242',
    expiry_month: '6',
    expiry_year: '2028',
    cvv: '100'
});
```

# Sources

The SDK will infer the `type` of the source, if not provided

> The request body is dynamic so if you want to see the paramenters check [the docs](https://api-reference.checkout.com/#tag/Sources)

### Request a source

#### Token Type: `sepa`

```js
const token = await cko.sources.add({
    source: {
        token: 'tok_bzi43qc6jeee5mmnfo4gnsnera' // Generated by Checkout.Frames
        billing_address: {
            address_line1: 'Wall Street',
            address_line2: 'Dollar Avenue',
            city: 'London',
            state: 'London',
            zip: 'W1W W1W',
            country: 'GB'
        },
        phone: {
            country_code: '44',
            number: '7123456789'
        }
    },
    currency: 'USD',
    amount: 1000,
    payment_type: 'Regular',
    reference: 'ORDER 1234',
    description: 'Mint Tea',
    customer: {
        email: 'new_user@email.com',
        name: 'John Smith'
    },
    metadata: {
        myCustomProp: {
            value: 1
        }
    }
});
```

#### Token Type: `ach`

```js
const token = await cko.sources.add({
    billing_address: {
        address_line1: 'Wayne Plaza 1',
        address_line2: null,
        city: 'Gotham City',
        state: null,
        zip: '12345',
        country: 'US'
    },
    source_data: {
        account_holder_name: 'Bruce Wayne',
        account_type: 'Checking',
        account_number: '0123456789',
        routing_number: '211370545',
        billing_descriptor: 'ACH Demo',
        company_name: null
    }
});
```

# Instruments

The SDK will infer the `type` of the instrument, if not provided

> The request body is dynamic so if you want to see the paramenters check [the docs](https://api-reference.checkout.com/#tag/Instruments)

### Request an instrument

```js
const instrument = await cko.instruments.create({
    token: token: 'tok_bzi43qc6jeee5mmnfo4gnsnera'
});
```

### Exception handling

#### Example

```js
try {
  const payment = await cko.payments.request({
  source: {
    id: "src_vg3tm54ndfbefotjlmgrrvbxli"
  },
  currency: "USD",
  amount: 1000 // cents
  });
} catch (err) {
    switch (err.name) {
        case "ApiTimeout": ...
          break;
        case "AuthenticationError": ...
          break;
        case "ActionNotAllowed": ...
          break;
        case "UrlAlreadyRegistered": ...
          break;
        case "NotFoundError": ...
          break;
        case "UnprocessableError": ...
          break;
        case "ErrorWithBody": ...
          break;
        case "ValidationError": ...
          break;
        case "TooManyRequestsError": ...
          break;
        case "BadGateway": ...
          break;
        case "ValueError": ...
          break;
        default:
          break;
      }
}
```

### Utility

#### `requiresRedirect`

```js
const payment = await cko.payments.request(...);

console.log(payment.requiresRedirect)
```

Boolean value. For the "true" value, this means that the transaction was Flagged by a risk rule and it requires manual review.
