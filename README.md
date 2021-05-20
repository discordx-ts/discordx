

# Index

**Setup**

- [Need help?](https://github.com/OwenCalvin/discord.ts#%EF%B8%8F-need-help-)
- [Installation](https://github.com/OwenCalvin/discord.ts#-installation)
- [Setup](https://github.com/OwenCalvin/discord.ts#setup-and-start-your-application)

**Decorators**

- [`@Discord`](https://github.com/OwenCalvin/discord.ts#discord---getting-started)  
  Declare your Discord bot

- [`@On` / `@Once`](https://github.com/OwenCalvin/discord.ts#on--once---listen-to-the-events)  
  Create an event listener

- [`@Slash` / `@Permission`](https://github.com/OwenCalvin/discord.ts#-commands)  
  Create a command

- [`@Option` / `@Choice`](https://github.com/OwenCalvin/discord.ts#ℹ%EF%B8%8F-infos--description--name)  
  Add informations about your commands

- [`@Guard`](https://github.com/OwenCalvin/discord.ts#%EF%B8%8F-guards)  
  Add Guards to your events and commands

- [`@Name` / `@Description`](https://github.com/OwenCalvin/discord.ts#ℹ%EF%B8%8F-infos--description--name)  
  Add informations about your commands

**API**

- [Retrieve the `@Commands` / `@On` / `@Discord` infos](https://github.com/OwenCalvin/discord.ts#api---retrieve-the-infos)
- [All events index](https://github.com/OwenCalvin/discord.ts#-events-and-payload)

**Informations**

## @Option - Slash options



## API - Retrieve the infos

You can simply get all the infos about your decorated stuff using:

```typescript
import { Client } from "@typeit/discord";

Client.getCommands(); // @Command
Client.getCommandsNotFound(); // @CommandNotFound
Client.getEvents(); // @On
Client.getDiscords(); // @Discord
```

## 💡 Events and payload

Here you have the details about the payloads that are injected into the method related to a specific event.
Note that on some events, for example voiceStateUpdate, it will return an array of the subsequent event payloads, and the second parameter will be the discord.ts Client.
**`@Once(event: DiscordEvent)` exists too, it executes the method only one time**

### The argument list



## Examples

Some examples are provided in the [`/examples` folder](https://github.com/OwenCalvin/discord.ts/tree/master/examples) !

## Migration v4 to v5

`@Rules` and `@ComputedRules` do not exists anymore, we simplify everything and corrected some bugs.

## See also

- [discord.js](https://discord.js.org/#/)
