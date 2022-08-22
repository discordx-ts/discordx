---
title: "@SlashGroup"
---

<br/>

## Signature

```ts
@SlashGroup(options: string | SlashGroupOptions, root?: string): ClassMethodDecorator 
```

## Parameters

### `options`

| type      | default | required |
| --------- | ------- | -------- |
| string \| SlashGroupOptions | undefined    | Yes      |

### `root`

| type      | default | required |
| --------- | ------- | -------- |
| string  | undefined    | No      |

## Types

### `SlashGroupOptions`

```ts
export type SlashGroupOptions<TName extends string = string> =
  | SlashGroupRoot<TName>
  | SlashGroupSubRoot<TName>;
```

### `SlashGroupRoot`

```ts
export type SlashGroupRoot<TName extends string = string> =
  SlashGroupBase<TName> & {
    defaultMemberPermissions?: PermissionResolvable;
    dmPermission?: boolean;
    root?: undefined;
  };
```

### `SlashGroupSubRoot`

```ts
export type SlashGroupRoot<TName extends string = string> =
  SlashGroupBase<TName> & {
    defaultMemberPermissions?: PermissionResolvable;
    dmPermission?: boolean;
    root?: undefined;
  };
```