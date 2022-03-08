# TSyringe

TSyringe is A lightweight dependency injection container for TypeScript/JavaScript for constructor injection.

If you have a large codebase and are using Tsyringe to inject dependency, Discordx can now utilise the container
to register each annotated `@Discord()` class!

In order to use your container, there is some small configuration to do in your code

## Configuration

before you call your `client.login()` method, you must tell Discordx to use your container for its internal Di solution,
in order to do this, just add the following code anywhere before `client.login()`:

```ts
import { container } from "tsyringe";
import { DIService } from "discordx";

DIService.container = container;
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
with the container as singletons. This is the same as declaring a class in tsyringe as `@singleton()` with one SMALL
caveat; in tsyringe classes declared with `@singleton()` are automatically `@injectable()` but in Discordx you must add
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
      const myClass = container.resolve(AppDiscord);

      // respond with class test
      interaction.reply(
        `${myClass._database.query()}, same class: ${myClass === this}`
      );
    } else {
      // warn: TSyringe is not used
      interaction.reply("Not using TSyringe");
    }
  }
}
```

when running the above code, your `database` will be injected into your `AppDiscord` class and when you ask your
container for `AppDiscord` you always receive the same instance of the class `container.resolve(AppDiscord);`

If you do not mark the class as `@injectable()` you will get an error thrown from tsyringe telling you where is no
type info for your class.

## Getting all @Discord classes

If for some reason, you wish to get all instances of the `@Discord` classes in your bot, then you can do so with the
following code example:

```ts
import { container, singleton } from "tsyringe";
import { DIService } from "discordx";

function getAllDiscordClasses(): unknown[] {
  const appClasses = DIService.allServices;

  // store resolved classes from TSyringe resolve
  const commandClasses = [];

  // resolve all classes
  for (const classRef of appClasses) {
    const instance = container.resolve(classRef as constructor<unknown>);
    commandClasses.push(instance);
  }

  return commandClasses;
}
```

Because your container has been populated with all the `@Discord()` instances on startup, you can use
the `MetadataStorage` object to get all the class refs for all the components and use a unique set of said classes to
resolve them from your container

Unfortunately, we can not use `@injectall()` with tokenized dependencies, because `@Discord()` is proxying your container, it cannot create a registry dynamically.
