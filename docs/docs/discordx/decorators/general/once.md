# @Once

It's exactly the same behavior as [@On](./on) but the method is only executed once

```typescript
@Discord()
class Example {
  @Once({ event: "messageDelete" })
  onMessageDelete() {
    // ...
  }
}
```

## Signature

```ts
Once(options?: EventOptions)
```

## Get the event payload

For each event a list of arguments is injected in your decorated method, you can type this list thanks to the `ArgsOf<"YOUR_EVENT">` type provided by discord.**ts**.

You also receive other useful arguments after that:

1. The event payload (`ArgsOf<"YOUR_EVENT">`)
2. The `Client` instance
3. The [guards](./guard) payload

> You should use JS destructuring for `ArgsOf<"YOUR_EVENT">` like in this example

```typescript
@Discord()
class Example {
  @Once({ event: "messageCreate" })
  onMessage(
    [message]: ArgsOf<"messageCreate">, // Type message automatically
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
  @Once.rest()
  rateLimited([data]: RestArgsOf<"rateLimited">): void {
    console.log(data.limit);
  }
}
```
