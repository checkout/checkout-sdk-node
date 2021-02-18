---
id: customers
title: Customers
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

You can find a list of request body parameters and possible outcomes [here](https://api-reference.checkout.com/#tag/Customers).

## Update a customer

```js
const customerResponse = await cko.customers.update('cus_2tvaccfvs3lulevzg42vgyvtdq', {
    name: 'James Bond',
});
```
