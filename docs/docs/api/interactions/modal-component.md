---
title: "@ModalComponent"
---

<br/>

## Signature

```ts
@ModalComponent(options?: ComponentOptions): MethodDecoratorEx
```

## Parameters

## `options`
| type      | default | required |
| --------- | ------- | -------- |
| ComponentOptions | undefined    | No      |

## Types

### `ComponentOptions`

```ts
export type ComponentOptions<T extends string = string> = {
  botIds?: string[];
  guilds?: IGuild[];
  id?: NotEmpty<T> | RegExp;
};
```