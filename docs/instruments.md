---
id: instruments
title: Instruments
---

You can find a list of request body parameters and possible outcomes [here](https://api-reference.checkout.com/#tag/Instruments).

The SDK will infer the type of the instrument, if not provided.

## Request an instrument

```js
const instrument = await cko.instruments.create({
    token: 'tok_bzi43qc6jeee5mmnfo4gnsnera'
});
```
