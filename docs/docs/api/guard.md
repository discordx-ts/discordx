---
title: "@Guard"
---

<br/>

## Signature

```ts
@Guard(...fns: GuardFunction[]);
```

## Parameters

### `fns`

| type      | default | required |
| --------- | ------- | -------- |
| GuardFunction[ ] | [ ]     | Yes      |

## Types

### `GuardFunction`

```ts
export type GuardFunction<Type = any, DataType = any> = (
  params: Type,
  client: Client,
  next: Next,
  data: DataType
) => any;
```