---
id: reconciliation
title: Reconciliation
---

You can find a list of request body parameters and possible outcomes [here](https://api-reference.checkout.com/#tag/Reconciliation).

export const Highlight = ({children, color}) => (
<span
style={{
      color: color,
      padding: '0.2rem',
    }}>
{children}
</span>
);

## Get JSON payments report

```js
const reconciliation = await cko.reconciliation.getPayments({
    from: '2019-05-17T16:48:52Z',
    to: '2019-06-17T16:48:52Z'
});
```

## Get JSON single payment report

```js
const reconciliation = await cko.reconciliation.getPayment('pay_nezg6bx2k22utmk4xm5s2ughxi');
```

## Get CSV payments report

```js
const reconciliation = await cko.reconciliation.getPaymentsCsv({
    from: '2019-05-17T16:48:52Z',
    to: '2019-06-17T16:48:52Z'
});
```

:::note

This API call returns a Buffer.

:::

## Get JSON statements report

```js
const statements = await cko.reconciliation.getStatements({
    from: '2019-05-17T16:48:52Z',
    to: '2019-06-17T16:48:52Z'
});
```

## Get CSV single statement report

```js
const statement = await cko.reconciliation.getStatementCsv('155613B100981');
```

:::note

This API call returns a Buffer.

:::

## Example Buffer usage

Here you have an example of an Express route that will trigger the CSV download when accessed:

```js
app.get('/getCsv', async (req, res) => {
    const csv = await cko.reconciliation.getPaymentsCsv({
        from: '2019-05-17T16:48:52Z',
        to: '2019-07-17T16:48:52Z'
    });
    res.setHeader('Content-disposition', `attachment; filename=Payments.csv`);
    res.set('Content-Type', 'text/csv');
    res.end(csv, 'binary');
});
```
