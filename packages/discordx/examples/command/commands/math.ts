import type { Channel, Role, User } from "discord.js";

import type { SimpleCommandMessage } from "../../../src/index.js";
import {
  DefaultPermissionResolver,
  Discord,
  Permission,
  SimpleCommand,
  SimpleCommandOption,
  SimpleCommandOptionType,
} from "../../../src/index.js";

@Discord()
export abstract class commandTest {
  // single whitespace will be used to split options
  // command aliases: !m, !solve
  // string or regex supported for argSplitter
  @SimpleCommand("calc math add", {
    aliases: ["m", "solve"],
    argSplitter: /s/,
    directMessage: true,
  })
  cmd(
    @SimpleCommandOption("num1", { description: "first value" }) num1: number,
    @SimpleCommandOption("operation", { description: "Operation (+, -, *, /)" })
    operation: string,
    @SimpleCommandOption("num2", { description: "second value" }) num2: number,
    command: SimpleCommandMessage
  ): unknown {
    if (
      !num1 ||
      !operation ||
      !num2 ||
      !["+", "-", "*", "/"].includes(operation)
    ) {
      return command.sendUsageSyntax();
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
  }

  @SimpleCommand("permcheck", { aliases: ["ptest"] })
  @Permission(
    new DefaultPermissionResolver((command) => {
      if (!command) {
        return false;
      }
      return true;
    })
  )
  @Permission({
    id: "462341082919731200",
    permission: true,
    type: "USER",
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
    @SimpleCommandOption("user", { type: SimpleCommandOptionType.User })
    user: User, //
    command: SimpleCommandMessage
  ): void {
    !user
      ? command.message.reply("user not mentioned")
      : command.message.reply(`${user}`);
  }

  @SimpleCommand("mentiontestrole")
  handlerRole(
    @SimpleCommandOption("role", { type: SimpleCommandOptionType.Role })
    role: Role, //
    command: SimpleCommandMessage
  ): void {
    !role
      ? command.message.reply("role not mentioned")
      : command.message.reply(`${role}`);
  }

  @SimpleCommand("mentiontestchannel")
  handlerChannel(
    @SimpleCommandOption("channel", { type: SimpleCommandOptionType.Channel })
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

  @SimpleCommand("splitme", {
    argSplitter: (command) => {
      return command.argString.split("|");
    },
  })
  splitme(
    @SimpleCommandOption("arg1") arg1: string,
    @SimpleCommandOption("arg2") arg2: string,
    command: SimpleCommandMessage
  ): void {
    !command.isValid()
      ? command.sendUsageSyntax()
      : command.message.reply(`arg1: ${arg1}\n` + `arg2: ${arg2}\n`);
  }
}
