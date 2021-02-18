---
id: initialize
title: Initialize
---

export const Highlight = ({children, color}) => (
<span
style={{
      backgroundColor: color,
      borderRadius: '2px',
      color: '#fff',
      padding: '0.2rem',
    }}>
{children}
</span>
);

:::tip

If you use environment variables, the SDK will pick the keys up when they are set as <Highlight color="#a45200">CKO_SECRET_KEY</Highlight> and <Highlight color="#a45200">CKO_PUBLIC_KEY</Highlight>.

:::

## With environment variables

```js
const cko = new Checkout();
```

## With your secret key

```js
const cko = new Checkout('sk_XXXX');
```

## With your secret & public key & config

```js
const cko = new Checkout('sk_XXXX', { pk: 'pk_XXX', timeout: 7000 });
```

## With a custom HTTP agent

```js
const http = require('http');
const keepAliveAgent = new http.Agent({ keepAlive: true })

const cko = new Checkout('sk_XXXX', { agent: keepAliveAgent });
```

For now only the request timeout and agent can be configured. Future configuration options will be added and will very likly be passed in a similar way.

## Update config

If at any point you need to update the API key used, you can update the SDK config like this:

```js
const cko = new Checkout('sk_XXXX');
...
cko.config = {
    sk: newSecretKey,
    pk: newPublicKey,
    host: "https://myProxyExample.com",
    timeout: newTimeOut
};
```

The host will allow you to replace the base API URL with your own, if at any point you need this for testing purposes.

The SDK is using [node-fetch](https://github.com/node-fetch/node-fetch) as the HTTP client so if that means that it's easy to moch API responses with tolls like [nock](https://github.com/nock/nock).
