# IOC support via DI

Discordx supports multiple DI containers to help you efficiently manage and architect large applications that wish to take advantage of an IOC paradigm

Another use for this approach is that sometimes, you will find yourself wanting to get hold of objects and instances and might have been tempted to just put them on the Client, or extend the Client object with your own custom Client class and just put everything there. This is fine in a pure JS way, but causes issues especially with maintenance and managing, as well as having to unsafely cast your Client.

So, if you have a large codebase and are using one of our supported DI containers to inject dependency, Discordx can now utilize the container to register each annotated `@Discord()` class!

In order to use your container, there is some small configuration to do in your code.

The way that Discordx does this is my defining an engine interface `IDependencyRegistryEngine`, an implementation of this interface is used on the `DIService` to handle the retrieval and resolution of services.

In order to use a custom IOC framework like Nestjs, simply implement the `IDependencyRegistryEngine` interface and set it on the `DIService` (see below).

## Configuration

**Pre-configured DI containers:**

We have default implementations of the `IDependencyRegistryEngine` for the following frameworks:

- TSyringe (`tsyringeDependencyRegistryEngine`)
- TypeDi (`typeDiDependencyRegistryEngine`)

Before you import or define any `@Discord` classes, you must bind your di engine to discordx (Whether imported from `importx` or another custom loader). To accomplish this, simply add `DIService.engine = implemntation` before the aforementioned importer, As shown in the examples below.

```ts title="TSyringe"
import { container } from "tsyringe";
import { DIService, tsyringeDependencyRegistryEngine } from "discordx";

DIService.engine = tsyringeDependencyRegistryEngine;
```

```ts title="TypeDi"
import { DIService, typeDiDependencyRegistryEngine } from "discordx";
import { Container } from "typedi";

DIService.engine = typeDiDependencyRegistryEngine;
```

```ts title="customEngine"
import { DIService } from "discordx";
import { Container } from "typedi";
import { myCustomEngine } from "./MyCustomEngine.js"

DIService.engine = myCustomEngine;
```

It is recommended to do this in your main class where you define your `new Client()` code; for example:

```ts
import "reflect-metadata";
import { Intents } from "discord.js";
import { Client, DIService, tsyringeDependencyRegistryEngine } from "discordx";

async function start() {
  DIService.engine = tsyringeDependencyRegistryEngine;
  const client = new Client({
    botId: "test",
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    silent: false,
  });

  await client.login("YOUR_TOKEN");
}

start();
```

## Usage

Once you have told Discordx to use your engine for DI, it will then ask your engine for all the `@Discord()` services when it needs to both register and retrieve them. 

### Note for TSyringe using `tsyringeDependencyRegistryEngine`

If you are using our `tsyringeDependencyRegistryEngine` for TSyringe classes declared with `@singleton()` are automatically `@injectable()` but in Discordx you must add this annotation too if you wish your classes to receive constructor injection.

For example, say you have a Database class you wish to inject into your declared `@Discord()` class:

```ts
@singleton()
class Database {
  database: string;

  constructor() {
    console.log("I am database");
    this.database = "connected";
  }

  query() {
    return this.database;
  }
}
```

In order to get this class injected into your `@Discord()` instance at runtime, you must define your class as both `@Discord()` **AND** `@injectable()`: (the order is important)

```ts
@Discord()
@injectable()
class Example {
  constructor(private _database: Database) {
    console.log("constructed me as a singleton and injected _database");
  }

  @Slash("tsyringe")
  private tsyringe(interaction: CommandInteraction): void {
    if (DIService.container) {
      // resolve class
      const clazz = container.resolve(Example);

      // respond with class test
      interaction.reply(
        `${clazz._database.query()}, same class: ${clazz === this}`
      );
    } else {
      // warn: TSyringe is not used
      interaction.reply("Not using TSyringe");
    }
  }
}
```

When running the above code, your `database` will be injected into your `Example` class and when you ask your container for `Example` you always receive the same instance of the class `container.resolve(Example);`

If you do not mark the class as `@injectable()` you will get an error thrown from TSyringe telling you where is no type info for your class.

For TypeDI using the `typeDiDependencyRegistryEngine`, you do not need to mark your classes, all DI works as expected, along with `@Inject` for props and constructor overrides with other services.

## Tokenization

the `tsyringeDependencyRegistryEngine` and `typeDiDependencyRegistryEngine` both by can register all the `@Discord` services with tokens, the tokens are available by static props on the classes: e.g `tsyringeDependencyRegistryEngine.token`.

This means that in order to get a class from the container of these, you will need to supply a token or call `DIService.instance.getService(DiscordService);`.

Because of thw way that tsyringe deals with tokens, if you simply inject a `@Discord` class it will create a NEW instance of that class, and it will not be a singleton, this is because any class registered with a token can only be retrieved with that token. 

So, by default, tokens on tsyringe are disabled, to enable them, call `tsyringeDependencyRegistryEngine.useTokenization = true;`

If you enable tokens on tsyringe, it would mean that you would have to use `@InjectAll` then do a filter on that array to find the class.

For example, if you wanted to get the `OnReady.ts` class:

```ts title="useTokenization=true"
@Discord()
class OnReady {
  private bar = "bar";
  public foo(){
    console.log(this.bar);
  }
}

@injectable()
class TsClass {
  private onReady:OnReady | null;
  
  public constructor(@injectAll(tsyringeDependencyRegistryEngine.token) discordClasses: unknown[]) {
    this.onReady = discordClasses.find(service => service.constructor === OnReady) ?? null;
    // or
    this.onReady = DIService.getService(OnReady);

    this.onReady.foo();
  }
}
```

```ts title="useTokenization=false"
@Discord()
class OnReady {
  private bar = "bar";
  public foo(){
    console.log(this.bar);
  }
}

@injectable()
class TsClass {
  public constructor(private onReady: OnReady) {
    onReady.foo();
  }
}
```

## Getting all @Discord classes

If for some reason, you wish to get all instances of the `@Discord` classes in your bot, then you can simple call `DIService.getAllServices();`

**NOTE**: this will construct all your classes in the DI container, if you wish to lazy-load your Discord classes, then you can not do this.

```ts
import { DIService } from "discordx";

function getAllDiscordClasses(): Set<unknown> {
  return DIService.getAllServices();
}
```
