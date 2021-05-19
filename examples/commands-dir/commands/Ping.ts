import { Command, CommandMessage, Guard } from "../../../src";
import { Say } from "../guards/Say";

export default abstract class Ping {
  @Command()
  @Guard(Say("Pong"))
  async execute(command: CommandMessage) {
    command.message.reply("Pong");
  }
}
