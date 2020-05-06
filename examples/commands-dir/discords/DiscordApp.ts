import { CommandNotFound, Discord, CommandMessage, On, ArgsOf, Client } from "../../../src";
import * as Path from "path";
import { Bye } from "../commands/Bye";

@Discord({
  prefix: "!",
  importCommands: [
    Path.join(__dirname, "..", "commands", "*.ts"),
    Bye
  ]
})
export class DiscordApp {
  @On("message")
  onMessage(
    [message]: ArgsOf<"message">,
    client: Client
  ) {
    console.log(message);
  }

  @CommandNotFound({ prefix: "!" })
  notFoundA(command: CommandMessage) {
    command.reply("Command not found");
  }
}
