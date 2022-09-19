---
title: "@SlashOption"
sidebar_position: 3
---

A slash command can have multiple options (parameters)

> query is an option in this image

![](../../../../static/img/options.png)

## Signature

```ts
SlashOption(options: SlashOptionOptions);
```

## Declare an option

To declare an option you simply use the `@SlashOption` decorator before a method parameter

```ts
@Discord()
class Example {
  @Slash()
  add(
    @SlashOption({ description: "x value", name: "x" }) x: number,
    @SlashOption({ description: "y value", name: "y" }) y: number,
    interaction: CommandInteraction
  ) {
    interaction.reply(String(x + y));
  }
}
```

## Autocomplete option

> Autocomplete interactions allow your application to dynamically return option suggestions to a user as they type. - discord

### Method - Resolver

When defining an autocomplete slash option, you can define a resolver for autocomplete inside `@SlashOption` to simplify things.

```ts
@SlashOption({
  autocomplete: function (
    interaction: AutocompleteInteraction
  ) {
      interaction.respond([
        { name: "option a", value: "a" },
        { name: "option b", value: "b" },
      ]);
  },
  name: "autocomplete",
  type: ApplicationCommandOptionType.String,
})
input: string,
```

### Method - Boolean

discordx will call your command handler with autocomplete interaction if you use boolean instead of resolver.

```ts
@SlashOption({
  autocomplete: true,
  name: "choice",
  type: ApplicationCommandOptionType.String,
}) input: string,
interaction: CommandInteraction | AutocompleteInteraction
```

### Example - All Methods

```ts
@Discord()
class Example {
  myCustomText = "Hello discordx";

  @Slash()
  autocomplete(
    @SlashOption({
      autocomplete: true,
      name: "option-a",
      type: ApplicationCommandOptionType.String,
    })
    searchText: string,
    @SlashOption({
      autocomplete: function (
        this: Example,
        interaction: AutocompleteInteraction
      ) {
        // The normal function has this (keyword), therefore class reference is available
        console.log(this.myCustomText);

        // resolver for option b
        interaction.respond([
          { name: "option c", value: "d" },
          { name: "option d", value: "c" },
        ]);
      },
      name: "option-b",
      type: ApplicationCommandOptionType.String,
    })
    searchText2: string,
    @SlashOption({
      autocomplete: (interaction: AutocompleteInteraction) => {
        // This is not available for the arrow function, so there is no class reference
        interaction.respond([
          { name: "option e", value: "e" },
          { name: "option f", value: "f" },
        ]);
      },
      name: "option-c",
      type: ApplicationCommandOptionType.String,
    })
    searchText3: string,
    interaction: CommandInteraction | AutocompleteInteraction
  ): void {
    // If autocomplete is not handled above, it will be passed to handler (see option-a definition)
    if (interaction.isAutocomplete()) {
      const focusedOption = interaction.options.getFocused(true);
      // resolver for option a
      if (focusedOption.name === "option-a") {
        interaction.respond([
          { name: "option a", value: "a" },
          { name: "option b", value: "b" },
        ]);
      }
    } else {
      interaction.reply(`${searchText}-${searchText2}-${searchText3}`);
    }
  }
}
```

## Automatic typing

An option infer the type from TypeScript in this example, discord.**ts** knows that your options are both `number` because you typed the parameters

discord.**ts** convert automatically the inferred type into discord.**js** options types

```ts
@Discord()
class Example {
  @Slash()
  add(
    @SlashOption({ description: "x value", name: "x" }) x: number,
    @SlashOption({ description: "y value", name: "y" }) y: number,
    interaction: CommandInteraction
  ) {
    interaction.reply(String(x + y));
  }
}
```

## Manual typing

If you want to specify the type manually you can do it:

```ts
@Discord()
class Example {
  @Slash({ name: "get-id" })
  getID(
    @SlashOption("x", { type: ApplicationCommandOptionType.Mentionable })
    mentionable: GuildMember | User | Role,
    interaction: CommandInteraction
  ) {
    interaction.reply(mentionable.id);
  }
}
```

## Autocompletion (Option's choices)

You can use the [@SlashChoice](docs/discordx/decorators/command/slash-choice) decorator

## Option order

**You have to put required options before optional ones**  
Or you will get this error:

```
(node:64399) UnhandledPromiseRejectionWarning: DiscordAPIError: Invalid Form Body
options[1]: Required options must be placed before non-required options
```
