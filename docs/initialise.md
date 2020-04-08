---
id: initialise
title: Initialise
---

> If you use environment variables, the SDK will pick the keys up when they are set as **CKO_SECRET_KEY** and **CKO_PUBLIC_KEY**.

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

For now only the request timeout can be configured. Future configuration options will be added and will very likly be passed in a similar way.

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

The _host_ will allow you to replace the base API URL with your own, if at any point you need this for testing purposes.

The SDK is using [node-fetch](https://github.com/node-fetch/node-fetch) as the HTTP client so if that means that it's easy to moch API responses with tolls like [nock](https://github.com/nock/nock)
