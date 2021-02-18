---
id: instruments
title: Instruments
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

You can find a list of request body parameters and possible outcomes [here](https://api-reference.checkout.com/#tag/Instruments).

The SDK will infer the type of the instrument, if not provided.

## Request a <Highlight color="#25c2a0">card instrument</Highlight>

```js
const instrument = await cko.instruments.create({
    token: 'tok_bzi43qc6jeee5mmnfo4gnsnera', // token obtainer form Checkout.Frames of the mobile SDKs
});
```

## Get an instrument

```js
const instrument = await cko.instruments.get('src_udfsqsgpjykutgs26fiejgizau');
```

## Update an instrument

```js
const instrumentResponse = await cko.instruments.update('src_udfsqsgpjykutgs26fiejgizau', {
    expiry_year: 2030,
});
```
