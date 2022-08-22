---
title: "@SimpleCommand"
---

<br/>

## Signature

```ts
@SimpleCommand(options?: SimpleCommandOptions): MethodDecoratorEx 
```

## Parameters

### `options`

| type      | default | required |
| --------- | ------- | -------- |
| SimpleCommandOptions | undefined    | No      |

## Types

### `SimpleCommandOptions`

```ts
export type SimpleCommandOptions<T extends string = string> = {
  aliases?: string[];
  argSplitter?: ArgSplitter;
  botIds?: string[];
  description?: string;
  directMessage?: boolean;
  guilds?: IGuild[];
  name?: NotEmpty<T>;
  prefix?: IPrefix;
};
```

### `ArgSplitter`

```ts
export type ArgSplitter =
  | string
  | RegExp
  | ((command: SimpleCommandMessage) => string[]);
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

### `IPrefix`

```ts
export type IPrefix = string | string[];
```