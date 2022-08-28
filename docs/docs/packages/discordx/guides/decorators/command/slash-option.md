---
title: "@SlashOption"
sidebar_position: 3
---

A slash command can have multiple options (parameters)

> query is an option in this image

![](../../../../../../static/img/options.png)

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

## Type inference

- `ApplicationCommandOptionType.String`
  **Inferred from `String`**

  ```ts
  fn(
    @SlashOption("x") channel: string
  )
  ```

- `ApplicationCommandOptionType.Boolean`
  **Inferred from `Boolean`**

  ```ts
  fn(
    @SlashOption("x") channel: boolean,
  )
  ```

- `ApplicationCommandOptionType.Number`
  **Inferred from `Number`**

  ```ts
  fn(
    @SlashOption("x") channel: number,
  )
  ```

- `ApplicationCommandOptionType.Role`
  **Inferred from `Role`**

  ```ts
  fn(
    @SlashOption("x") channel: Role,
  )
  ```

- `ApplicationCommandOptionType.User`
  **Inferred from `User` | `GuildMember` (you will receive GuildMember if present otherwise User)**

  ```ts
  fn(
    @SlashOption("x") channel: User,
  )
  ```

- `ApplicationCommandOptionType.Channel`
  **Inferred from `Channel` (or `TextChannel` / `VoiceChannel`, not recommended)**

  ```ts
  fn(
    @SlashOption("x") channel: Channel,
  ```

- `ApplicationCommandOptionType.Mentionable`
  **No inference, use:**

  ```ts
  fn(
    @SlashOption({name:"x", type: ApplicationCommandOptionType.Mentionable })
    channel: GuildMember | User | Role,
  )
  ```

- `ApplicationCommandOptionType.Integer`
  No inference, use [@SlashOption](docs/packages/discordx/guides/decorators/command/slash-option)

- `ApplicationCommandOptionType.SubCommand`
  No inference, use [@SlashGroup](docs/packages/discordx/guides/decorators/command/slash-group)

- `ApplicationCommandOptionType.SubCommandGroup`
  No inference, use [@SlashGroup](docs/packages/discordx/guides/decorators/command/slash-group)

## Signature

```ts
SlashOption(options: SlashOptionOptions);
```

## Parameters

### options

Slash command option options

| type               | default | required |
| ------------------ | ------- | -------- |
| SlashOptionOptions |         | Yes      |

## Type: SlashOptionOptions

### autocomplete

Enable autocomplete interactions for this option

| type                             | default | required |
| -------------------------------- | ------- | -------- |
| boolean \| autocomplete resolver | false   | false    |

### channelTypes

If the option is a channel type, the channels shown will be restricted to these types

| type                                          | default   | required |
| --------------------------------------------- | --------- | -------- |
| Exclude<ChannelTypes, ChannelTypes.UNKNOWN>[] | undefined | false    |

### description

The slash option description

| type   | default                   | required |
| ------ | ------------------------- | -------- |
| string | OPTION_NAME - OPTION_TYPE | false    |

### descriptionLocalizations

The slash option description localizations

| type            | default   | required |
| --------------- | --------- | -------- |
| LocalizationMap | undefined | false    |

### maxLength

The slash option max length

| type   | default   | required |
| ------ | --------- | -------- |
| number | undefined | false    |

### maxValue

The slash option max value

| type   | default   | required |
| ------ | --------- | -------- |
| number | undefined | false    |

### minLength

The slash option min length

| type   | default   | required |
| ------ | --------- | -------- |
| number | undefined | false    |

### minValue

The slash option min value

| type   | default   | required |
| ------ | --------- | -------- |
| number | undefined | false    |

### name

The slash option name

| type   | default   | required |
| ------ | --------- | -------- |
| string | undefined | true     |

### nameLocalizations

The slash option name localizations

| type            | default   | required |
| --------------- | --------- | -------- |
| LocalizationMap | undefined | false    |

### required

Set slash option is required

| type    | default | required |
| ------- | ------- | -------- |
| boolean | true    | false    |

### type

The slash option type

| type                         | default   | required |
| ---------------------------- | --------- | -------- |
| ApplicationCommandOptionType | inference | false    |

## Autocompletion (Option's choices)

You can use the [@SlashChoice](docs/packages/discordx/guides/decorators/command/slash-choice) decorator

## Option order

**You have to put required options before optional ones**  
Or you will get this error:

```
(node:64399) UnhandledPromiseRejectionWarning: DiscordAPIError: Invalid Form Body
options[1]: Required options must be placed before non-required options
```
