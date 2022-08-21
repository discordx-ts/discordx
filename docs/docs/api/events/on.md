---
title: "@On"
---

<br/>

## Signature

```ts
On(options?: EventOptions): MethodDecoratorEx 
```

## Parameters

### `options`
| type      | default | required |
| --------- | ------- | -------- |
| EventOptions | undefined     | Yes      |

## Types

### `EventOptions`

```ts
export type EventOptions = {
  botIds?: string[];
  event: keyof ClientEvents;
};
```