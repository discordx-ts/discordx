import type { SimpleCommandMessage } from "discordx";
import { Discord, SimpleCommand } from "discordx";

@Discord()
export class Example {
  @SimpleCommand({ aliases: ["hey", "hi"], name: "hello" })
  hello(command: SimpleCommandMessage): void {
    command.message.reply(":wave:");
  }
}
