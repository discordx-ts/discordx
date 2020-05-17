import { Command, CommandMessage } from "../../../src";

export abstract class Hello {
  @Command("hello")
  async hello(command: CommandMessage) {
    command.reply("Hello!");
  }
}
