import {
  Discord,
  On,
  Client, // Use the Client that are provided by @typeit/discord
  Guard,
  Prefix
} from "../../src";
// You must import the types from @types/discord.js
import {
  Message
} from "discord.js";
import { NotBot } from "./guards/NotBot";

// Decorate the class with the @Discord decorator
@Discord
export class AppDiscord {
  private static _client: Client;
  private _prefix: string = "!";
  private _sayHelloMessage: string = "hello !";
  private _commandNotFoundMessage: string = "command not found...";

  static start() {
    this._client = new Client();
    // In the login method, you must specify the glob string to load your classes (for the framework).
    // In this case that's not necessary because the entry point of your application is this file.
    this._client.login(
      "YOUR_TOKEN",
      `${__dirname}/*Discord.ts` // glob string to load the classes
    );
  }

  // When the "message" event is triggered, this method is called with a specific payload (related to the event)
  @On("message")
  @Guard(
    NotBot,
    Prefix("!")
  )
  async onMessage(message: Message) {
    // Your logic...
    switch (message.content) {
      case "hello":
        message.reply(this._sayHelloMessage);
        break;
      default:
        message.reply(this._commandNotFoundMessage);
        break;
    }
  }
}

// Start your app
AppDiscord.start();
