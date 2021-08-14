# @Discord

This decorator instanciates the class inside the discord.**ts** library to access the class members or to call the methods

:::danger
you must decorate all classes using discord.ts decorators with the `@Discord` decorator.
:::

```typescript
import { Discord, Slash } from "discordx";

@Discord()
abstract class AppDiscord {
  // We can use member decorators
  // because we decorated the class with @Discord
  @Slash("hello")
  private hello() {
    // ...
  }
}
```

> `abstract` keyword is not necessary but this is more type-safe, the class shouldn't be initialized
