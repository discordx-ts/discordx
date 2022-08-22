---
title: "@SlashOption"
---

<br/>

## Signature

```ts
@SlashOption(options: SlashOptionOptions): ParameterDecoratorEx  
```

## Parameters

### `options`
| type      | default | required |
| --------- | ------- | -------- |
| SlashOptionOptions | undefined    | Yes      |

## Types

### `SlashOptionOptions`

```ts
export type SlashOptionOptions<TName extends string = string> =
  | SlashOptionBaseOptions<TName>
  | SlashOptionChannelOptions<TName>
  | SlashOptionNumberOptions<TName>
  | SlashOptionStringOptions<TName>
  | SlashOptionAutoCompleteOptions<TName>;
```

### `SlashOptionBaseOptions`

```ts
export type SlashOptionBaseOptions<TName extends string = string> =
  SlashOptionBase<TName> & {
    type?: Exclude<
      ApplicationCommandOptionType,
      | ApplicationCommandOptionType.Subcommand
      | ApplicationCommandOptionType.SubcommandGroup
      | ApplicationCommandOptionType.Channel
    >;
  };
```

### `SlashOptionChannelOptions`

```ts
export type SlashOptionChannelOptions<TName extends string = string> = Omit<
  SlashOptionBase<TName>,
  "channelTypes"
> & {
  channelTypes?: ChannelType[];
  type: ApplicationCommandOptionType.Channel;
};
```

### `SlashOptionNumberOptions`

```ts
export type SlashOptionNumberOptions<TName extends string = string> = Omit<
  SlashOptionBase<TName>,
  "maxValue" | "minValue" | "autocomplete"
> & {
  autocomplete?: SlashAutoCompleteOption;
  maxValue?: number;
  minValue?: number;
  type:
    | ApplicationCommandOptionType.Number
    | ApplicationCommandOptionType.Integer;
```

### `SlashOptionStringOptions`

```ts
export type SlashOptionStringOptions<TName extends string = string> = Omit<
  SlashOptionBase<TName>,
  "maxLength" | "minLength" | "autocomplete"
> & {
  autocomplete?: SlashAutoCompleteOption;
  maxLength?: number;
  minLength?: number;
  type: ApplicationCommandOptionType.String;
};
```

### `SlashOptionAutoCompleteOptions`

```ts
export type SlashOptionAutoCompleteOptions<TName extends string = string> =
  Omit<SlashOptionBase<TName>, "autocomplete"> & {
    autocomplete?: SlashAutoCompleteOption;
    type:
      | ApplicationCommandOptionType.String
      | ApplicationCommandOptionType.Number
      | ApplicationCommandOptionType.Integer;
```

### `SlashAutoCompleteOption`

```ts
export type SlashAutoCompleteOption =
  | undefined
  | boolean
  | ((
      interaction: AutocompleteInteraction,
      command: DApplicationCommand
    ) => void | Promise<void>);
```