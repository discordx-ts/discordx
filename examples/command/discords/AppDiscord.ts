import { Channel } from "diagnostics_channel";
import { Role, User } from "discord.js";
import {
  Discord,
  SimpleCommand,
  SimpleCommandOption,
  CommandMessage,
  DefaultPermission,
  Permission,
} from "../../../src";

@Discord()
export abstract class commandTest {
  // single whitespace will be used to split options
  // command aliases: !m, !solve
  // string or regex supported for argSplitter
  @SimpleCommand("math", {
    aliases: ["m", "solve"],
    argSplitter: /\s/,
    directMessage: true,
  })
  async cmd(
    @SimpleCommandOption("num1")
    num1: number, //
    @SimpleCommandOption("operation") operation: string, //
    @SimpleCommandOption("num2") num2: number,
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

  @SimpleCommand("permcheck", { aliases: ["ptest"] })
  @DefaultPermission(false)
  @Permission({
    id: "462341082919731200",
    type: "USER",
    permission: true,
  })
  async permFunc(message: CommandMessage) {
    message.reply("access granted");
  }

  @SimpleCommand("hello")
  async testCommand(
    @SimpleCommandOption() name: string,

    message: CommandMessage
  ) {
    if (!name) return message.reply("usage: ``!hello <your name>``");
    message.reply(`hello ${name}`);
  }

  // mention test

  @SimpleCommand("mentiontestuser")
  async handler(
    @SimpleCommandOption("user", { type: "USER" })
    user: User, //
    message: CommandMessage
  ) {
    if (!user) message.reply("user not mentioned");
    else message.reply(`${user}`);
  }

  @SimpleCommand("mentiontestrole")
  async handlerRole(
    @SimpleCommandOption("role", { type: "ROLE" })
    role: Role, //
    message: CommandMessage
  ) {
    if (!role) message.reply("role not mentioned");
    else message.reply(`${role}`);
  }

  @SimpleCommand("mentiontestchannel")
  async handlerChannel(
    @SimpleCommandOption("channel", { type: "CHANNEL" })
    channel: Channel, //
    message: CommandMessage
  ) {
    if (!channel) message.reply("channel not mentioned");
    else message.reply(`${channel}`);
  }
}
