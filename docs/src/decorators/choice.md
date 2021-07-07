# @Choice

An option of a Slash command can implement an autocompletion feature for `string` and `number` types

![](/discord.ts/choices.png)

## Setup autocompletion

You just decorate your parameter with one or multiple @Choice !

```ts
@Discord()
class DiscordBot {
  @Slash("iam")
  iam(
    @Choice("Human", "human")
    @Choice("Astraunot", "astro")
    @Choice("Dev", "dev")
    @Option("what", { description: "What are you?" })
    what: string,

    interaction: CommandInteraction
  ) {
    interaction.reply(what);
  }
}
```

## Params

`@Choice(name: string, value: string | number)`

### Name

`string`  
You have to set a diplayed name for your Choice

### Value

`string | number`  
You have to set a value for your choice, if the user select "Astraunot", you will receive the value "astro"
