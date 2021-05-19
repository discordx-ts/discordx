import { Command, CommandMessage } from "../../../src";

export abstract class Bye {
  @Command("bye")
  async bye(command: CommandMessage) {
    command.message.reply("Bye!");
  }
}
