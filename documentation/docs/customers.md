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

## Create

```js
const customerResponse = await cko.customers.create({
    email: 'JohnTest@test.com',
    name: 'John Test',
    phone: {
        country_code: '+1',
        number: '4155552671',
    },
    metadata: {
        coupon_code: 'NY2018',
        partner_id: 123989,
    },
});
```

## Get customer

```js
const customerResponse = await cko.customers.get('cus_2tvaccfvs3lulevzg42vgyvtdq');
```

## Update a customer

```js
const customerResponse = await cko.customers.update('cus_2tvaccfvs3lulevzg42vgyvtdq', {
    name: 'James Bond',
});
```

## Delete a customer

```js
const customerResponse = await cko.customers.delete('cus_2tvaccfvs3lulevzg42vgyvtdq');
```
