# IOC support via DI

Discordx supports multiple DI containers to help you efficiently manage and architect large applications that wish to take advantage of an IOC paradigm

Another use for this approach is that sometimes, you will find yourself wanting to get hold of objects and instances and might have been tempted to just put them on the Client, or extend the Client object with your own custom Client class and just put everything there. This is fine in a pure JS way, but causes issues especially with maintenance and managing, as well as having to unsafely cast your Client.

so, if you have a large codebase and are using one of our supported DI containers to inject dependency, Discordx can now utilise the container
to register each annotated `@Discord()` class!

In order to use your container, there is some small configuration to do in your code

## Configuration

**Supported DI containers:**

- TSyringe
- TypeDi

before you call your `client.login()` method, you must tell Discordx to use your container for its internal Di solution,
in order to do this, just add the following code anywhere before `importx()`:

```ts title="TSyringe"
import { container } from "tsyringe";
import { DIService } from "discordx";

DIService.container = container;
```

```ts title="TypeDi"
import { DIService } from "discordx";
import { Container } from "typedi";

DIService.container = Container;
```

It is recommended to do this in your main class where you define your `new Client()` code; for example:

```ts
import "reflect-metadata";
import { Intents } from "discord.js";
import { container } from "tsyringe";
import { Client, DIService } from "discordx";

async function start() {
  DIService.container = container;
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

Once you have told Discordx to use your container for DI, it will then register all of your defined `@Discord()` classes
with the container as singletons. This is the same as declaring a class in TSyringe as `@singleton()` or with TypeDI `@Service`.

### Note for TSyringe

In TSyringe classes declared with `@singleton()` are automatically `@injectable()` but in Discordx you must add
this annotation too if you wish your classes to receive constructor injection.

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

when running the above code, your `database` will be injected into your `Example` class and when you ask your
container for `Example` you always receive the same instance of the class `container.resolve(Example);`

If you do not mark the class as `@injectable()` you will get an error thrown from TSyringe telling you where is no
type info for your class.

For TypeDI, you do not need to mark your classes, all DI works as expected, along with `@Inject` for props and constructor overrides with other services.

## Getting all @Discord classes

If for some reason, you wish to get all instances of the `@Discord` classes in your bot, then you can do so with the
following code example:

**NOTE**: this will constructor all your classes in the DI container, if you wish to lazy-load your singletons, then you can not do this.

```ts
import { container } from "tsyringe";
import { DIService } from "discordx";
import { Container } from "typedi";

function getAllDiscordClasses(): unknown[] {
  const appClasses = DIService.allServices;

  // store resolved classes from TSyringe resolve
  const commandClasses = [];

  // resolve all classes
  for (const classRef of appClasses) {
    // TSyringe
    const instance = container.resolve(classRef as constructor<unknown>);

    // TypeDI
    const instance = Container.get(classRef as constructor<unknown>);

    commandClasses.push(instance);
  }

  return commandClasses;
}
```

Because your container has been populated with all the `@Discord()` instances on startup, you can use
the `MetadataStorage` object to get all the class refs for all the components and use a unique set of said classes to
resolve them from your container

Unfortunately, we can not use `@injectall()` with tokenized dependencies, because `@Discord()` is proxying your container, it cannot create a registry dynamically.
