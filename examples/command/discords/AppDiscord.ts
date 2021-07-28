import { Snowflake } from "discord.js";
import {
  Discord,
  Command,
  CommandOption,
  CommandMessage,
  DefaultPermission,
  Permission,
} from "../../../src";

@Discord()
export abstract class commandTest {
  // single whitespace will be used to split options
  // command aliases: !m, !solve
  // string or regex supported for argSplitter
  @Command("math", { aliases: ["m", "solve"], argSplitter: /\s/ })
  async cmd(
    @CommandOption("num1")
    num1: number, //
    @CommandOption("a") operation: string, //
    @CommandOption("num2") num2: number,
    message: CommandMessage
  ) {
    if (
      !num1 ||
      !operation ||
      !num2 ||
      !["+", "-", "*", "/"].includes(operation)
    )
      return message.reply(
        `**Command Usage:** \`\`${message.command.prefix}${message.command.name} num1 operator num2\`\` ` + //
          `\`\`\`${message.command.prefix}${message.command.name} 1 + 3\`\`\``
      );

    let out = 0;
    switch (operation) {
      case "+":
        out = num1 + num2;
        break;
      case "-":
        out = num1 - num2;
        break;
      case "*":
        out = num1 * num2;
        break;
      case "/":
        out = num1 / num2;
        break;
    }
    message.reply(`${num1} ${operation} ${num2} = ${out}`);
  }

  @Command("permcheck", { aliases: ["ptest"] })
  @DefaultPermission(false)
  @Permission({
    id: "462341082919731200" as Snowflake,
    type: "USER",
    permission: true,
  })
  async permFunc(message: CommandMessage) {
    message.reply("access granted");
  }

  @Command("hello")
  async testCommand(
    @CommandOption() name: string,

    message: CommandMessage
  ) {
    if (!name) return message.reply("usage: ``!hello <your name>``");
    message.reply(`hello ${name}`);
  }
}
