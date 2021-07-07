# @Discord

This decorator instanciate the class inside the discord.**ts** library to access to the class members or to call the methods

::: danger
you must decorate a class by the `@Discord` decorator to use members decorators
:::

```typescript
import { Discord, Slash } from "@typeit/discord";

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

<!--
## Params
### import
If you have a directory pattern that looks like this:

```sh
Main.ts
DiscordApp.ts
commands
- Ping.ts
- Hello.ts
- Blabla.ts
events
- MessageDelete.ts
```

You should use the `import` parameter for the `@Discord` decorator.
Here, all the elements will be injected into this Discord class instance.

```typescript
import * as Path from "path";
import { Discord, CommandNotFound } from "@typeit/discord";

// The prefix will be applied to the imported commands
@Discord({
  import: [
    Path.join(__dirname, "commands", "*.ts"),
    Path.join(__dirname, "events", "*.ts"),
    // You can also specify the class directly here if you don't want to use a glob
  ],
})
export abstract class DiscordApp {
}
```

Here is an example of what your command file should look like:

_Bye.ts_

```typescript
import { Slash } from "@typeit/discord";

// Do not have to decorate the class with @Discord
// It applied the parameters of the @Discord decorator that imported it
export abstract class Bye {
  @Slash("bye")
  async bye() {
    // ...
  }

  @Slash("ciao")
  async ciao() {
    // ...
  }
}
```

_MessageDelete.ts_

```typescript
import { On, ArgsOf } from "@typeit/discord";

// Do not have to decorate the class with @Discord
// It applied the parameters of the @Discord decorator that imported it
export abstract class MessageDelete {
  @On("messageDelete")
  async onMessageDelete([message]: ArgsOf<"messageDelete">) {
    message.reply("Bye!");
  }
}
```
-->
