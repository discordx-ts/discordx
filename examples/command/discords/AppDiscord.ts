import { Channel, Role, User } from "discord.js";
import {
  DefaultPermission,
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
  async cmd(
    @SimpleCommandOption("num1") num1: number, //
    @SimpleCommandOption("operation") operation: string, //
    @SimpleCommandOption("num2") num2: number,
    command: SimpleCommandMessage
  ): Promise<unknown> {
    if (
      !num1 ||
      !operation ||
      !num2 ||
      !["+", "-", "*", "/"].includes(operation)
    )
      return command.message.reply(
        `**Command Usage:** \`\`${command.prefix}${command.name} num1 operator num2\`\` ` + //
          `\`\`\`${command.prefix}${command.name} 1 + 3\`\`\``
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
    command.message.reply(`${num1} ${operation} ${num2} = ${out}`);
    command.message.reply(
      `command prefix: \`\`${command.prefix}\`\`\ncommand name: \`\`${command.name}\`\`\nargument string: \`\`${command.argString}\`\``
    );
  }

  @SimpleCommand("permcheck", { aliases: ["ptest"] })
  @DefaultPermission(false)
  @Permission({
    id: "462341082919731200",
    type: "USER",
    permission: true,
  })
  async permFunc(command: SimpleCommandMessage): Promise<void> {
    command.message.reply("access granted");
  }

  @SimpleCommand("hello", { aliases: ["ptest mark"] })
  async testCommand(
    @SimpleCommandOption("name") name: string,

    command: SimpleCommandMessage
  ): Promise<unknown> {
    if (!name) return command.message.reply("usage: ``!hello <your name>``");
    command.message.reply(`hello ${name}`);
  }

  // mention test

  @SimpleCommand("mentiontestuser")
  async handler(
    @SimpleCommandOption("user", { type: "USER" })
    user: User, //
    command: SimpleCommandMessage
  ): Promise<void> {
    if (!user) command.message.reply("user not mentioned");
    else command.message.reply(`${user}`);
  }

  @SimpleCommand("mentiontestrole")
  async handlerRole(
    @SimpleCommandOption("role", { type: "ROLE" })
    role: Role, //
    command: SimpleCommandMessage
  ): Promise<void> {
    if (!role) command.message.reply("role not mentioned");
    else command.message.reply(`${role}`);
  }

  @SimpleCommand("mentiontestchannel")
  async handlerChannel(
    @SimpleCommandOption("channel", { type: "CHANNEL" })
    channel: Channel, //
    command: SimpleCommandMessage
  ): Promise<void> {
    if (!channel) command.message.reply("channel not mentioned");
    else command.message.reply(`${channel}`);
  }

  @SimpleCommand("add", { argSplitter: "+" })
  async add(
    @SimpleCommandOption("x") x: number,
    @SimpleCommandOption("y") y: number,
    command: SimpleCommandMessage
  ): Promise<unknown> {
    if (!command.isValid()) return command.sendUsageSyntax();
    return command.message.reply(`${x + y}`);
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
  ): unknown {
    if (!command.isValid()) return command.sendUsageSyntax();
    return command.message.reply(
      `id: ${id}\n` +
        `time: ${time} seconds\n` +
        `reason: ${reason}\n` +
        `Type: ${type}`
    );
  }
}
