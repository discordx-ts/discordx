import * as crypto from "crypto";
import {
  ArgSplitter,
  DSimpleCommand,
  MetadataStorage,
  SimpleCommandOptionType,
} from "..";
import { Message, MessageEmbed } from "discord.js";

/**
 * Simple command message class
 */
export class SimpleCommandMessage {
  prefix: string;
  info: DSimpleCommand;
  argString: string;
  message: Message;
  options: SimpleCommandOptionType[];

  get name(): string {
    return this.info.name;
  }

  get description(): string {
    return this.info.description;
  }

  constructor(
    prefix: string,
    argString: string,
    message: Message,
    info: DSimpleCommand,
    splitter?: ArgSplitter
  ) {
    this.message = message;
    this.prefix = prefix;
    this.info = info;
    this.argString = argString;
    this.options = this.info.parseParamsEx(this, splitter);
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
    const maxLength = this.info.options.reduce((a, b) =>
      a.name.length > b.name.length ? a : b
    ).name.length;

    const embed = new MessageEmbed();
    embed.setColor(crypto.randomInt(654321));
    embed.setTitle("Command Info");
    embed.addField("Name", this.info.name);
    embed.addField("Description", this.info.description);

    // add aliases
    if (this.info.aliases.length) {
      embed.addField("Aliases", this.info.aliases.join(", "));
    }

    // add syntax usage
    embed.addField(
      "Command Usage",
      "```" +
        this.prefix +
        this.name +
        ` ${this.info.options
          .map((op) => `{${op.name}: ${op.type}}`)
          .join(" ")}` +
        "```"
    );

    // add options if available
    if (this.info.options.length) {
      embed.addField(
        "Options",
        "```" +
          this.info.options
            .map((op) => `${op.name.padEnd(maxLength + 2)}: ${op.description}`)
            .join("\n") +
          "```"
      );
    }

    return this.message.reply({ embeds: [embed] });
  }
}
