/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import crypto from "node:crypto";
import { EmbedBuilder, type Message } from "discord.js";

import {
  type ArgSplitter,
  type DSimpleCommand,
  MetadataStorage,
  SimpleCommandOptionType,
  type SimpleOptionType,
} from "../index.js";

/**
 * Simple command message
 */
export class SimpleCommandMessage {
  options: SimpleOptionType[] = [];

  constructor(
    public prefix: string,
    public argString: string,
    public message: Message,
    public info: DSimpleCommand,
    public splitter?: ArgSplitter,
  ) {
    // empty constructor
  }

  get name(): string {
    return this.info.name;
  }

  get description(): string {
    return this.info.description;
  }

  /**
   * Resolve options
   */
  resolveOptions(): Promise<SimpleOptionType[]> {
    return this.info.parseParamsEx(this);
  }

  /**
   * Verify that all options are valid
   *
   * @returns
   */
  isValid(): boolean {
    return !this.options.includes(null);
  }

  /**
   * Get related commands
   *
   * @returns
   */
  getRelatedCommands(): DSimpleCommand[] {
    const commandName = this.info.name.split(" ")[0];
    if (!commandName) {
      return [];
    }

    return MetadataStorage.instance.simpleCommands.filter(
      (cmd) => cmd.name.startsWith(commandName) && cmd.name !== this.info.name,
    );
  }

  /**
   * Send usage syntax for command
   *
   * @returns
   */
  sendUsageSyntax(): Promise<Message> {
    const maxLength = !this.info.options.length
      ? 0
      : this.info.options.reduce((a, b) =>
          a.name.length > b.name.length ? a : b,
        ).name.length;

    const embed = new EmbedBuilder();
    embed.setColor(crypto.randomInt(654321));
    embed.setTitle("Command Info");
    embed.addFields({ name: "Name", value: this.info.name });
    embed.addFields({ name: "Description", value: this.info.description });

    // add aliases
    if (this.info.aliases.length) {
      embed.addFields({ name: "Aliases", value: this.info.aliases.join(", ") });
    }

    // add syntax usage
    embed.addFields({
      name: "Command Usage",
      value: `\`\`\`${this.prefix}${this.name} ${this.info.options
        .map((op) => `{${op.name}: ${SimpleCommandOptionType[op.type]}}`)
        .join(" ")}\`\`\``,
    });

    // add options if available
    if (this.info.options.length) {
      embed.addFields({
        name: "Options",
        value: `\`\`\`${this.info.options
          .map((op) => `${op.name.padEnd(maxLength + 2)}: ${op.description}`)
          .join("\n")}\`\`\``,
      });
    }

    return this.message.reply({ embeds: [embed] });
  }
}
