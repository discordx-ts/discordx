import { ClassCommand, Command, CommandMessage, Guard } from "../../../src";
import { Say } from "../guards/Say";

export default abstract class Ping implements ClassCommand {
  @Guard(Say("Pong"))
  @Command({ description: "Ping pong", commandCaseSensitive: true })
  async execute(command: CommandMessage) {
    command.reply("Pong");
  }
}

