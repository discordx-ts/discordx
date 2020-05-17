import { Command, CommandMessage, Guard } from "../../../src";
import { Say } from "../guards/Say";

export default abstract class Ping {
  @Guard(Say("Pong"))
  @Command()
  async execute(command: CommandMessage) {
    command.reply("Pong");
  }
}

