import { Discord, On, Client } from "../../src";
import { Message } from "discord.js";

enum Commands {
  HELLO = "hello"
}

@Discord
export class AppDiscord {
  private static _client: Client;
  private _prefix: string = "!";
  private _sayHelloMessage: string = "hello !";
  private _commandNotFoundMessage: string = "command not found...";

  static start() {
    this._client = new Client();
    this._client.login(
      "YOUR_TOKEN",
      `${__dirname}/*Discord.ts`
    );
  }

  @On("message")
  async yo(message: Message, client: Client) {
    if (AppDiscord._client.user.id !== message.author.id) {
      if (message.content[0] === this._prefix) {
        const cmd = message.content.replace(this._prefix, "").toLowerCase();
        switch (cmd) {
          case Commands.HELLO:
            message.reply(this._sayHelloMessage);
            break;
          default:
            message.reply(this._commandNotFoundMessage);
            break;
        }
      }
    }
  }
}

AppDiscord.start();
