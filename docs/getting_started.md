---
id: getting_started
title: Getting Started
---

<div class="badges">
  <img src="https://img.shields.io/badge/status-BETA-red.svg" alt="Status">
  <a href="https://codecov.io/gh/checkout/checkout-sdk-node"><img
                src="https://codecov.io/gh/checkout/checkout-sdk-node/branch/master/graph/badge.svg"
                alt="codecov"></a>
        <a href="https://travis-ci.orgcheckout/checkout-sdk-node"><img
                src="https://travis-ci.org/checkout/checkout-sdk-node.svg?branch=master"
                alt="Build Status"></a>
        <a
            href="https://codebeat.co/projects/github-com-ioan-ghisoi-cko-checkout-node-sdk-remake"><img
                src="https://codebeat.co/badges/b41734ff-7fb5-4867-94d3-ab0729bb6b69"
                alt="codebeat badge"></a>
        <a href="https://npm.runkit.com/checkout-sdk-node"><img
                src="https://badge.runkitcdn.com/checkout-sdk-node.svg"
                alt="Try it on RunKit"></a>
</div>

The Checkout.com Node.JS SDK makes it easy to interact with the _Unified Payments API_. You can easily accept payments from cards, digital wallets and the most popular alternative payment methods, as well as pay out to a variety of destinations, all using the same integration.

## Get a test account

If you are starting the integration process, and you want to start interacting with Checkout.com's API, you will need a test account, so you can get your API keys.

<a href="http://www.checkout.com/get-test-account" target="_blank"
        class="get-test-account">Get Test Account</a>

## Authentication

When you sign up for an account, you are given a secret and public API key pair. They will be used to initialise the SDK so you can interact with the various endpoints. You can find the keys by navigating to the Checkout.com's Hub **Settings > Channels > API keys Section**

Unless required, most of the endpoints covered by the SDK only need the secret key, without the public key. If you do not use one of those endpoints that require the public key, you do not have to specify it when initialising the SDK.

> Never share your secret keys. Keep them guarded and secure.

## Payload and Responses

The SDK makes use of dynamic payloads both for the requests and for the API responses. If you want to see all the parameters that you can provide, as well as examples of posible responses, please follow the Checkout.com [API Reference](https://www.checkout.com/get-test-account).
