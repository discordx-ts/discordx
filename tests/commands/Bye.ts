import { ClassCommand, Command, CommandMessage, Guard } from "../../src";

export abstract class Bye implements ClassCommand {
  @Command("bye")
  @Guard()
  async execute(command: CommandMessage) {
    return command;
  }
}
