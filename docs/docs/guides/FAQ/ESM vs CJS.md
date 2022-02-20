---
sidebar_label: ESM vs CJS
---

# ECMAScript (ESM) vs CommonJS (CJS)

## Basics

This document provides a very basic overview, please refer to the linked references for more information.

### What is a module?

A module is simply a JavaScript or TypeScript file.

### What is module system?

A module is a collection of JavaScript code written in a file. A module's variables, functions are not available for use unless they are exported from the module file.

There are two main module systems:

- [ECMAScript (ESM)](https://nodejs.org/docs/latest/api/esm.html)
- [CommonJS (CJS)](https://nodejs.org/docs/latest/api/modules.html)

### How to determine my module system?

Look at the `type` field in `package.json`.

_The "type" field defines the module format that Node.js uses for all .js files that have that package.json file as their nearest parent_ - [Node.js](https://nodejs.org/docs/latest/api/packages.html#type)

:::info
CommonJS is used if type field is not defined.
:::

#### ESM

```ts title="package.json"
{
    "type":"module"
}
```

#### CJS

```ts title="package.json"
{
    "type":"commonjs"
}
```

### Import in CJS vs ESM

> ESM: Imports should end with a extension.

vs

> CJS: I don't care!

:::info
In the case of TypeScript or JavaScript, please use the extension `.js`
:::

```ts
import { helper } from "./foo"; // ❌ only works in CJS

import { helper } from "./foo.js"; // ✅ works in ESM & CJS
```
