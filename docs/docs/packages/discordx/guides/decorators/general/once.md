# @Once

It's exactly the same behavior as [@On](/docs/decorators/general/on) but the method is only executed once

```typescript
@Discord()
class Example {
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
3. The [guards](/docs/decorators/general/guard) payload

> You should use JS destructuring for `ArgsOf<"YOUR_EVENT">` like in this example

```typescript
@Discord()
class Example {
  @Once({ event: "messageCreate" })
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
  @Once.rest()
  rateLimited([data]: RestArgsOf<"rateLimited">): void {
    console.log(data.limit);
  }
}
```

## Signature

```ts
Once(options?: EventOptions)
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
