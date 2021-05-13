import {
  Discord,
  Command,
  CommandNotFound,
  CommandMessage,
  Client,
} from "../../../src";

@Discord("!")
export class CommandsB {
  @Command("hello :slug :number")
  hello(command: CommandMessage, client: Client) {
    console.log(client);
    command.reply("Hello B");
  }

  @CommandNotFound()
  notFound(command: CommandMessage, client: Client) {
    console.log(client);
    command.reply("NotFound B");
  }
}
