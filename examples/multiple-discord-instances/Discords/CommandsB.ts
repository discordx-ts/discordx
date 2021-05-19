import {
  Discord,
  Command,
  CommandNotFound,
  CommandMessage,
  Client,
} from "../../../src";

@Discord("!")
export class CommandsB {
  @Command("hello", "SLUG", "NUMBER")
  hello(command: CommandMessage, client: Client) {
    console.log(client);
    command.message.reply("Hello B");
  }

  @CommandNotFound()
  notFound(command: CommandMessage, client: Client) {
    console.log(client);
    command.message.reply("NotFound B");
  }
}
