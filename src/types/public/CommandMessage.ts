import { Message } from "discord.js";
import {
  Commandable
} from "../core/Commandable";

export class CommandMessage extends Message {
  args: string[];

  static create(
    message: Message,
    rules: Commandable
  ) {
    const command = message as CommandMessage;

    command.args = message.content.split(rules.argsSeparator.regex);

    return command;
  }
}
