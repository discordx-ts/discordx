# IOC support via DI

discordx supports multiple DI containers to help you efficiently manage and architect large applications that wish to
take advantage of an IOC paradigm

Another use for this approach is that sometimes, you will find yourself wanting to get hold of objects and instances and
might have been tempted to just put them on the Client, or extend the Client object with your own custom Client class
and just put everything there. This is fine in a pure JS way, but causes issues especially with maintenance and
managing, as well as having to unsafely cast your Client.

So, if you have a large codebase and are using one of our supported DI containers to inject dependency, discordx can now
utilize the container to register each annotated `@Discord()` class!

In order to use your container, there is some small configuration to do in your code.

The way that discordx does this is my defining an engine interface `IDependencyRegistryEngine`, an implementation of
this interface is used on the `DIService` to handle the retrieval and resolution of services.

In order to use a custom IOC framework like Nestjs, simply implement the `IDependencyRegistryEngine` interface and set
it on the `DIService` (see below).

## Configuration

**Pre-configured DI containers:**

We have default implementations of the `IDependencyRegistryEngine` for the following frameworks:

- TSyringe (`tsyringeDependencyRegistryEngine`)
- TypeDi (`typeDiDependencyRegistryEngine`)

Before you import or define any `@Discord` classes, you must bind your di engine to discordx (Whether imported
from `importx` or another custom loader). To accomplish this, simply add `DIService.engine = implemntation` before the
aforementioned importer, As shown in the examples below.

In the case of `tsyringeDependencyRegistryEngine` because of how shared containers work, you MUST set the container
reference from your side.

```ts title="TSyringe"
import { DIService, tsyringeDependencyRegistryEngine } from "discordx";
import { container } from "tsyringe";

DIService.engine = tsyringeDependencyRegistryEngine.setInjector(container); // set the container
```

For TypeDi, both the service Method and the container must be set

```ts title="TypeDi"
import { DIService, typeDiDependencyRegistryEngine } from "discordx";
import { Container, Service } from "typedi";

DIService.engine = typeDiDependencyRegistryEngine
  .setService(Service)
  .setInjector(Container);
```

```ts title="customEngine"
import { DIService } from "discordx";
import { Container } from "typedi";

import { myCustomEngine } from "./MyCustomEngine.js";

DIService.engine = myCustomEngine;
```

It is recommended to do this in your main class where you define your `new Client()` code; for example:

```ts
import { Events, IntentsBitField } from "discord.js";
import { Client, DIService, tsyringeDependencyRegistryEngine } from "discordx";

async function start() {
  DIService.engine = tsyringeDependencyRegistryEngine;
  const client = new Client({
    botId: "test",
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMessages,
    ],
    silent: false,
  });

  await client.login("YOUR_TOKEN");
}

start();
```

## Usage

Once you have told discordx to use your engine for DI, it will then ask your engine for all the `@Discord()` services
when it needs to both register and retrieve them.

### Note for TSyringe using `tsyringeDependencyRegistryEngine`

If you are using our `tsyringeDependencyRegistryEngine` for TSyringe classes declared with `@singleton()` are
automatically `@injectable()` but in discordx you must add this annotation too if you wish your classes to receive
constructor injection.

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

In order to get this class injected into your `@Discord()` instance at runtime, you must define your class as
both `@Discord()` **AND** `@injectable()`: (the order is important)

```ts
@Discord()
@injectable()
class Example {
  constructor(private _database: Database) {
    console.log("constructed me as a singleton and injected _database");
  }

  @Slash({ description: "tsyringe", name: "tsyringe" })
  tsyringe(interaction: CommandInteraction): void {
    if (DIService.container) {
      // resolve class
      const clazz = container.resolve(Example);

      // respond with class test
      interaction.reply(
        `${clazz._database.query()}, same class: ${clazz === this}`,
      );
    } else {
      // warn: TSyringe is not used
      interaction.reply("Not using TSyringe");
    }
  }
}
```

When running the above code, your `database` will be injected into your `Example` class and when you ask your container
for `Example` you always receive the same instance of the class `container.resolve(Example);`

If you do not mark the class as `@injectable()` you will get an error thrown from TSyringe telling you where is no type
info for your class.

For TypeDI using the `typeDiDependencyRegistryEngine`, you do not need to mark your classes, all DI works as expected,
along with `@Inject` for props and constructor overrides with other services.

## Tokenization

the `tsyringeDependencyRegistryEngine` and `typeDiDependencyRegistryEngine` both by can register all the `@Discord`
services with tokens, the tokens are available by static props on the classes:
e.g `tsyringeDependencyRegistryEngine.token`.

### Enabling

In order to enable Discord x to use tokenization, you simply need to call `setUseTokenization(true)` and (for Tsyringe only) `setCashingSingletonFactory` on your initialization of Discordx I.E:

```ts title="Tsyringe"
import { container, instanceCachingFactory } from "tsyringe";

DIService.engine = tsyringeDependencyRegistryEngine
  .setUseTokenization(true)
  .setCashingSingletonFactory(instanceCachingFactory)
  .setInjector(container);
```

```ts title="TypeDI"
DIService.engine = tsyringeDependencyRegistryEngine
  .setUseTokenization(true)
  .setInjector(container);
```

### Custom Tsyringe tokens

In order to set your own custom token, you must call `TsyringeDependencyRegistryEngine.setToken` and pass in the symbol you wish to use. and Discordx will internally use this symbol. by default, this is set to `Symbol("discordx")`

### Custom TypeDI tokens

for TypeDI, it is the same as for Tsyringe except you need to call `TypeDiDependencyRegistryEngine.setToken` and pass in an instance of TypeDI's Token class

### usage

To use this. just use `TsyringeDependencyRegistryEngine.token` when you want to get all of Discordx's decorated classes. I.E

```ts
@injectable()
class TsClass {
  public constructor(
    @injectAll(TsyringeDependencyRegistryEngine.token)
    discordClasses: unknown[],
  ) {
    console.log(discordClasses); // all of Discordx's classes
  }
}
```

#### Side-effects

Due to the nature of tokens and how the internal resolution factory of both systems resolve classes. you must be careful when you use tokens.

Discordx handles internal Tsyringe tokenization by proxying the into an `Instance Cashing Singleton Factory`. this factory allowes both tokens AND classes to be resolved by the same registry.

in short, this allows you to use `@injectALl(TypeDiDependencyRegistryEngine.token)` to get all of Discordx's classes AND a normal injection of a single class, and you can be sure that both the standard injection and the token injection will ALWAYS resolve the same singleton.

so if you use TypeDI to get ALL of your classes, you will need a custom filter on the injection constructor:
that array to find the class.

## Getting all @Discord classes

if you wish to get all instances of the `@Discord` classes in your bot, then you can simple
call `DIService.allServices();`

**NOTE**: this will construct all your classes in the DI container, if you wish to lazy-load your Discord classes, then
you can not do this.

```ts
import { DIService } from "discordx";

function getAllDiscordClasses(): Set<unknown> {
  return DIService.allServices();
}
```

And if you are using tokens:

```ts title="Tsyringe tokens"
import { DIService } from "discordx";

function getAllDiscordClasses(): Set<unknown> {
  return container.resolveAll(TsyringeDependencyRegistryEngine.token);
}
```

```ts title="typeDi tokens"
import { DIService } from "discordx";

function getAllDiscordClasses(): Set<unknown> {
  return Container.getMany(TypeDiDependencyRegistryEngine.token);
}
```
