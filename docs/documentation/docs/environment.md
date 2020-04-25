---
id: environment
title: Environment
---

The SDK will **infer the Environment** you are targeting based on the **secret key** you provide when you initialize it. This should save you from mismatches between the API keys and the Environment (Sandbox vs Live/Production).

If you however want to set the environment yourself, or you want to set a custom host, you can do it like this:

```js
const cko = new Checkout('sk_XXXX'); // Live Environment
const cko = new Checkout('sk_test_XXXX'); // Sandbox Environment
const cko = new Checkout('sk_XXXX', { host: 'test.com' }); // Custom host
```

## Testing

If you are testing in the Sandbox environment, Checkout.com provides a list of [test test card details](https://docs.checkout.com/docs/testing#section-test-card-numbers). You can also simulate a lot of edge cases like Declines, by using [special transaction values](https://docs.checkout.com/docs/testing#section-response-codes).

:::note

You can also test 3D Secure with the test cards provided. If you want to test 3DS 2 flows, use the cards mentioned [here](https://docs.checkout.com/docs/testing#section-3-ds-test-cards).

:::
