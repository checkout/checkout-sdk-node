---
id: sources
title: Sources
---

export const Highlight = ({children, color}) => (
<span
style={{
      color: color,
      padding: '0.2rem',
    }}>
{children}
</span>
);

You can find a list of request body parameters and possible outcomes [here](https://api-reference.checkout.com/#tag/Sources).

The SDK will infer the type of the source, if not provided.

## Add a <Highlight color="#25c2a0">SEPA source</Highlight>

:::note

SEPA is not enabled by default, so please let your account manager know if you want to use it.

:::

```js
const source = await cko.sources.add({
    // type:"sepa" is inferred
    reference: 'X-080957-N34',
    source_data: {
        first_name: 'Sophie',
        last_name: 'Bonneville',
        account_iban: 'DE25100100101234567893',
        bic: 'PBNKDEFFXXX',
        billing_descriptor: 'Thanks for shopping',
        mandate_type: 'recurring'
    },
    billing_address: {
        address_line1: '101 Avenue de Gaulle',
        city: 'Paris',
        zip: '75013',
        country: 'FR'
    },
    phone: {
        country_code: '+33',
        number: '6 78 91 01 11'
    },
    customer: {
        email: 'sophie.bonneville@ckomail.com'
    }
});
```

## Add a <Highlight color="#25c2a0">ACH source</Highlight>

:::note

ACH is not enabled by default, so please let your account manager know if you want to use it.

:::

```js
const source = await cko.sources.add({
    // type:"ach" is inferred
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
