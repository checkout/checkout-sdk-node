---
id: hosted-payments
title: Hosted Payments
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

You can find a list of request body parameters and possible outcomes [here](https://api-reference.checkout.com/#tag/Hosted-Payments).

## Create a hosted page

```js
const hosted = await cko.hostedPayments.create({
    amount: 10,
    currency: 'USD',
    billing: {
        address: {
            address_line1: 'Checkout.com',
            address_line2: '90 Tottenham Court Road',
            city: 'London',
            state: 'London',
            zip: 'W1T 4TJ',
            country: 'GB',
        },
    },
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
    failure_url: 'https://example.com/failure',
});
```
