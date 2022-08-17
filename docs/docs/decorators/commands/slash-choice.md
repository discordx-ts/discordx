# @SlashChoice

An option of a Slash command can implement an autocompletion feature for `string` and `number` types

![](../../../static/img/choices.png)

## Setup autocompletion

You just decorate your parameter with one or multiple @SlashChoice !

```ts
@Discord()
class Example {
  @Slash()
  iam(
    @SlashChoice({ name: "Human", value: "human" })
    @SlashChoice({ name: "Astronaut", value: "astronaut" })
    @SlashChoice({ name: "Dev", value: "dev" })
    @SlashOption({ description: "What are you?", name: "what" })
    what: string,

    @SlashChoice(10, 20, 30)
    @SlashOption({ name: "fuel" })
    fuel: number,

    @SlashChoice("Patrol", "Diesel")
    @SlashOption({ name: "type" })
    type: number,

    interaction: CommandInteraction
  ) {
    interaction.reply(`what: ${what}, fuel: ${fuel}, type: ${type}`);
  }
}
```

## Use object or enum to define all the choices at once

```ts
enum TextChoices {
  // WhatDiscordShows = value
  Hello = "Hello",
  "Good Bye" = "Good Bye",
}

@Discord()
class Example {
  @Slash()
  hello(
    @SlashChoice(
      {
        name: TextChoices[TextChoices.Hello],
        value: TextChoices.Hello,
      },
      {
        name: TextChoices[TextChoices["Good Bye"]],
        value: TextChoices["Good Bye"],
      }
    )
    @SlashChoice({ name: "How are you", value: "hay" })
    @SlashOption({ name: "text" })
    text: string,
    interaction: CommandInteraction
  ) {
    interaction.reply(text);
  }
}
```

## Signature

```ts
SlashChoice(...choices: string[]);
SlashChoice(...choices: number[]);
SlashChoice(...choices: SlashChoiceType[]);
```

## Parameters

### Name

You have to set a displayed name for your choice

| type   | default   | required |
| ------ | --------- | -------- |
| string | undefined | Yes      |

### Value

You have to set a value for your choice, if the user select "Astronaut", you will receive the value "astronaut"

| type             | default     | required |
| ---------------- | ----------- | -------- |
| string \| number | choice name | No       |
