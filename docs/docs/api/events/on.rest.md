---
title: "@On.rest"
---

<br/>

## Signature

```ts
@On.rest(options?: RestEventOptions): MethodDecoratorEx 
```

## Parameters

### `options`

| type      | default | required |
| --------- | ------- | -------- |
| RestEventOptions  | undefined     | No      |

## Types

### `RestEventOptions`

```ts
export type RestEventOptions = {
  botIds?: string[];
  event: keyof RestEvents;
};
```