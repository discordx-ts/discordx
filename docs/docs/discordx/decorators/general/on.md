# @On

You can use this decorator to declare methods that will be executed whenever a Discord event is triggered.

Our methods must be decorated with the `@On` or [@Once](docs/discordx/decorators/general/once) decorator.

It's that simple, when the event is triggered, the method is called:

```typescript
@Discord()
class Example {
  @On({ event: "messageCreate" })
  onMessage() {
    // ...
  }

  @Once({ event: "messageDelete" })
  onMessageDelete() {
    // ...
  }
}
```

## Get the event payload

For each event a list of arguments is injected in your decorated method, you can type this list thanks to the `ArgsOf<"YOUR_EVENT">` type provided by discord.**ts**.

You also receive other useful arguments after that:

1. The event payload (`ArgsOf<"YOUR_EVENT">`)
2. The `Client` instance
3. The [guards](docs/discordx/decorators/general/guard) payload

> You should use JS destructuring for `ArgsOf<"YOUR_EVENT">` like in this example

```typescript
import { Discord, On, Client, ArgsOf } from "discordx";

@Discord()
class Example {
  @On({ event: "messageCreate" })
  onMessage(
    [message]: ArgsOf<"messageCreate">, // Type message automatically
    client: Client, // Client instance injected here,
    guardPayload: any
  ) {
    // ...
  }
}
```

## Rest

To handle rest events

```ts
@Discord()
class Example {
  @On.rest()
  rateLimited([data]: RestArgsOf<"rateLimited">): void {
    console.log(data.limit);
  }
}
```

## Signature

```ts
On(options?: EventOptions)
```

## Parameters

### options

The event options.

| type         | default   | required |
| ------------ | --------- | -------- |
| EventOptions | undefined | No       |

## Type: EventOptions

Array of bot ids, for which only the event will be executed

| type      | default |
| --------- | ------- |
| string[ ] | [ ]     |

### event

The event name

| type   | default |
| ------ | ------- |
| string |         |
