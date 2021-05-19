import {
  Discord,
  Command,
  CommandNotFound,
  CommandMessage,
  Client,
  Once,
} from "../../../src";

@Discord(".")
export class CommandsA {
  @Command("hello")
  hello(command: CommandMessage, client: Client) {
    console.log(client);
    command.message.reply("Hello A");
  }

  @CommandNotFound()
  notFound(command: CommandMessage, client: Client) {
    console.log(client);
    command.message.reply("NotFound A");
  }
}
