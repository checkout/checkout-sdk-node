---
id: errors
title: Error Handling
---

The SDK is using promises, and you can handle errors similar to any other HTTP call.

```js
const cko = new Checkout();

try {
    // some async request made with the SDK
    const action = await cko.payments.request({...});
    ...
} catch (error) {
    switch (error.name) {
        ...
    }
}
```

## SDK specific errors

The errors follow the Checkout.com [API Reference](https://api-reference.checkout.com/).

| error.name           | has response body |
| -------------------- | ----------------- |
| AuthenticationError  | No                |
| ActionNotAllowed     | No                |
| UrlAlreadyRegistered | No                |
| NotFoundError        | No                |
| ValidationError      | Yes               |
| TooManyRequestsError | No                |
| BadGateway           | Yes               |

## How errors are determined

The errors above are triggered by status codes that do not fall in the 20X Status codes, or by validation issues. This means that statuses like a 202, 204 will not throw an exception

:::tip

It's important to understand that Declines, or 3D Secure responses do not throw an exception, since the status code associated with them is in the 20X range. In the Payments section you will see some examples of best practices when it comes to handling responses.

:::
