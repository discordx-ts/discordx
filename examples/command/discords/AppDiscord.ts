import { Channel, Role, User } from "discord.js";
import {
  Discord,
  Permission,
  SimpleCommand,
  SimpleCommandMessage,
  SimpleCommandOption,
} from "../../../src";

@Discord()
export abstract class commandTest {
  // single whitespace will be used to split options
  // command aliases: !m, !solve
  // string or regex supported for argSplitter
  @SimpleCommand("calc math add", {
    aliases: ["m", "solve"],
    argSplitter: /\s/,
    directMessage: true,
  })
  cmd(
    @SimpleCommandOption("num1") num1: number, //
    @SimpleCommandOption("operation") operation: string, //
    @SimpleCommandOption("num2") num2: number,
    command: SimpleCommandMessage
  ): unknown {
    if (
      !num1 ||
      !operation ||
      !num2 ||
      !["+", "-", "*", "/"].includes(operation)
    ) {
      return command.message.reply(
        `**Command Usage:** \`\`${command.prefix}${command.name} num1 operator num2\`\` ` + //
          `\`\`\`${command.prefix}${command.name} 1 + 3\`\`\``
      );
    }

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
    command.message.reply(`${num1} ${operation} ${num2} = ${out}`);
    command.message.reply(
      `command prefix: \`\`${command.prefix}\`\`\ncommand name: \`\`${command.name}\`\`\nargument string: \`\`${command.argString}\`\``
    );
  }

  @SimpleCommand("permcheck", { aliases: ["ptest"] })
  @Permission(false)
  @Permission({
    id: "462341082919731200",
    type: "USER",
    permission: true,
  })
  permFunc(command: SimpleCommandMessage): void {
    command.message.reply("access granted");
  }

  @SimpleCommand("hello", { aliases: ["ptest mark"] })
  testCommand(
    @SimpleCommandOption("name") name: string,

    command: SimpleCommandMessage
  ): unknown {
    return !name
      ? command.message.reply("usage: ``!hello <your name>``")
      : command.message.reply(`hello ${name}`);
  }

  // mention test

  @SimpleCommand("mentiontestuser")
  handler(
    @SimpleCommandOption("user", { type: "USER" })
    user: User, //
    command: SimpleCommandMessage
  ): void {
    !user
      ? command.message.reply("user not mentioned")
      : command.message.reply(`${user}`);
  }

  @SimpleCommand("mentiontestrole")
  handlerRole(
    @SimpleCommandOption("role", { type: "ROLE" })
    role: Role, //
    command: SimpleCommandMessage
  ): void {
    !role
      ? command.message.reply("role not mentioned")
      : command.message.reply(`${role}`);
  }

  @SimpleCommand("mentiontestchannel")
  handlerChannel(
    @SimpleCommandOption("channel", { type: "CHANNEL" })
    channel: Channel, //
    command: SimpleCommandMessage
  ): void {
    !channel
      ? command.message.reply("channel not mentioned")
      : command.message.reply(`${channel}`);
  }

  @SimpleCommand("add", { argSplitter: "+" })
  add(
    @SimpleCommandOption("x") x: number,
    @SimpleCommandOption("y") y: number,
    command: SimpleCommandMessage
  ): void {
    !command.isValid()
      ? command.sendUsageSyntax()
      : command.message.reply(`${x + y}`);
  }

  @SimpleCommand("ban", {
    argSplitter:
      /\s\"|\s'|"|'|\s(?=(?:"[^"]*"|[^"])*$)(?=(?:'[^']*'|[^'])*$)/gm,
  })
  ban(
    @SimpleCommandOption("id") id: number,
    @SimpleCommandOption("time") time: number,
    @SimpleCommandOption("reason") reason: string,
    @SimpleCommandOption("type") type: string,
    command: SimpleCommandMessage
  ): void {
    !command.isValid()
      ? command.sendUsageSyntax()
      : command.message.reply(
          `id: ${id}\n` +
            `time: ${time} seconds\n` +
            `reason: ${reason}\n` +
            `Type: ${type}`
        );
  }
}
