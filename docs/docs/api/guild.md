---
title: "@Guild"
---

<br/>

## Signature

```ts
@Guild(...guildIds: IGuild[]): ClassMethodDecorator;
```

## Parameters

### `guildIds`

| type      | default | required |
| --------- | ------- | -------- |
| IGuild[ ] | [ ]      | Yes      |

## Types

### `IGuild`

```ts
export type IGuild =
  | Snowflake
  | Snowflake[]
  | ((
      client: Client,
      command:
        | DApplicationCommand
        | DComponent
        | DReaction
        | SimpleCommandMessage
        | undefined
    ) => Snowflake | Snowflake[] | Promise<Snowflake> | Promise<Snowflake[]>);
```