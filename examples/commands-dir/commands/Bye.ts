import { ClassCommand, Command, CommandMessage } from "../../../src";

export abstract class Bye implements ClassCommand {
  @Command("bye")
  async execute(command: CommandMessage) {
    command.reply("Bye!");
  }
}
