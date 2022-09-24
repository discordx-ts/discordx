# @Discord

This decorator instanciates the class inside the discord.**ts** library to access the class members or to call the methods

:::danger
You must decorate all classes that use discordx decorators with the @Discord decorator.
:::

```typescript
import { Discord, Slash } from "discordx";

@Discord()
abstract class Example {
  // We can use member decorators
  // because we decorated the class with @Discord
  @Slash({ description: "hello" })
  hello() {
    // ...
  }
}
```

> `abstract` keyword is not necessary but this is more type-safe, the class shouldn't be initialized
