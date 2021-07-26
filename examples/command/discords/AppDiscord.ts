import {
  Discord,
  Command,
  CommandOption,
  CommandMessage,
  DefaultPermission,
} from "../../../src";

@Discord()
@DefaultPermission(false)
export abstract class commandTest {
  // single whitespace will be used to split options
  @Command("math", { argSplitter: " " })
  @DefaultPermission(false)
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
}
