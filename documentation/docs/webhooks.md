---
id: webhooks
title: Webhooks
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

You can find a list of request body parameters and possible outcomes [here](https://api-reference.checkout.com/#tag/Webhooks).

## Retrieve webhooks

```js
const webhooks = await cko.webhooks.retrieveWebhooks();
```

## Register webhook

```js
const webhook = await cko.webhooks.registerWebhook({
    url: 'https://example.com/webhook',
    active: true,
    headers: {
        authorization: '1234'
    },
    content_type: 'json',
    event_types: ['payment_approved', 'payment_captured']
});
```

## Retrieve webhook

```js
const webhook = await cko.webhooks.retrieveWebhook('wh_tdt72zlbe7cudogxdgit6nwk6i');
```

## Update webhook

```js
const webhook = await cko.webhooks.updateWebhook('wh_ahun3lg7bf4e3lohbhni65335u', {
    url: 'https://example.com/webhooks/updated',
    active: true,
    headers: {
        authorization: '1234'
    },
    content_type: 'json',
    event_types: ['payment_approved', 'payment_captured']
});
```

## Partially update webhook

```js
const webhook = await cko.webhooks.partiallyUpdateWebhook('wh_ahun3lg7bf4e3lohbhni65335u', {
    url: 'https://example.com/webhooks/updated'
});
```

## Remove webhook

```js
const webhook = await cko.webhooks.removeWebhook('wh_ahun3lg7bf4e3lohbhni65335u');
```
