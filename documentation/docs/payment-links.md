---
id: payment-links
title: Payment Links
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

You can find a list of request body parameters and possible outcomes [here](https://api-reference.checkout.com/#tag/Payment-Links).

## Create a payment link page

```js
const linksResponse = await cko.paymentLinks.create({
    amount: 10359,
    currency: 'EUR',
    billing: {
        address: {
            country: 'DE',
        },
    },
    products: [
        {
            name: 'Moonlight blue lightsaber',
            quantity: 2,
            price: 3999,
        },
        {
            name: 'Stainless steel watch strap',
            quantity: 1,
            price: 2361,
        },
    ],
    return_url: 'https://pay.sandbox.checkout.com/link/examples/docs',
});
```
