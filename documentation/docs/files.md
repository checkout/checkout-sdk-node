---
id: files
title: Files
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

You can find a list of request body parameters and possible outcomes [here](http://localhost:3000/#tag/Disputes/paths/~1files/post).

## Upload file

```js
const file = await cko.files.upload({
    path: fs.createReadStream('./test/files/evidence.jpg'),
    purpose: 'dispute_evidence'
});
```

## Get file information

```js
const getFile = await cko.files.getFile('file_zna32sccqbwevd3ldmejtplbhu');
```
