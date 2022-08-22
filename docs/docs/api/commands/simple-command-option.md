---
title: "@SimpleCommandOption"
---

<br/>

## Signature

```ts
@SimpleCommandOption(options: SimpleCommandOptionOptions): ParameterDecoratorEx  
```

## Parameters

### `options`

| type      | default | required |
| --------- | ------- | -------- |
| SimpleCommandOptionOptions | undefined    | Yes      |

## Types

### `SimpleCommandOptionOptions`

```ts
export type SimpleCommandOptionOptions<T extends string = string> = {
  description?: string;
  name: NotEmpty<T>;
  type?: SimpleCommandOptionType;
};
```

### `SimpleCommandOptionType`

```ts
export enum SimpleCommandOptionType {
  String,
  Number,
  Boolean,
  User,
  Channel,
  Role,
  Mentionable,
}
```