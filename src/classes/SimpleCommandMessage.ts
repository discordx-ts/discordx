import { DSimpleCommand, MetadataStorage, SimpleCommandOptionType } from "..";
import { Message } from "discord.js";

/**
 * Simple command message class
 */
export class SimpleCommandMessage {
  prefix: string;
  info: DSimpleCommand;
  name: string;
  argString: string;
  message: Message;
  options: SimpleCommandOptionType[];

  constructor(
    prefix: string,
    name: string,
    argString: string,
    message: Message,
    info: DSimpleCommand
  ) {
    this.message = message;
    this.prefix = prefix;
    this.info = info;
    this.name = name;
    this.argString = argString;
    this.options = this.info.parseParamsEx(this);
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

    const commandString =
      "**Command Usage**:```" +
      this.prefix +
      this.name +
      ` ${this.info.options
        .map((op) => `{${op.name}: ${op.type}}`)
        .join(this.info.argSplitter.toString())}` +
      "```" +
      "\n**Description**:```" +
      this.info.description +
      "```" +
      "\n**Options**" +
      "```" +
      this.info.options
        .map((op) => `${op.name.padEnd(maxLength + 2)}: ${op.description}`)
        .join("\n") +
      "```";

    return this.message.reply(`${commandString}`);
  }
}
