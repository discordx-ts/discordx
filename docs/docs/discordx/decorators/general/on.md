# @On

You can use this decorator to declare methods that will be executed whenever a Discord event is triggered.

Our methods must be decorated with the `@On` or [@Once](./once) decorator.

It's that simple, when the event is triggered, the method is called:

```typescript
@Discord()
class Example {
  @On({ event: Events.MessageCreate })
  onMessage() {
    // ...
  }

  @Once({ event: Events.MessageDelete })
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
3. The [guards](./guard) payload

> You should use JS destructuring for `ArgsOf<"YOUR_EVENT">` like in this example

```typescript
import { ArgsOf, Client, Discord, On } from "discordx";

@Discord()
class Example {
  @On({ event: Events.MessageCreate })
  onMessage(
    [message]: ArgsOf<Events.MessageCreate>, // Type message automatically
    client: Client, // Client instance injected here,
    guardPayload: any,
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
