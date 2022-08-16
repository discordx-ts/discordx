import type { SimpleCommandMessage } from "../../../src/index.js";
import { Discord, SimpleCommand } from "../../../src/index.js";

@Discord()
export class Example {
  @SimpleCommand({ aliases: ["hey", "hi"], name: "hello" })
  hello(command: SimpleCommandMessage): void {
    command.message.reply(":wave:");
  }
}
