# 2022-jul-stackbit-next-plugin

## Usage

```ts
const { withStackbit } = require('experimental-next-stackbit');

module.exports = withStackbit({});
```

Now running `next dev` additionally launches the Stackbit dev server (equivalent to running `stackbit dev` in a second terminal). You should see some output similar to:

```
info: Server started. Forwarding requests to: localhost:3000
info: ⚡ Open https://app.stackbit.com/local/eyJpIjoiZTg4YjJXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXiZ2l0In0= in your browser
```
