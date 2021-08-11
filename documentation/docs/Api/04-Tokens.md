---
id: tokens
title: Tokens
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

You can find a list of request body parameters and possible outcomes [here](https://api-reference.checkout.com/#tag/Tokens).

The SDK will infer the type of the payload, if not provided.

## Request a token for <Highlight color="#25c2a0">Apple Pay</Highlight>

```js
const token = await cko.tokens.request({
    // type:"applepay" is inferred
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

## Request a token for <Highlight color="#25c2a0">Google Pay</Highlight>

```js
const token = await cko.tokens.request({
    // type:"googlepay" is inferred
    token_data: {
        protocolVersion: 'EC_v1',
        signature: 'XXX',
        signedMessage: 'XXX'
    }
});
```

## Request a token for <Highlight color="#25c2a0">raw card details</Highlight>

:::warning

If you do not have SEQ-D level of PCI Compliance, this interaction can only be done in the test environment in case you want to unit test your code and you need a token to subsequently do a payment. In the production environment you need to use a solution like **Checkout.Frames** to generate the token for you.

:::

```js
const token = await cko.tokens.request({
    // type:"card" is inferred
    number: '4242424242424242',
    expiry_month: '6',
    expiry_year: '2028',
    cvv: '100'
});
```
