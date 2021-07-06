import { Discord, Command, CommandOption, CommandMessage } from "../../../src";

@Discord()
export abstract class commandTest {
  @Command("math")
  async cmd(
    @CommandOption("num1") num1: number, //
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
        `usage: ${message.command.prefix}${message.command.name} number operation number` +
          `${message.command.prefix}${message.command.name} 4 + 3`
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
