# RestArgsOf

`RestArgsOf` type your rest events payload as an array, just pass an event (as string) in the type parameter and it types your array with the related event's parameters

```ts
@Discord()
class Example {
  @On.rest({ event: "rateLimited" })
  onMessage([data]: RestArgsOf<"rateLimited">) {
    // ...
  }
}
```
