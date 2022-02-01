import crypto from "crypto";
import type { Message } from "discord.js";
import { Embed } from "discord.js";

import type {
  ArgSplitter,
  DSimpleCommand,
  SimpleCommandOptionType,
} from "../index.js";
import { MetadataStorage } from "../index.js";

/**
 * Simple command message class
 */
export class SimpleCommandMessage {
  options: SimpleCommandOptionType[];

  constructor(
    public prefix: string | RegExp,
    public argString: string,
    public message: Message,
    public info: DSimpleCommand,
    public splitter?: ArgSplitter
  ) {
    this.options = this.info.parseParamsEx(this, splitter);
  }

  get name(): string {
    return this.info.name;
  }

  get description(): string {
    return this.info.description;
  }

  /**
   * Verify that all options are valid
   * @returns
   */
  isValid(): boolean {
    return !this.options.includes(undefined);
  }

  /**
   * get related commands
   * @returns
   */
  getRelatedCommands(): DSimpleCommand[] {
    const commandName = this.info.name.split(" ")[0];
    if (!commandName) {
      return [];
    }

    return MetadataStorage.instance.simpleCommands.filter(
      (cmd) => cmd.name.startsWith(commandName) && cmd.name !== this.info.name
    );
  }

  /**
   * send usage syntax for command
   * @returns
   */
  sendUsageSyntax(): Promise<Message> {
    const maxLength = !this.info.options.length
      ? 0
      : this.info.options.reduce((a, b) =>
          a.name.length > b.name.length ? a : b
        ).name.length;

    const embed = new Embed();
    embed.setColor(crypto.randomInt(654321));
    embed.setTitle("Command Info");
    embed.addField({ name: "Name", value: this.info.name });
    embed.addField({ name: "Description", value: this.info.description });

    // add aliases
    if (this.info.aliases.length) {
      embed.addField({ name: "Aliases", value: this.info.aliases.join(", ") });
    }

    // add syntax usage
    embed.addField({
      name: "Command Usage",
      value:
        "```" +
        this.prefix +
        this.name +
        ` ${this.info.options
          .map((op) => `{${op.name}: ${op.type}}`)
          .join(" ")}` +
        "```",
    });

    // add options if available
    if (this.info.options.length) {
      embed.addField({
        name: "Options",
        value:
          "```" +
          this.info.options
            .map((op) => `${op.name.padEnd(maxLength + 2)}: ${op.description}`)
            .join("\n") +
          "```",
      });
    }

    return this.message.reply({ embeds: [embed] });
  }
}
