---
title: Client
---

<br/>

## Signature

```ts
@Client(options: ClientOptions): ClientJS
```

## Parameters

### `options`
| type      | default | required |
| --------- | ------- | -------- |
| ClientOptions | undefined     | Yes      |

## Properties

### `initApplicationCommands`

```ts
initApplicationCommands(options?: {
  global?: InitCommandOptions;
  guild?: InitCommandOptions;
}): Promise<void>
```

### `executeInteraction`

```ts
executeInteraction(interaction: Interaction, log?: boolean): Awaited<unknown>
```

### `executeCommand`

```ts
executeCommand(message: Message, options?: {
  caseSensitive?: boolean; 
  forcePrefixCheck?: boolean; 
  log?: boolean; 
}): Promise<unknown>
```

### `executeReaction`

```ts
executeReaction(reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser, options?: {
    log?: boolean;
}): Promise<unknown>
```

## Types

### `ClientOptions`
```ts
export interface ClientOptions extends DiscordJSClientOptions {
  botGuilds?: IGuild[];
  botId?: string;
  guards?: GuardFunction[];
  logger?: ILogger;
  silent?: boolean;
  simpleCommand?: SimpleCommandConfig;
}
```

### `IGuild`
```ts
export type IGuild =
  | Snowflake
  | Snowflake[]
  | ((
      client: Client,
      command:
        | DApplicationCommand
        | DComponent
        | DReaction
        | SimpleCommandMessage
        | undefined
    ) => Snowflake | Snowflake[] | Promise<Snowflake> | Promise<Snowflake[]>);
```

### `GuardFunction`

```ts
export type GuardFunction<Type = any, DataType = any> = (
  params: Type,
  client: Client,
  next: Next,
  data: DataType
) => any;
```

### `ILogger`

```ts
export type ILogger = {
  error(...args: unknown[]): void;
  info(...args: unknown[]): void;
  log(...args: unknown[]): void;
  warn(...args: unknown[]): void;
};
```

### `SimpleCommandConfig`

```ts
export interface SimpleCommandConfig {
  argSplitter?: ArgSplitter;
  prefix?: IPrefixResolver;
  responses?: {
    notFound?: string | ((command: Message) => Awaitable<void>);
  };
}
```

### `InitCommandOptions`

```ts
export type InitCommandOptions = {
  disable?: {
    add?: boolean;
    delete?: boolean;
    update?: boolean;
  };
  log?: boolean;
};
```