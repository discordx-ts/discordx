---
title: "@SlashChoice"
sidebar_position: 1
---

An option of a Slash command can implement an autocompletion feature for `string` and `number` types

![](../../../../static/img/choices.png)

## Signature

```ts
SlashChoice(...choices: string[]);
SlashChoice(...choices: number[]);
SlashChoice(...choices: SlashChoiceType[]);
```

## Setup autocompletion

You just decorate your parameter with one or multiple @SlashChoice !

```ts
@Discord()
class Example {
  @Slash({ description: "I am" })
  iam(
    @SlashChoice({ name: "Human", value: "human" })
    @SlashChoice({ name: "Astronaut", value: "astronaut" })
    @SlashChoice({ name: "Dev", value: "dev" })
    @SlashOption({
      description: "What are you?",
      name: "what",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    what: string,

    @SlashChoice(10, 20, 30)
    @SlashOption({
      description: "fuel",
      name: "fuel",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    fuel: number,

    @SlashChoice("Patrol", "Diesel")
    @SlashOption({
      description: "type",
      name: "type",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
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
  @Slash({ description: "hello" })
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
    @SlashOption({
      description: "text",
      name: "text",
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    text: string,
    interaction: CommandInteraction
  ) {
    interaction.reply(text);
  }
}
```
