---
id: events
title: Events
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

You can find a list of request body parameters and possible outcomes [here](https://api-reference.checkout.com/#tag/Events).

## Retrieve event types

```js
const events = await cko.events.retrieveEventTypes();
```

## Retrieve events

```js
const events = await cko.events.retrieveEvents({
    from: '2019-03-01T00:00:00Z'
});
```

## Retrieve event

```js
const event = await cko.events.retrieveEvent('evt_c2qelfixai2u3es3ksovngkx3e');
```

## Retrieve event notification

```js
const notification = await cko.events.retrieveEventNotification({
    eventId: 'evt_c2qelfixai2u3es3ksovngkx3e',
    notificationId: 'ntf_wqjkqpgjy33uxoywcej4fnw6qm'
});
```

## Retry webhook

```js
const retry = await cko.events.retry({
    eventId: 'evt_c2qelfixai2u3es3ksovngkx3e',
    webhookId: 'wh_mpkyioafmajulnhjvwmrklenb4'
});
```

## Retry all webhooks

```js
const retryAll = await cko.events.retryAll('evt_c2qelfixai2u3es3ksovngkx3e');
```
