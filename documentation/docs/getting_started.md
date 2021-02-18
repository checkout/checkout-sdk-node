---
id: getting_started
title: Getting Started
sidebar_label: Getting Started
---

The Checkout.com Node.JS SDK makes it easy to interact with the Unified Payments API. You can easily accept payments from cards, digital wallets and the most popular alternative payment methods, as well as pay out to a variety of destinations, all using the same integration.

[![codecov](https://codecov.io/gh/checkout/checkout-sdk-node/branch/master/graph/badge.svg)](https://codecov.io/gh/checkout/checkout-sdk-node)
[![Build Status](https://travis-ci.org/checkout/checkout-sdk-node.svg?branch=master)](https://travis-ci.orgcheckout/checkout-sdk-node)
[![codebeat badge](https://codebeat.co/badges/b41734ff-7fb5-4867-94d3-ab0729bb6b69)](https://codebeat.co/projects/github-com-ioan-ghisoi-cko-checkout-node-sdk-remake)
[![Try it on RunKit](https://badge.runkitcdn.com/checkout-sdk-node.svg)](https://npm.runkit.com/checkout-sdk-node)

## Get a test account

If you are starting the integration process, and you want to start interacting with Checkout.com's API, you will need a test account, so you can get your API keys.

export const RedirectButton = ({text, link}) => (
<a
href={link}
target="\_blank"
className="get-test-account">{text}</a>
);

<RedirectButton text="Get a test account" link="https://www.checkout.com/get-test-account" />

## Authentication

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

When you sign up for an account, you are given a secret and public API key pair. They will be used to initialise the SDK so you can interact with the various endpoints. You can find the keys by navigating to the Checkout.com's Hub <Highlight color="#1877F2">Settings > Channels > API keys Section</Highlight>.

Unless required, most of the endpoints covered by the SDK only need the secret key, without the public key. If you do not use one of those endpoints that require the public key, you do not have to specify it when initializing the SDK.

:::warning

Never share your secret keys. Keep them guarded and secure.

:::

## Payload and Responses

The SDK makes use of dynamic payloads both for the requests and for the API responses. If you want to see all the parameters that you can provide, as well as examples of possible responses, please follow the Checkout.com [API Reference](https://api-reference.checkout.com/).
