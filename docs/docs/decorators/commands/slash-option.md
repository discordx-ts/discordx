# @SlashOption

A slash command can have multiple options (parameters)

> query is an option in this image

![](../../../static/img/options.png)

## Declare an option

To declare an option you simply use the `@SlashOption` decorator before a method parameter

```ts
@Discord()
class DiscordBot {
  @Slash("add")
  add(
    @SlashOption("x", { description: "x value" })
    x: number,
    @SlashOption("y", { description: "y value" })
    y: number,

    interaction: CommandInteraction
  ) {
    interaction.reply(String(x + y));
  }
}
```

## Autocomplete option

When defining an autocomplete slash option, you can define a resolver for autocomplete inside `@SlashOption` to simplify things. If you set autocomplete to true, you have to handle it manually in your main function.

```ts
@Discord()
class DiscordBot {
  @Slash("autocomplete")
  autocomplete(
    @SlashOption("option-a", {
      autocomplete: true,
      type: "STRING",
    })
    searchText: string,
    @SlashOption("option-b", {
      autocomplete: function myResolver(
        this: AppDiscord1,
        interaction: AutocompleteInteraction
      ) {
        // normal function, have this, so class reference is passed
        console.log(this.myCustomText);
        // resolver for option b
        interaction.respond([
          { name: "option c", value: "d" },
          { name: "option d", value: "c" },
        ]);
      },
      type: "STRING",
    })
    searchText2: string,
    @SlashOption("option-c", {
      autocomplete: (interaction: AutocompleteInteraction) => {
        // arrow function does not have this, so class reference is not available
        interaction.respond([
          { name: "option e", value: "e" },
          { name: "option f", value: "f" },
        ]);
      },
      type: "STRING",
    })
    searchText3: string,
    interaction: CommandInteraction | AutocompleteInteraction
  ): void {
    // autocomplete will passed to function if not handle above
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
class DiscordBot {
  @Slash("add")
  add(
    @SlashOption("x", { description: "x value" })
    x: number,
    @SlashOption("y", { description: "y value" })
    y: number,
    interaction: CommandInteraction
  ) {
    interaction.reply(String(x + y));
  }
}
```

## Manual typing

If you want to specify the type manually you can do it:

```ts
import { TextChannel, VoiceChannel, CommandInteraction } from "discord.js";

@Discord()
class DiscordBot {
  @Slash("getID")
  getID(
    @SlashOption("x", { type: "MENTIONABLE" })
    mentionable: GuildMember | User | Role,
    interaction: CommandInteraction
  ) {
    interaction.reply(mentionable.id);
  }
}
```

## Type inference

- `"STRING"`
  **Inferred from `String`**

  ```ts
  fn(
    @SlashOption("x")
    channel: string,
  )
  ```

- `"BOOLEAN"`
  **Inferred from `Boolean`**

  ```ts
  fn(
    @SlashOption("x")
    channel: boolean,
  )
  ```

- `"NUMBER"`
  **Inferred from `Number`**

  ```ts
  fn(
    @SlashOption("x")
    channel: number,
  )
  ```

- `"ROLE"`
  **Inferred from `Role`**

  ```ts
  fn(
    @SlashOption("x")
    channel: Role,
  )
  ```

- `"USER"`
  **Inferred from `User` | `GuildMember` (you will receive GuildMember if present otherwise User)**

  ```ts
  fn(
    @SlashOption("x")
    channel: User,
  )
  ```

- `"CHANNEL"`
  **Inferred from `Channel` (or `TextChannel` / `VoiceChannel`, not recommended)**

  ```ts
  fn(
    @SlashOption("x")
    channel: Channel,
  ```

- `"MENTIONABLE"`
  **No inference, use:**

  ```ts
  fn(
    @SlashOption("x", { type: "MENTIONABLE" })
    channel: GuildMember | User | Role,
  )
  ```

- `"INTEGER"`
  No inference, use [@SlashOption](/docs/decorators/commands/slash-option)

- `"SUB_COMMAND"`
  No inference, use [@SlashGroup](/docs/decorators/commands/slash-group)

- `"SUB_COMMAND_GROUP"`
  No inference, use [@SlashGroup](/docs/decorators/commands/slash-group)

## Signature

```ts
SlashOption(name: string);
SlashOption(
  name: string,
  options?: SlashOptionOptions
)
```

## Parameters

### name

Define name of this option

| type   | default | required |
| ------ | ------- | -------- |
| string |         | Yes      |

### options

Multiple options, check below.

| type   | default   | required |
| ------ | --------- | -------- |
| object | undefined | No       |

#### `autocomplete`

Enable autocomplete interactions for this option
| type | default |
| -------------------------------- | ------- |
| boolean \| autocomplete resolver | false |

#### `Description`

Set description of this option

| type   | default                   |
| ------ | ------------------------- |
| string | OPTION_NAME - OPTION_TYPE |

#### `Required`

Set option required or optional

| type    | default |
| ------- | ------- |
| boolean | true    |

#### `Type`

Define type of your command option

| type                                                                             | default   |
| -------------------------------------------------------------------------------- | --------- |
| STRING \| INTEGER \| NUMBER \| BOOLEAN \| USER \| CHANNEL \| ROLE \| MENTIONABLE | inference |

#### `channelTypes`

If the option is a channel type, the channels shown will be restricted to these types

| type                                          | default   |
| --------------------------------------------- | --------- |
| Exclude<ChannelTypes, ChannelTypes.UNKNOWN>[] | undefined |

## Autocompletion (Option's choices)

You can use the [@SlashChoice](/docs/decorators/commands/slash-choice) decorator

## Option order

**You have to put required options before optional ones**  
Or you will get this error:

```
(node:64399) UnhandledPromiseRejectionWarning: DiscordAPIError: Invalid Form Body
options[1]: Required options must be placed before non-required options
```
