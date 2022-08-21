---
title: "@Slash"
---

<br/>

## Signature

```ts
@Slash(options?: ApplicationCommandOptions): MethodDecoratorEx 
```

## Parameters

### `options`
| type      | default | required |
| --------- | ------- | -------- |
| ApplicationCommandOptions | undefined    | No      |

## Types

### `ApplicationCommandOptions`

```ts
export type ApplicationCommandOptions<TName extends string = string> = {
  botIds?: string[];
  defaultMemberPermissions?: PermissionResolvable;
  description?: string;
  descriptionLocalizations?: LocalizationMap;
  dmPermission?: boolean;
  guilds?: IGuild[];
  name?: TName;
  nameLocalizations?: LocalizationMap;
};
```

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