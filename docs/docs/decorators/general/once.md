# @Once - Discord events

It's exactly the same behavior as [@On](/docs/decorators/general/on) but the method is only executed once

```typescript
import { Discord, On, Once } from "discordx";

@Discord()
class Example {
  @Once("messageDelete")
  private onMessageDelete() {
    // ...
  }
}
```

## Get the event payload

For each event a list of arguments is injected in your decorated method, you can type this list thanks to the `ArgsOf<"YOUR_EVENT">` type provided by discord.**ts**.

You also receive other useful arguments after that:

1. The event payload (`ArgsOf<"YOUR_EVENT">`)
2. The `Client` instance
3. The [guards](/docs/decorators/general/guard) payload

> You should use JS destructuring for `ArgsOf<"YOUR_EVENT">` like in this example

```typescript
import { Discord, On, Client, ArgsOf } from "discordx";

@Discord()
class Example {
  @On("messageCreate")
  private onMessage(
    [message]: ArgsOf<"messageCreate">, // Type message automatically
    client: Client, // Client instance injected here,
    guardPayload: any
  ) {
    // ...
  }
}
```

## Signature

```ts
Once(event: DiscordEvents, params?: EventParams)
```

## Parameters

### Name

The event name.

| type   | default | required |
| ------ | ------- | -------- |
| string |         | Yes      |

### EventParams

Multiple options, check below.

| type   | default   | required |
| ------ | --------- | -------- |
| object | undefined | No       |

#### botIds

Array of bot ids, for which only the event will be executed.

| type      | default |
| --------- | ------- |
| string[ ] | [ ]     |
