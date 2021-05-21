# @Choice
It works exactly like [@Choice](/discord.ts/decorators/choice) except that you can directly pass an object or enum to define all the choices at once

```ts
enum TextChoices {
  Hello = "Hello",
  "Good Bye" = "GoodBye"
}

// Could be
// const textChoices = {
//   Hello: "Hello",
//   ["Good Bye"]: "GoodBye"
// }

@Discord()
class DiscordBot {
  @Slash("hello")
  @Group("text")
  hello(
    @Choices(TextChoices)
    @Choice("How are you", "question")
    @Option("text")
    text: string,
    interaction: CommandInteraction
  ) {
    interaction.reply(text);
  }
}
```
