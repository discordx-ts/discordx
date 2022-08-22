---
title: "@ContextMenu"
---

<br/>

## Signature

```ts
@ContextMenu(options: ApplicationCommandOptions): MethodDecoratorEx 
```

## Parameters

### `options`

| type      | default | required |
| --------- | ------- | -------- |
| ApplicationCommandOptions | undefined    | Yes      |

## Types

### `ApplicationCommandOptions`

```ts
export type ApplicationCommandOptions<TName extends string = string> = {
  botIds?: string[];
  defaultMemberPermissions?: PermissionResolvable;
  // description?: string;
  // descriptionLocalizations?: LocalizationMap;
  dmPermission?: boolean;
  guilds?: IGuild[];
  name?: TName;
  nameLocalizations?: LocalizationMap;
};
```