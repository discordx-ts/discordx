/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See LICENSE in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { Channel, Role, User } from "discord.js";
import type { SimpleCommandMessage } from "discordx";
import {
  Discord,
  SimpleCommand,
  SimpleCommandOption,
  SimpleCommandOptionType,
} from "discordx";

@Discord()
export class Example {
  // single whitespace will be used to split options
  // command aliases: !m, !solve
  // string or regex supported for argSplitter
  @SimpleCommand({
    aliases: ["m", "solve"],
    argSplitter: /s/,
    directMessage: true,
    name: "calc math add",
  })
  cmd(
    @SimpleCommandOption({
      description: "first value",
      name: "num1",
      type: SimpleCommandOptionType.Number,
    })
    num1: number | undefined,
    @SimpleCommandOption({
      description: "Operation (+, -, *, /)",
      name: "operation",
      type: SimpleCommandOptionType.String,
    })
    operation: string | undefined,
    @SimpleCommandOption({
      description: "second value",
      name: "num2",
      type: SimpleCommandOptionType.Number,
    })
    num2: number | undefined,
    command: SimpleCommandMessage,
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

  @SimpleCommand({ aliases: ["p-check"], name: "perm-check" })
  permFunc(command: SimpleCommandMessage): void {
    command.message.reply("access granted");
  }

  @SimpleCommand({ aliases: ["p-test mark"], name: "hello" })
  testCommand(
    @SimpleCommandOption({ name: "name", type: SimpleCommandOptionType.String })
    name: string | undefined,

    command: SimpleCommandMessage,
  ): unknown {
    return !name
      ? command.message.reply("usage: ``!hello <your name>``")
      : command.message.reply(`hello ${name}`);
  }

  // mention test

  @SimpleCommand({ name: "mention-test-user" })
  handler(
    @SimpleCommandOption({ name: "user", type: SimpleCommandOptionType.User })
    user: User | undefined, //
    command: SimpleCommandMessage,
  ): void {
    !user
      ? command.message.reply("user not mentioned")
      : command.message.reply(`${user}`);
  }

  @SimpleCommand({ name: "mention-test-role" })
  handlerRole(
    @SimpleCommandOption({ name: "role", type: SimpleCommandOptionType.Role })
    role: Role | undefined, //
    command: SimpleCommandMessage,
  ): void {
    !role
      ? command.message.reply("role not mentioned")
      : command.message.reply(`${role}`);
  }

  @SimpleCommand({ name: "mention-test-channel" })
  handlerChannel(
    @SimpleCommandOption({
      name: "channel",
      type: SimpleCommandOptionType.Channel,
    })
    channel: Channel | undefined, //
    command: SimpleCommandMessage,
  ): void {
    !channel
      ? command.message.reply("channel not mentioned")
      : command.message.reply(`${channel}`);
  }

  @SimpleCommand({ argSplitter: "+", name: "add" })
  add(
    @SimpleCommandOption({ name: "x", type: SimpleCommandOptionType.Number })
    x: number,

    @SimpleCommandOption({ name: "y", type: SimpleCommandOptionType.Number })
    y: number,

    command: SimpleCommandMessage,
  ): void {
    if (!command.isValid()) {
      command.sendUsageSyntax();
      return;
    }

    command.message.reply(`${x + y}`);
  }

  @SimpleCommand({
    argSplitter:
      /\s\"|\s'|"|'|\s(?=(?:"[^"]*"|[^"])*$)(?=(?:'[^']*'|[^'])*$)/gm,
  })
  ban(
    @SimpleCommandOption({ name: "id", type: SimpleCommandOptionType.Number })
    id: number,

    @SimpleCommandOption({ name: "time", type: SimpleCommandOptionType.Number })
    time: number,

    @SimpleCommandOption({
      name: "reason",
      type: SimpleCommandOptionType.String,
    })
    reason: string,

    @SimpleCommandOption({ name: "type", type: SimpleCommandOptionType.String })
    type: string,

    command: SimpleCommandMessage,
  ): void {
    if (!command.isValid()) {
      command.sendUsageSyntax();
      return;
    }

    command.message.reply(
      `id: ${id}\n` +
        `time: ${time} seconds\n` +
        `reason: ${reason}\n` +
        `Type: ${type}`,
    );
  }

  @SimpleCommand({
    argSplitter: (command) => {
      return command.argString.split("|");
    },
    name: "split-me",
  })
  splitMe(
    @SimpleCommandOption({ name: "arg1", type: SimpleCommandOptionType.String })
    arg1: string,

    @SimpleCommandOption({ name: "arg2", type: SimpleCommandOptionType.String })
    arg2: string,

    command: SimpleCommandMessage,
  ): void {
    if (!command.isValid()) {
      command.sendUsageSyntax();
      return;
    }

    command.message.reply(`arg1: ${arg1}\narg2: ${arg2}\n`);
  }
}
