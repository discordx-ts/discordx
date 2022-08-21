---
title: "@Reaction"
---

<br/>

## Signature

```ts
Reaction(options?: ReactionOptions): MethodDecoratorEx 
```

## Parameters

### `options`
| type      | default | required |
| --------- | ------- | -------- |
| ReactionOptions  | undefined     | No      |

## Types

### `ReactionOptions `

```ts
export type ReactionOptions<T extends string = string> = {
  aliases?: ReactionOptions[];
  botIds?: string[];
  description?: string;
  directMessage?: boolean;
  emoji: NotEmpty<T>;
  guilds?: IGuild[];
  partial?: boolean;
  remove?: boolean;
};
```