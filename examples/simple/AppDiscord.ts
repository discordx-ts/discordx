import {
  Discord,
  On,
  Client, // Use the Client that is provided by @typeit/discord NOT discord.js
  Guard,
  Prefix
} from "../../src";
// You must import the types from discord.js
import {
  Message
} from "discord.js";
import { NotBot } from "./guards/NotBot";

enum Answers {
  hello = "Hello!",
  notFound = "command not found..."
}

// Decorate the class with the @Discord decorator
@Discord
export class AppDiscord {
  private static _client: Client;

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
    switch (message.content) {
      case "hello":
        message.reply(Answers.hello);
        break;
      default:
        message.reply(Answers.notFound);
        break;
    }
  }
}

// Start your app
AppDiscord.start();
