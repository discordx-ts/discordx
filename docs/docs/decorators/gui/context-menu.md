# @ContextMenu

create discord context menu options with ease!

Here are some example screenshots:

![](../../../static/img/user-context.jpg)
![](../../../static/img/message-context.jpg)

## Example

```ts
@Discord()
class Example {
  @ContextMenu({
    name: "Hello from discordx",
    type: ApplicationCommandType.Message,
  })
  messageHandler(interaction: MessageContextMenuCommandInteraction): void {
    console.log("I am message");
    interaction.reply("message interaction works");
  }

  @ContextMenu({
    name: "Hello from discordx",
    type: ApplicationCommandType.User,
  })
  userHandler(interaction: UserContextMenuCommandInteraction): void {
    console.log(`Selected user: ${interaction.targetId}`);
    interaction.reply("user interaction works");
  }
}
```

## Signature

```ts
ContextMenu(
  options: Omit<
    ApplicationCommandOptions & {
      type: Exclude<ApplicationCommandType, ApplicationCommandType.ChatInput>;
    },
    "description" | "descriptionLocalizations"
  >
)
```

## Parameters

### options

Context menu options

| type                      | default | required |
| ------------------------- | ------- | -------- |
| ApplicationCommandOptions |         | yes      |

## Type: ApplicationCommandOptions

### botIds

Array of bot ids, for which only the event will be executed.

| type      | default | required |
| --------- | ------- | -------- |
| string[ ] | [ ]     | false    |

### defaultMemberPermissions

The slash command default member permissions

| type   | default | required |
| ------ | ------- | -------- |
| bigint | 0n      | false    |

### dmPermission

The slash command dm permission

| type    | default | required |
| ------- | ------- | -------- |
| boolean | true    | false    |

### guilds

The guilds where the command is created

| type        | default | required |
| ----------- | ------- | -------- |
| Snowflake[] | [ ]     | false    |

### name

The slash command name

| type   | default     | required |
| ------ | ----------- | -------- |
| string | method name | false    |

### nameLocalizations

The slash command name localizations

| type            | default   | required |
| --------------- | --------- | -------- |
| LocalizationMap | undefined | false    |

### type

Context menu type

| type                                                              | default | required |
| ----------------------------------------------------------------- | ------- | -------- |
| Exclude<ApplicationCommandType, ApplicationCommandType.ChatInput> |         | Yes      |
