[![build-status](https://github.com/checkout/checkout-sdk-node/workflows/build-master/badge.svg)](https://github.com/checkout/checkout-sdk-node/actions/workflows/build-master.yml)
![CI Tests](https://github.com/checkout/checkout-sdk-node/workflows/CI%20Tests/badge.svg)
![CodeQL](https://github.com/checkout/checkout-sdk-node/workflows/CodeQL/badge.svg)
[![codecov](https://codecov.io/gh/checkout/checkout-sdk-node/branch/master/graph/badge.svg?token=POL9EXI2IS)](https://codecov.io/gh/checkout/checkout-sdk-node)

[![build-status](https://github.com/checkout/checkout-sdk-net/workflows/build-release/badge.svg)](https://github.com/checkout/checkout-sdk-net/actions/workflows/build-release.yml)
[![GitHub release](https://img.shields.io/github/release/checkout/checkout-sdk-node.svg)](https://GitHub.com/checkout/checkout-sdk-node/releases/)

[![zip badge](https://badgen.net/bundlephobia/minzip/checkout-sdk-node)](https://badgen.net/bundlephobia/minzip/action-test)

<p align="center"><img src="https://i.ibb.co/93zwP9m/SDK-Logo.png" width="70%"></p>

<p align="center">
<img src='https://i.imgur.com/ubifkCL.gif' width='100%' alt='npm start'>
</p>

# :rocket: Install

```bash
npm install checkout-sdk-node
```

# :computer: Import

```js
// ES6:
import { Checkout } from 'checkout-sdk-node';
// Common JS:
const { Checkout } = require('checkout-sdk-node');
```

> If you don't have your API keys, you can sign up for a test account [here](https://www.checkout.com/get-test-account).

# :clapper: Initialize SDK

## With api keys or access credentials
Based on how your account was set up, you will either have a pair or API key or a set of access credentials. Here is how you can use the SDK in both scenarios:
```js
// API Keys
const cko = new Checkout('sk_XXXXXXXXX', {
    pk: 'pk_XXXXXXX'
});

// Access credentials
const cko = new Checkout('your api secret here', {
    client: 'ack_XXXXXXXX',
    scope: ['gateway'], // or whatever scope required
    environment: 'sandbox', // or 'production'
});
```

## With environment variables
If your account uses API Keys (pk_XXX + sk_XXX), you can set the following environment variables, and the SK will pick them up:
- *CKO_SECRET_KEY*    (with a value like sk_XXX)
- *CKO_PUBLIC_KEY*   (with a value like pk_XXX)

If you use access credentials (ack_XXXX), you can set the following environment variables, and the SK will pick them up:
- *CKO_SECRET*
- *CKO_CLIENT*   (with a value like ack_XXXX)
- *CKO_SCOPE*   (with a value of the scope or semicolon separated scopes in case you use multiple)
- *CKO_ENVIRONMENT*   (with a value like sandbox or production)

## Set custom config
Basides the authentication, you also have the option to configure some extra elements about the SDK 
```js
const cko = new Checkout('...', {
    ..., //other authentication config
    host: "https://myProxyExample.com", // in case you need to use a custom host for tests
    timeout: 60000,   // HTTP request timout in ms
    agent: new http.Agent({ keepAlive: true }), // custom HTTP agent
    httpClient: 'axios' // specify axios httpClient, by default fetch. Optional
});
```

# :wrench: SDK Environment (Sandbox/Production)
When using API Keys (pk_XXX + sk_XXX) the SDK will automatically figure out what environment you are using however, if you use access credentials (ack_XXXX), make sure you set the "environment" in the config, as shown above in the initialization. 

# :interrobang: Error handling
The SDK is using promises, and you can handle errors similar to any other HTTP call.

```js
try {
    // some async request made with the SDK
    const action = await cko.payments.request({...});
    ...
} catch (error) {
    console.log(error.name, error.http_code, error.body)
    switch (error.name) {
        ...
    }
}
```
Here you have all the possible SDK specific errors:

| error.name           | error.http_code | error.body              |
| -------------------- | --------------- | ----------------------- |
| AuthenticationError  | 401             | undefined               |
| ActionNotAllowed     | 403             | undefined               |
| UrlAlreadyRegistered | 409             | undefined               |
| NotFoundError        | 404             | undefined               |
| BadGateway           | 502             | undefined               |
| ValidationError      | 422             | object                  |
| TooManyRequestsError | 429             | object/undefined        |
| ValueError           | 429             | string describing error |


# :book: Examples of usage

You can see examples of how to use the SDK for every endpoint documented in our  [API Reference](https://api-reference.checkout.com/). All you have to do is to navigate to the endpoint you want to use, and select "Node" for the example on the right side.
> NOTE: If you use access credentials (ack_XXXX) the link to the API reference relevant to you will be shared by your Solutions Engineers. 

# :eyeglasses: Try it on RunKit

You can try the SDK [here](https://npm.runkit.com/checkout-sdk-node).
