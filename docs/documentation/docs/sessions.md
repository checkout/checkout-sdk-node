---
id: sessions
title: Sessions
---

You can find a list of request body parameters and possible outcomes [here](https://api-reference.checkout.com/#tag/Reconciliation).

export const Highlight = ({children, color}) => (
<span
style={{
      color: color,
      padding: '0.2rem',
    }}>
{children}
</span>
);

## Request a session

```js
const session = await cko.sessions.request({
    source: {
        type: 'card',
        number: '4485040371536584',
        expiry_month: 1,
        expiry_year: 2030
    },
    amount: 100,
    currency: 'USD',
    authentication_type: 'regular',
    authentication_category: 'payment',
    challenge_indicator: 'no_preference',
    reference: 'ORD-5023-4E89',
    transaction_type: 'goods_service',
    shipping_address: {
        address_line1: 'Checkout.com',
        address_line2: '90 Tottenham Court Road',
        city: 'London',
        state: 'London',
        zip: 'W1T 4TJ',
        country: 'GB'
    },
    completion: {
        type: 'non-hosted',
        callback_url: 'https://example.com/sessions/callback'
    }
});
```

## Get session details

```js
const session = await cko.sessions.get('sid_llraltf4jlwu5dxdtprcv7ba5i');
```

## Submit channel data

```js
const session = await cko.sessions.submitChannelData('sid_llraltf4jlwu5dxdtprcv7ba5i', {
    channel: '',
    sdk_app_id: '',
    sdk_max_timeout: '',
    sdk_ephem_pub_key: '',
    sdk_encrypted_data: '',
    sdk_transaction_id: '',
    sdk_interface_type: '',
    sdk_ui_elements: ''
});
```

## Complete session

```js
const session = await cko.sessions.complete('sid_llraltf4jlwu5dxdtprcv7ba5i');
```
