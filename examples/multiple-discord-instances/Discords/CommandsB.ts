import {
  Discord,
  Command,
  CommandNotFound,
  CommandMessage,
  Client
} from "../../../src";

@Discord({ prefix: "!" })
export class CommandsB {
  @Command("hello")
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
