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
    console.log(error.name, error.http_code, error.body)
    switch (error.name) {
        ...
    }
}
```

## SDK specific errors

The errors follows the Checkout.com [API Reference](https://api-reference.checkout.com/).
The errors will be formatted like this:

```js
{
    name: "{the error name}",
    http_code: "{the HTTP status code}",
    body: "{the error response from the API or a error message}"
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

Here is an example of a ValidationError:

```js
    try {
        // some async request made with the SDK
    } catch (error){
        console.log(error)
    }
    ...
    // output
    {
        name: "ValidationError",
        http_code: 422,
        body: {
            request_id: '6b3300a8-fe99-4ab3-8332-43cd7ecb58a7',
            error_type: 'processing_error',
            error_codes: ['token_expired']
        }
    }

```

> Keep in mind that for ValueError, the error.body is a string, not an object

## How errors are determined

The errors above are triggered by status codes that do not fall in the 20X Status codes, or by validation issues. This means that statuses like a 202, 204 will not throw an exception

:::tip

It's important to understand that Declines, or 3D Secure responses do not throw an exception, since the status code associated with them is in the 20X range. In the Payments section you will see some examples of best practices when it comes to handling responses.

:::
