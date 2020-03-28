import {
  Discord,
  On,
  Client, // Use the Client that is provided by @typeit/discord NOT discord.js
  Guard,
  Prefix,
  Command,
  CommandNotFound,
  MetadataStorage,
  CommandMessage
} from "../../src";
// You must import the types from discord.js
import {
  Message
} from "discord.js";
import { NotBot } from "./guards/NotBot";
import { Say } from "./guards/Say";

enum Answers {
  hello = "Hello",
  notFound = "Command not found...",
  prefix = "Prefix changed"
}

// Decorate the class with the @Discord() decorator
// You can specify the prefix for the @Command() decorator
@Discord({ prefix: "!" })
export class AppDiscord {
  private static _client: Client;

  static start() {
    this._client = new Client();
    // In the login method, you must specify the glob string to load your classes (for the framework).
    // In this case that's not necessary because the entry point of your application is this file.
    this._client.login(
      "Njg4NDY2MTk0MDA5MDMwNzAy.Xn5USw.L0xWocEaCXHX6gcp155VEkwR6Ok",
      `${__dirname}/*Discord.ts` // glob string to load the classes
    );
  }

  // When the "message" event is triggered, this method is called with a specific payload (related to the event)
  @On("message")
  @Guard(
    NotBot,
    Prefix(".", true)
  )
  async onMessage(message: Message) {
    switch (message.content) {
      case "hello":
        message.reply(Answers.hello);
        break;
      case "hello2":
        message.reply(Answers.hello + "2");
        break;
      default:
        message.reply(Answers.notFound);
        break;
    }
  }

  // The onMessage method but with @Command() decorator

  @Guard(Say("hello"))
  @Command("hello")
  hello(command: CommandMessage) {
    command.reply(Answers.hello);
  }

  @Guard(Say("set prefix"))
  @Command("setPrefix", { commandCaseSensitive: true })
  changePrefix(command: CommandMessage) {
    Client.setDiscordParams(this, {
      prefix: command.params[0]
    });
    command.reply(Answers.prefix);
  }

  @Guard(Say("command not found"))
  @CommandNotFound()
  notFound(command: CommandMessage) {
    command.reply(Answers.notFound);
  }

  @Guard(Say("hello comma"))
  @Command("hello", { prefix: "," })
  helloComma(command: CommandMessage) {
    command.reply(Answers.hello + " comma");
  }

  @Guard(Say("command not found comma"))
  @CommandNotFound({ prefix: "," })
  notFoundComma(command: CommandMessage) {
    command.reply(Answers.notFound + " comma");
  }

  @Guard(Say("change me"))
  @Command("changeMe", { prefix: "$", commandCaseSensitive: true })
  changeMyPrefix(command: CommandMessage) {
    Client.setCommandParams(this, this.changeMyPrefix, {
      prefix: command.params[0]
    });
    command.reply(Answers.prefix);
  }
}

// Start your app
AppDiscord.start();
