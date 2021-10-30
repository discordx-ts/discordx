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
    @SlashOption("x", { description: "x value", type: "INTEGER" })
    x: number | undefined,
    @SlashOption("y", { description: "y value", type: "INTEGER" })
    y: number | undefined,

    interaction: CommandInteraction
  ) {
    x ??= 0;
    y ??= 0;
    interaction.reply(x + y);
  }
}
```

## Example of Autocomplete option

When defining an autocomplete slash option, you can define a resolver for autocomplete inside `@SlashOption` to simplify things. If you set autocomplete to true, you have to handle it manually in your main function.

```ts
@Discord()
class DiscordBot {
  @Slash("autocomplete")
  testx(
    @SlashOption("aoption", {
      autocomplete: true,
      required: true,
      type: "STRING",
    })
    searchText: string,
    @SlashOption("boption", {
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
      required: true,
      type: "STRING",
    })
    searchText2: string,
    @SlashOption("coption", {
      autocomplete: (interaction: AutocompleteInteraction) => {
        // arrow function does not have this, so class reference is not available
        interaction.respond([
          { name: "option e", value: "e" },
          { name: "option f", value: "f" },
        ]);
      },
      required: true,
      type: "STRING",
    })
    searchText3: string,
    interaction: CommandInteraction | AutocompleteInteraction
  ): void {
    // autocomplete will passed to function if not handle above
    if (interaction.isAutocomplete()) {
      const focusedOption = interaction.options.getFocused(true);
      // resolver for option a
      if (focusedOption.name === "aoption") {
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

discord.**ts** convert automatically the infered type into discord.**js** options types

```ts
@Discord()
class DiscordBot {
  @Slash("add")
  add(
    @SlashOption("x", { description: "x value", required: true })
    x: number,
    @SlashOption("y", { description: "y value", required: true })
    y: number,

    interaction: CommandInteraction
  ) {
    interaction.reply(x + y);
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
    @SlashOption("x", { type: "MENTIONABLE", required: true })
    mentionable: GuildMember | User | Role,

    interaction: CommandInteraction
  ) {
    interaction.reply(mentionable.id);
  }
}
```

## Type inferance

- `"STRING"`
  **Infered from `String`**

  ```ts
  fn(
    @SlashOption("x")
    channel: string,
  )
  ```

- `"BOOLEAN"`
  **Infered from `Boolean`**

  ```ts
  fn(
    @SlashOption("x")
    channel: boolean,
  )
  ```

- `"INTEGER"`
  **Infered from `Number`**

  ```ts
  fn(
    @SlashOption("x")
    channel: number,
  )
  ```

- `"ROLE"`
  **Infered from `Role`**

  ```ts
  fn(
    @SlashOption("x")
    channel: Role,
  )
  ```

- `"USER"`
  **Infered from `User` | `GuildMember` (you will recieve GuildMember if present otherwise User)**

  ```ts
  fn(
    @SlashOption("x")
    channel: User,
  )
  ```

- `"CHANNEL"`
  **Infered from `Channel` (or `TextChannel` / `VoiceChannel`, not recommended)**

  ```ts
  fn(
    @SlashOption("x")
    channel: Channel,
  ```

- `"MENTIONABLE"`
  **No inferance, use:**

  ```ts
  fn(
    @SlashOption("x", { type: "MENTIONABLE" })
    channel: GuildMember | User | Role,
  )
  ```

- `"SUB_COMMAND"`
  No inferance, use [@SlashGroup](/docs/decorators/commands/slashgroup)
- `"SUB_COMMAND_GROUP"`
  No inferance, use [@SlashGroup](/docs/decorators/commands/slashgroup)

## Signature

```ts
SlashOption(name: string);
SlashOption(
  name: string,
  params?: SlashOptionParams
)
```

## Parameters

### name

Define name of this option

| type   | default | required |
| ------ | ------- | -------- |
| string |         | Yes      |

### params

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
| boolean | false   |

#### `Type`

Define type of your command option

| type                                                                             | default   |
| -------------------------------------------------------------------------------- | --------- |
| STRING \| INTEGER \| NUMBER \| BOOLEAN \| USER \| CHANNEL \| ROLE \| MENTIONABLE | Inferance |

#### `channelTypes`

If the option is a channel type, the channels shown will be restricted to these types

| type                                          | default   |
| --------------------------------------------- | --------- |
| Exclude<ChannelTypes, ChannelTypes.UNKNOWN>[] | undefined |

## Autocompletion (Option's choices)

You can use the [@SlashChoice](/docs/decorators/commands/slashchoice) decorator

## Option order

**You have to put required options before optional ones**  
Or you will get this error:

```
(node:64399) UnhandledPromiseRejectionWarning: DiscordAPIError: Invalid Form Body
options[1]: Required options must be placed before non-required options
```
