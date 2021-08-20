import { DSimpleCommand } from "../decorators";
import { Message } from "discord.js";
import { MetadataStorage } from "..";

/**
 * Simple command message class
 */
export class SimpleCommandMessage {
  prefix: string;
  info: DSimpleCommand;
  name: string;
  argString: string;
  message: Message;

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
  }

  /**
   * get related commands
   * @returns
   */
  getRelatedCommands(): DSimpleCommand[] {
    const commandName = this.info.name.split(" ")[0];
    return MetadataStorage.instance.simpleCommands.filter(
      (cmd) => cmd.name.startsWith(commandName) && cmd.name !== this.info.name
    );
  }

  /**
   * send usage syntax for command
   * @returns
   */
  sendUsageSyntax(): Promise<Message> {
    const commandString =
      "Command Usage: ``" +
      this.prefix +
      this.name +
      ` ${this.info.options.map((op) => `{${op.name}}`).join(" ")}` +
      "``" +
      "\nDescription: ``" +
      this.info.description +
      "``";

    const optionsString = this.info.options.length
      ? "\n\nOptions\n" +
        this.info.options
          .map((op) => `> ${op.name}: ${op.description}`)
          .join("\n")
      : "";

    return this.message.reply(`${commandString}${optionsString}`);
  }
}
