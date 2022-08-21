---
title: "@Once.rest"
---

<br/>

## Signature

```ts
Once.rest(options?: RestEventOptions): MethodDecoratorEx 
```

## Parameters

### `options`
| type      | default | required |
| --------- | ------- | -------- |
| RestEventOptions  | undefined     | false      |

## Types

### `RestEventOptions `

```ts
export type RestEventOptions = {
  botIds?: string[];
  event: keyof RestEvents;
};
```