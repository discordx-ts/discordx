import { ClassCommand, Command, CommandMessage } from "../../../src";

export abstract class Hello implements ClassCommand {
  @Command("hello")
  async execute(command: CommandMessage) {
    command.reply("Hello!");
  }
}
