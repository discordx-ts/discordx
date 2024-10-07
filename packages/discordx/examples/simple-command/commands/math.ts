/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
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
  @SimpleCommand({
    aliases: ["m", "solve"],
    argSplitter: /s/,
    directMessage: true,
    name: "calculate",
  })
  async calculateMath(
    @SimpleCommandOption({
      description: "First value",
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
      description: "Second value",
      name: "num2",
      type: SimpleCommandOptionType.Number,
    })
    num2: number | undefined,
    command: SimpleCommandMessage,
  ): Promise<void> {
    if (
      !num1 ||
      !operation ||
      !num2 ||
      !["+", "-", "*", "/"].includes(operation)
    ) {
      await command.sendUsageSyntax();
      return;
    }

    let result = 0;
    switch (operation) {
      case "+":
        result = num1 + num2;
        break;
      case "-":
        result = num1 - num2;
        break;
      case "*":
        result = num1 * num2;
        break;
      case "/":
        result = num1 / num2;
        break;
    }

    await command.message.reply(`${num1} ${operation} ${num2} = ${result}`);
  }

  @SimpleCommand({ aliases: ["p-check"], name: "check-permissions" })
  async checkPermissions(command: SimpleCommandMessage): Promise<void> {
    await command.message.reply("Access granted.");
  }

  @SimpleCommand({ aliases: ["p-test mark"], name: "greet" })
  greetUser(
    @SimpleCommandOption({ name: "name", type: SimpleCommandOptionType.String })
    name: string | undefined,
    command: SimpleCommandMessage,
  ): unknown {
    return !name
      ? command.message.reply("Usage: ``!greet <your name>``")
      : command.message.reply(`Hello, ${name}`);
  }

  @SimpleCommand({ name: "mention-user" })
  async mentionUser(
    @SimpleCommandOption({ name: "user", type: SimpleCommandOptionType.User })
    user: User | undefined,
    command: SimpleCommandMessage,
  ): Promise<void> {
    if (user) {
      await command.message.reply(user.toString());
    } else {
      await command.message.reply("User not mentioned.");
    }
  }

  @SimpleCommand({ name: "mention-role" })
  async mentionRole(
    @SimpleCommandOption({ name: "role", type: SimpleCommandOptionType.Role })
    role: Role | undefined,
    command: SimpleCommandMessage,
  ): Promise<void> {
    if (role) {
      await command.message.reply(role.toString());
    } else {
      await command.message.reply("Role not mentioned.");
    }
  }

  @SimpleCommand({ name: "mention-channel" })
  async mentionChannel(
    @SimpleCommandOption({
      name: "channel",
      type: SimpleCommandOptionType.Channel,
    })
    channel: Channel | undefined,
    command: SimpleCommandMessage,
  ): Promise<void> {
    if (channel) {
      await command.message.reply(channel.toString());
    } else {
      await command.message.reply("Channel not mentioned.");
    }
  }

  @SimpleCommand({ argSplitter: "+", name: "addition" })
  async addition(
    @SimpleCommandOption({ name: "x", type: SimpleCommandOptionType.Number })
    x: number,
    @SimpleCommandOption({ name: "y", type: SimpleCommandOptionType.Number })
    y: number,
    command: SimpleCommandMessage,
  ): Promise<void> {
    if (!command.isValid()) {
      await command.sendUsageSyntax();
      return;
    }

    await command.message.reply(`${x + y}`);
  }

  @SimpleCommand({
    argSplitter: /\s"|\s'|"|'|\s(?=(?:"[^"]*"|[^"])*$)(?=(?:'[^']*'|[^'])*$)/gm,
    name: "ban-user",
  })
  async banUser(
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
  ): Promise<void> {
    if (!command.isValid()) {
      await command.sendUsageSyntax();
      return;
    }

    await command.message.reply(
      `ID: ${id}\n` +
        `Time: ${time} seconds\n` +
        `Reason: ${reason}\n` +
        `Type: ${type}`,
    );
  }

  @SimpleCommand({
    argSplitter: (command) => {
      return command.argString.split("|");
    },
    name: "split-arguments",
  })
  async splitArguments(
    @SimpleCommandOption({ name: "arg1", type: SimpleCommandOptionType.String })
    arg1: string,
    @SimpleCommandOption({ name: "arg2", type: SimpleCommandOptionType.String })
    arg2: string,
    command: SimpleCommandMessage,
  ): Promise<void> {
    if (!command.isValid()) {
      await command.sendUsageSyntax();
      return;
    }

    await command.message.reply(`Argument 1: ${arg1}\nArgument 2: ${arg2}\n`);
  }
}
