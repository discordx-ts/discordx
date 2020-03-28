import {
  Discord,
  Command,
  CommandNotFound,
  CommandMessage,
  Client
} from "../../../src";

@Discord({ prefix: "." })
export class CommandsA {
  @Command("hello")
  hello(command: CommandMessage, client: Client) {
    console.log(client);
    command.reply("Hello A");
  }

  @CommandNotFound()
  notFound(command: CommandMessage, client: Client) {
    console.log(client);
    command.reply("NotFound A");
  }
}
