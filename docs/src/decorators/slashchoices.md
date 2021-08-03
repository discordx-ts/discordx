# @SlashChoices

It works exactly like [@SlashChoice](/decorators/slashchoice/) except that you can directly pass an object or enum to define all the choices at once

> The key of the object or enum is what discord shows and the value is the property value (object[key])

```ts
enum TextChoices {
  // WhatDiscordShows = value
  Hello = "Hello",
  "Good Bye" = "GoodBye",
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
    @SlashChoices(TextChoices)
    @SlashChoice("How are you", "question")
    @SlashOption("text")
    text: string,
    interaction: CommandInteraction
  ) {
    interaction.reply(text);
  }
}
```
