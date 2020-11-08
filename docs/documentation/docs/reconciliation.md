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
    to: '2019-06-17T16:48:52Z',
});
```

## Paginate the payments JSON report

The API response can be paginated, either by you setting the "limit" parameter, or by having more then 500 records in the response.
Here you have an example of how you would handle the pagination:

:::note

In case the API response contains a<Highlight color="#a45200">next page</Highlight>, the page identifier will be injected in the response object as <Highlight color="#5A522C">"page"</Highlight>.
You can then use that value in a subsequent call to move to the next page. (by using the "after" parameter)

:::

```js
let page;

// Iterate until there is no longer a page to go to
do {
    const reconciliation = await cko.reconciliation.getPayments({
        from: '2020-07-07T17:51:42Z',
        to: '2020-07-07T17:51:59Z',
        limit: 10,
        after: page, // in case you saw a page already, skip it
    });
    // the next page you can go to
    page = reconciliation.page;
    console.log(reconciliation);
} while (page);
```

## Get JSON single payment report

```js
const reconciliation = await cko.reconciliation.getPayment('pay_nezg6bx2k22utmk4xm5s2ughxi');
```

## Get CSV payments report

```js
const reconciliation = await cko.reconciliation.getPaymentsCsv({
    from: '2019-05-17T16:48:52Z',
    to: '2019-06-17T16:48:52Z',
});
```

:::note

This API call returns a Buffer.

:::

## Get JSON statements report

```js
const statements = await cko.reconciliation.getStatements({
    from: '2019-05-17T16:48:52Z',
    to: '2019-06-17T16:48:52Z',
});
```

## Get CSV single statement report

```js
const statement = await cko.reconciliation.getStatementCsv('155613B100981');
```

:::note

This API call returns a Buffer.

:::

## Get Payments Actions

```js
const reconciliation = await cko.reconciliation.getPaymentsActions({
    requested_from: '2020-08-17T16:48:52Z',
    requested_to: '2020-09-17T16:48:52Z',
});
```

## Get Payments Action

```js
const reconciliation = await cko.reconciliation.getPaymentsAction('act_guvhr46cw2kurd6lknczrsh7ma');
```

## Get Payments Actions CSV

```js
const reconciliation = await cko.reconciliation.getPaymentsActionsCsv({
    requested_from: '2020-08-17T16:48:52Z',
    requested_to: '2020-09-17T16:48:52Z',
});
```

:::note

This API call returns a Buffer.

:::

## Get Action

```js
const reconciliation = await cko.reconciliation.getAction('act_h45qukswryqejptltkcylnwgwe');
```

## Example Buffer usage

Here you have an example of an Express route that will trigger the CSV download when accessed:

```js
app.get('/getCsv', async (req, res) => {
    const csv = await cko.reconciliation.getPaymentsCsv({
        from: '2019-05-17T16:48:52Z',
        to: '2019-07-17T16:48:52Z',
    });
    res.setHeader('Content-disposition', `attachment; filename=Payments.csv`);
    res.set('Content-Type', 'text/csv');
    res.end(csv, 'binary');
});
```
