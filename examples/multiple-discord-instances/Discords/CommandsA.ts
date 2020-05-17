import {
  Discord,
  Command,
  CommandNotFound,
  CommandMessage,
  Client,
  Once
} from "../../../src";

@Discord(".")
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
