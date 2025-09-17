/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import type { Message } from "discord.js";
import escapeRegExp from "lodash/escapeRegExp.js";

import type { Client } from "../index.js";
import {
  SimpleCommandMessage,
  SimpleCommandParseType,
  toStringArray,
} from "../index.js";

export class SimpleCommandManager {
  constructor(private client: Client) {}

  async executeCommand(
    message: Message,
    caseSensitive?: boolean,
  ): Promise<unknown> {
    const command = await this.parseCommand(message, caseSensitive ?? false);

    if (command === SimpleCommandParseType.notCommand) {
      return null;
    }

    if (command === SimpleCommandParseType.notFound) {
      const handleNotFound =
        this.client.simpleCommandConfig?.responses?.notFound;
      if (handleNotFound) {
        if (typeof handleNotFound === "string") {
          await message.reply(handleNotFound);
        } else {
          await handleNotFound(message);
        }
      }
      return null;
    }

    if (!command.info.isBotAllowed(this.client.botId)) {
      return null;
    }

    if (
      !(await command.info.isGuildAllowed(
        this.client,
        command,
        message.guildId,
      ))
    ) {
      return null;
    }

    if (!command.info.directMessage && !message.guild) {
      return null;
    }

    return command.info.execute(this.client.guards, command, this.client);
  }

  async parseCommand(
    message: Message,
    caseSensitive = false,
  ): Promise<SimpleCommandParseType | SimpleCommandMessage> {
    const prefix = await this.getMessagePrefix(message);

    const prefixRegex = RegExp(
      `^(${toStringArray(
        prefix,
        Array.from(this.client.simpleCommandMappedPrefix),
      )
        .map((pfx) => escapeRegExp(pfx))
        .join("|")})`,
    );

    const isCommand = prefixRegex.test(message.content);
    if (!isCommand) {
      return SimpleCommandParseType.notCommand;
    }

    const matchedPrefix = prefixRegex.exec(message.content)?.at(1) ?? "unknown";

    const contentWithoutPrefix = `${message.content
      .replace(prefixRegex, "")
      .trim()} `;

    const commandRaw = this.client.simpleCommandsByName.find((cmd) => {
      if (caseSensitive) {
        return contentWithoutPrefix.startsWith(`${cmd.name} `);
      }

      return contentWithoutPrefix
        .toLowerCase()
        .startsWith(`${cmd.name.toLowerCase()} `);
    });

    if (!commandRaw) {
      return SimpleCommandParseType.notFound;
    }

    const commandArgs = contentWithoutPrefix
      .replace(new RegExp(commandRaw.name, "i"), "")
      .trim();

    const command = new SimpleCommandMessage(
      matchedPrefix,
      commandArgs,
      message,
      commandRaw.command,
      this.client.simpleCommandConfig?.argSplitter,
    );

    command.options = await command.resolveOptions();

    return command;
  }

  private async getMessagePrefix(message: Message): Promise<string[]> {
    if (typeof this.client.prefix !== "function") {
      return toStringArray(this.client.prefix);
    }

    const prefix = await this.client.prefix(message);
    return toStringArray(prefix);
  }
}
