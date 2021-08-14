# @ContextMenu

create discord context menu options with ease!

Here are some example screenshots:

![](../../../static/img/user-context.jpg)
![](../../../static/img/message-context.jpg)

# Example

```ts
@Discord()
export abstract class contextTest {
  @ContextMenu("MESSAGE", "message context")
  async messageHandler(interaction: Interaction) {
    console.log("I am message");
  }

  @ContextMenu("USER", "user context")
  async userHandler(interaction: Interaction) {
    console.log("I am user");
  }
}
```
