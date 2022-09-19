# @ContextMenu

create discord context menu options with ease!

Here are some example screenshots:

![](../../../../static/img/user-context.jpg)
![](../../../../static/img/message-context.jpg)

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
