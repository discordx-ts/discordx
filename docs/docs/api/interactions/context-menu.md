---
title: "@ContextMenu"
---

<br/>

# 📍 Signature

```ts
@ContextMenu<TName extends string>(
  options: Omit<
    ApplicationCommandOptions<NotEmpty<TName>> & {
      type: Exclude<ApplicationCommandType, ApplicationCommandType.ChatInput>;
    },
    "description" | "descriptionLocalizations"
  >
): MethodDecoratorEx 
```

# 📍 Parameters

## `options`
| type      | default | required |
| --------- | ------- | -------- |
| ApplicationCommandOptions | undefined    | Yes      |

# 📍 Types

## `ApplicationCommandOptions`

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