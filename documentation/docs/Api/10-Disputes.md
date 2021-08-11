---
id: disputes
title: Disputes
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

You can find a list of request body parameters and possible outcomes [here](https://api-reference.checkout.com/#tag/Disputes).

## Get disputes

```js
const disputes = await cko.disputes.get({
    limit: 5,
    id: 'dsp_bc94ebda8d275i461229'
});
```

## Get dispute details

```js
const disputeDetails = await cko.disputes.getDetails('dsp_bc94ebda8d275i461229');
```

## Accept dispute

```js
const accept = await cko.disputes.accept('dsp_bc94ebda8d275i461229');
```

## Provide dispute evidence

```js
const evidence = await cko.disputes.provideEvidence('dsp_bc94ebda8d275i461229', {
    proof_of_delivery_or_service_text: 'http://checkout.com/document.pdf'
});
```

## Get dispute evidence

```js
const getEvidence = await cko.disputes.getEvidence('dsp_bc94ebda8d275i461229');
```

## Submit dispute evidence

```js
const submitEvidence = await cko.disputes.submit('dsp_bc94ebda8d275i461229');
```
