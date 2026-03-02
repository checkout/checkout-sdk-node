[![build-status](https://github.com/checkout/checkout-sdk-node/workflows/build-master/badge.svg)](https://github.com/checkout/checkout-sdk-node/actions/workflows/build-master.yml)
![CI Tests](https://github.com/checkout/checkout-sdk-node/workflows/CI%20Tests/badge.svg)
![CodeQL](https://github.com/checkout/checkout-sdk-node/workflows/CodeQL/badge.svg)
[![codecov](https://codecov.io/gh/checkout/checkout-sdk-node/branch/master/graph/badge.svg?token=POL9EXI2IS)](https://codecov.io/gh/checkout/checkout-sdk-node)
[![GitHub release](https://img.shields.io/github/release/checkout/checkout-sdk-node.svg)](https://GitHub.com/checkout/checkout-sdk-node/releases/)
[![npm version](https://img.shields.io/npm/v/checkout-sdk-node.svg)](https://www.npmjs.com/package/checkout-sdk-node)

[![zip badge](https://badgen.net/bundlephobia/minzip/checkout-sdk-node)](https://badgen.net/bundlephobia/minzip/action-test)

<p align="center"><img src="https://i.ibb.co/93zwP9m/SDK-Logo.png" width="70%"></p>

<p align="center">
<img src='https://i.imgur.com/ubifkCL.gif' width='100%' alt='npm start'>
</p>

# Checkout.com Node.js SDK

The official Node.js SDK for [Checkout.com](https://www.checkout.com) payment gateway.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#rocket-install)
- [Getting Started](#clapper-initialize-sdk)
  - [Authentication](#with-api-keys-or-access-credentials)
  - [Environment Variables](#with-environment-variables)
  - [Custom Configuration](#set-custom-config)
  - [HTTP Client Configuration](#http-client-configuration)
  - [Base URL Configuration](#base-url-configuration-account-specific)
- [SDK Environment](#wrench-sdk-environment-sandboxproduction)
- [Quick Examples](#bulb-quick-examples)
- [TypeScript Support](#typescript-support)
- [Available Endpoints](#package-available-endpoints)
- [Error Handling](#interrobang-error-handling)
- [Testing](#white_check_mark-testing)
- [Documentation](#book-examples-of-usage)
- [Migration Guide](MIGRATION.md)

## Features

- ✅ **Full API Coverage** - Support for all Checkout.com API endpoints
- ✅ **TypeScript Support** - Includes TypeScript definitions
- ✅ **Dual Authentication** - API Keys and OAuth/Access Credentials
- ✅ **High Test Coverage** - 97.95% code coverage with 816 tests
- ✅ **Modern Node.js** - Built for Node.js 18+
- ✅ **Flexible HTTP Client** - Use native fetch or axios
- ✅ **Promise-based** - Async/await support
- ✅ **Comprehensive Error Handling** - Detailed error types

## Requirements

- Node.js >= 18.0.0
- npm or yarn

> **⚠️ Important:** Each Checkout.com account has its own unique base URL prefix. You must configure this prefix when initializing the SDK to connect to your specific account. Find your unique prefix in the [Dashboard → Developers → Overview](https://dashboard.checkout.com/developers). See [Base URL Configuration](#base-url-configuration-account-specific) for details.

> **⚠️ Deprecation Notice:** Initializing the SDK without the `subdomain` parameter is **deprecated** and will be removed in a future major version. Please ensure you provide your account-specific subdomain to avoid disruption when upgrading.

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

## Initialization Methods

The SDK supports 4 ways to initialize, depending on your authentication method and credential storage:

### 1. Static Keys (API Keys) - Declared Options

Use when you have `sk_XXX` and `pk_XXX` keys and want to pass them directly:

```js
const cko = new Checkout('sk_sbox_...', {
    pk: 'pk_sbox_...',
    subdomain: 'YOUR_PREFIX'  // Required: Get from Dashboard → Developers → Overview
});
```

**Required:**
- First parameter: Secret Key (sk_XXX)
- `pk`: Public Key (pk_XXX) - Required
- `subdomain`: Account prefix - Required

### 2. OAuth (Access Credentials) - Declared Options

Use when you have `ack_XXXX` access credentials and want to pass them directly:

```js
const cko = new Checkout('your_api_secret', {
    client: 'ack_XXXXXXXX',
    pk: 'pk_sbox_...',          // Required for OAuth
    scope: ['gateway'],         // Required - scopes your app needs
    environment: 'sandbox',     // 'sandbox' or 'production'
    subdomain: 'YOUR_PREFIX'    // Required: Get from Dashboard → Developers → Overview
});
```

**Required:**
- First parameter: API Secret (OAuth secret)
- `client`: Access credential ID (ack_XXXX) - Triggers OAuth mode
- `pk`: Public Key - Required for OAuth
- `scope`: OAuth scopes (array or string) - Required
- `environment`: 'sandbox' or 'production' - Required
- `subdomain`: Account prefix - Required

### 3. Static Keys (API Keys) - Environment Variables

Use when you have `sk_XXX` and `pk_XXX` in environment variables and want zero-config:

Set environment variables:
```bash
export CKO_SECRET_KEY=sk_sbox_...
export CKO_PUBLIC_KEY=pk_sbox_...
```

Initialize:
```js
const cko = new Checkout(null, {
    subdomain: 'YOUR_PREFIX'  // Must be passed explicitly
});
```

**Environment Variables:**
- `CKO_SECRET_KEY`: Secret Key (sk_XXX)
- `CKO_PUBLIC_KEY`: Public Key (pk_XXX) - Optional

### 4. OAuth (Access Credentials) - Environment Variables

Use when you have OAuth credentials in environment variables:

Set environment variables:
```bash
export CKO_SECRET=your_api_secret
export CKO_CLIENT=ack_XXXXXXXX
export CKO_SCOPE=gateway,vault
export CKO_ENVIRONMENT=sandbox
```

Initialize:
```js
const cko = new Checkout(null, {
    subdomain: 'YOUR_PREFIX'  // Must be passed explicitly
});
```

**Environment Variables:**
- `CKO_SECRET`: API Secret (OAuth secret) - Triggers OAuth mode
- `CKO_CLIENT`: Access credential ID (ack_XXXX)
- `CKO_SCOPE`: OAuth scopes - Optional, defaults to 'gateway'
- `CKO_ENVIRONMENT`: 'sandbox' or 'production' - Optional

### Important Notes

> **⚠️ Subdomain is always required:** The `subdomain` option must be passed explicitly when initializing the SDK. It cannot be set via environment variables. Find your unique prefix in [Dashboard → Developers → Overview](https://dashboard.checkout.com/developers).

## Set custom config
Besides the authentication, you also have the option to configure some extra elements about the SDK 
```js
const cko = new Checkout('...', {
    ..., //other authentication config
    host: "https://myProxyExample.com", // in case you need to use a custom host for tests
    timeout: 60000,   // HTTP request timeout in ms
    agent: new http.Agent({ keepAlive: true }), // custom HTTP agent
    httpClient: 'axios' // specify axios httpClient, by default fetch. Optional
});
```

## HTTP Client Configuration

The SDK supports two HTTP clients: **fetch** (default) and **axios**.

### Using Fetch (Default)

By default, the SDK uses the native `fetch` API available in Node.js 18+. No additional configuration is needed:

```js
const cko = new Checkout('sk_sbox_...', {
    pk: 'pk_sbox_...'
    // fetch is used by default
});
```

### Using Axios

To use axios instead, install it and specify it in the configuration:

```bash
npm install axios
```

```js
import https from 'https';

const cko = new Checkout('sk_sbox_...', {
    pk: 'pk_sbox_...',
    httpClient: 'axios'
});

// With custom agent for connection pooling
const ckoWithAgent = new Checkout('sk_sbox_...', {
    pk: 'pk_sbox_...',
    httpClient: 'axios',
    agent: new https.Agent({ 
        keepAlive: true,
        maxSockets: 50 
    })
});
```

**When to use Axios:**
- Node.js versions below 18 (fetch not available)
- Advanced connection pooling requirements
- Custom SSL/TLS configurations
- Proxy configurations with specific needs

## Base URL Configuration (Account-Specific)

**Important:** The base URLs for Checkout.com APIs are **unique to your account**. Each account has a specific prefix (the first 8 characters of your `client_id`, excluding the `cli_` prefix) that must be used in all API requests.

> **⚠️ Deprecation Warning:** When initializing the SDK without the `subdomain` parameter, a deprecation warning will be logged to the console. This functionality is deprecated and will be removed in a future major version. Always provide your account-specific subdomain to ensure compatibility with future releases.

### Finding Your Unique Base URL

1. Sign in to your [Checkout.com Dashboard](https://dashboard.checkout.com)
2. Navigate to **Developers → Overview**
3. Your unique base URL is displayed on the Developer overview page
   - Example: `https://vkuhvk4v.api.checkout.com`
4. Alternatively: Go to **Settings → Account details** → Connection settings

### Prefix Requirements

- Must be alphanumeric (lowercase letters and numbers only)
- Typically 8 characters (first 8 of your client_id)
- No special characters, spaces, or uppercase letters
- Obtain from Dashboard or contact your account manager

### Base URL Formats

These formats match the [Checkout.com API Reference – Base URLs](https://api-reference.checkout.com/#section/Base-URLs) and the OpenAPI `servers` in the project's `swagger-spec.json`.

**Sandbox:**
- API Base URL: `https://{prefix}.api.sandbox.checkout.com`
- OAuth Authorization: `https://{prefix}.access.sandbox.checkout.com/connect/token`

**Production:**
- API Base URL: `https://{prefix}.api.checkout.com`
- OAuth Authorization: `https://{prefix}.access.checkout.com/connect/token`

See [Initialization Methods](#initialization-methods) above for examples of how to configure your SDK with the correct prefix.

### Special Service URLs

The following services use dedicated subdomains that are **not affected** by your account prefix:

- **Balances**: `https://balances.{environment}.checkout.com`
- **Files**: `https://files.{environment}.checkout.com`
- **Forward**: `https://forward.{environment}.checkout.com`
- **Identity Verification**: `https://identity-verification.api.{environment}.checkout.com`
- **Transfers**: `https://transfers.{environment}.checkout.com`

These services use fixed URLs and do not require subdomain configuration.

**Note:** If you are unsure of your client ID or base URL for either environment, contact your account manager or [request support](https://www.checkout.com/docs/support)

# :wrench: SDK Environment (Sandbox/Production)
When using API Keys (pk_XXX + sk_XXX) the SDK will automatically figure out what environment you are using however, if you use access credentials (ack_XXXX), make sure you set the "environment" in the config, as shown above in the initialization. 

# :bulb: Quick Examples

Here are some common operations to get you started. All examples assume you have already initialized the SDK with your credentials and subdomain:

```js
const cko = new Checkout('sk_sbox_...', {
    pk: 'pk_sbox_...',
    subdomain: 'YOUR_PREFIX'  // Your unique prefix from Dashboard
});
```

## Processing a Payment

```js
const payment = await cko.payments.request({
    source: {
        type: 'token',
        token: 'tok_4gzeau5o2uqubbk6fufs3m7p54'
    },
    amount: 1000, // Amount in minor units (e.g., cents)
    currency: 'USD',
    reference: 'ORD-5023-4E89',
    customer: {
        email: 'customer@example.com',
        name: 'John Doe'
    }
});

console.log('Payment ID:', payment.id);
console.log('Status:', payment.status);
```

## Retrieving Payment Details

```js
const paymentDetails = await cko.payments.get('pay_mbabizu24mvu3mela5njyhpit4');

console.log('Payment Status:', paymentDetails.status);
console.log('Amount:', paymentDetails.amount);
```

## Processing a Refund

```js
const refund = await cko.payments.refund('pay_mbabizu24mvu3mela5njyhpit4', {
    amount: 500, // Partial refund
    reference: 'Refund for order 5023'
});

console.log('Refund ID:', refund.action_id);
```

## Creating a Customer

```js
const customer = await cko.customers.create({
    email: 'customer@example.com',
    name: 'John Doe',
    phone: {
        country_code: '+1',
        number: '4155552671'
    }
});

console.log('Customer ID:', customer.id);
```

## Managing Webhooks

```js
// Register a webhook
const webhook = await cko.webhooks.register({
    url: 'https://example.com/webhooks',
    event_types: ['payment_captured', 'payment_declined']
});

// Retrieve webhooks
const webhooks = await cko.webhooks.retrieveWebhooks();
```

# TypeScript Support

The SDK includes TypeScript definitions out of the box. No need to install additional `@types` packages.

```typescript
import { Checkout } from 'checkout-sdk-node';
import type { PaymentRequest, PaymentResponse } from 'checkout-sdk-node';

const cko: Checkout = new Checkout('sk_sbox_...', {
    pk: 'pk_sbox_...',
    subdomain: 'YOUR_PREFIX'  // Your unique prefix from Dashboard
});

const paymentRequest: PaymentRequest = {
    source: {
        type: 'token',
        token: 'tok_4gzeau5o2uqubbk6fufs3m7p54'
    },
    amount: 1000,
    currency: 'USD'
};

const payment: PaymentResponse = await cko.payments.request(paymentRequest);
```

# :package: Available Endpoints

The SDK provides access to all Checkout.com API endpoints:

| Module | Description | Access |
|--------|-------------|--------|
| **Access** | OAuth token management | `cko.access` |
| **Account Updater** | Real-time account updater | `cko.accountUpdater` |
| **Apple Pay** | Apple Pay certificate management | `cko.applePay` |
| **Balances** | Query entity balances | `cko.balances` |
| **~~Baloto~~** | ⚠️ **Deprecated** - Use `cko.payments` instead | ~~`cko.baloto`~~ |
| **~~Boleto~~** | ⚠️ **Deprecated** - Use `cko.payments` instead | ~~`cko.boleto`~~ |
| **Card Metadata** | Retrieve card metadata and BIN data | `cko.cardMetadata` |
| **Customers** | Manage customer profiles | `cko.customers` |
| **Disputes** | Handle payment disputes and chargebacks | `cko.disputes` |
| **Events** | Retrieve payment and dispute events | `cko.events` |
| **~~Fawry~~** | ⚠️ **Deprecated** - Use `cko.payments` instead | ~~`cko.fawry`~~ |
| **Files** | Upload and manage files | `cko.files` |
| **Financial** | Financial actions and operations | `cko.financial` |
| **Forex** | Foreign exchange rates | `cko.forex` |
| **Forward** | Forward API requests | `cko.forward` |
| **~~Giropay~~** | ⚠️ **Deprecated** - Use `cko.payments` instead | ~~`cko.giropay`~~ |
| **Hosted Payments** | Create hosted payment pages | `cko.hostedPayments` |
| **~~iDEAL~~** | ⚠️ **Deprecated** - Use `cko.payments` instead | ~~`cko.ideal`~~ |
| **Identities** | Identity verification | `cko.identities` |
| **Instruments** | Store and manage payment instruments | `cko.instruments` |
| **Issuing** | Card issuing operations | `cko.issuing` |
| **~~Klarna~~** | ⚠️ **Deprecated** - Use `cko.payments` instead | ~~`cko.klarna`~~ |
| **Network Tokens** | Network tokenization | `cko.networkTokens` |
| **~~OXXO~~** | ⚠️ **Deprecated** - Use `cko.payments` instead | ~~`cko.oxxo`~~ |
| **~~Pago Fácil~~** | ⚠️ **Deprecated** - Use `cko.payments` instead | ~~`cko.pagoFacil`~~ |
| **Payment Contexts** | Create and manage payment contexts | `cko.paymentContexts` |
| **Payment Links** | Generate payment links | `cko.paymentLinks` |
| **Payment Methods** | Query available payment methods | `cko.paymentMethods` |
| **Payments** | Process, capture, void, and refund payments | `cko.payments` |
| **Payment Sessions** | Create and manage payment sessions | `cko.paymentSessions` |
| **Payment Setups** | Create and manage payment setups | `cko.paymentSetups` |
| **Platforms** | Platform and sub-entity management | `cko.platforms` |
| **~~Rapipago~~** | ⚠️ **Deprecated** - Use `cko.payments` instead | ~~`cko.rapipago`~~ |
| **Reconciliation** | Access payment reconciliation data | `cko.reconciliation` |
| **Reports** | Generate and retrieve reports | `cko.reports` |
| **Risk** | Manage risk assessments | `cko.risk` |
| **~~SEPA~~** | ⚠️ **Deprecated** - Use `cko.payments` instead | ~~`cko.sepa`~~ |
| **Sessions** | Create payment and 3DS sessions | `cko.sessions` |
| **Sources** | Create and manage payment sources | `cko.sources` |
| **Tokens** | Request payment tokens | `cko.tokens` |
| **Transfers** | Manage payout transfers | `cko.transfers` |
| **Webhooks** | Configure webhook endpoints | `cko.webhooks` |
| **Workflows** | Create and manage payment workflows | `cko.workflows` |

> **Note on Alternative Payment Methods (APMs):** The specific APM endpoints (Baloto, Boleto, Fawry, Giropay, iDEAL, Klarna, OXXO, Pago Fácil, Rapipago, SEPA) are deprecated. Please use the unified `cko.payments` endpoint with the appropriate payment source type instead. See the [API Reference](https://api-reference.checkout.com/) for examples.

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
| AuthenticationError  | 401             | object                  |
| ActionNotAllowed     | 403             | object                  |
| UrlAlreadyRegistered | 409             | undefined               |
| NotFoundError        | 404             | object                  |
| BadGateway           | 502             | undefined               |
| ValidationError      | 422             | object                  |
| TooManyRequestsError | 429             | object/undefined        |
| ValueError           | 429             | string describing error |


# :white_check_mark: Testing

The SDK comes with comprehensive test coverage (97.95% with 816 tests).

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test

# View coverage report
open coverage/index.html
```

## Test Structure

- **Unit Tests** - Mock all HTTP calls using `nock`
- **Integration Tests** - Test against real API (requires valid credentials)
- **Coverage** - 97.95% statements, 90.83% branches, 100% functions

# :book: Examples of usage

You can see examples of how to use the SDK for every endpoint documented in our  [API Reference](https://api-reference.checkout.com/). All you have to do is to navigate to the endpoint you want to use, and select "Node" for the example on the right side.
> NOTE: If you use access credentials (ack_XXXX) the link to the API reference relevant to you will be shared by your Solutions Engineers.

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to get started.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Support

- 📧 Email: [support@checkout.com](mailto:support@checkout.com)
- 📚 Documentation: [https://api-reference.checkout.com/](https://api-reference.checkout.com/)
- 💬 Community: [GitHub Discussions](https://github.com/checkout/checkout-sdk-node/discussions)
