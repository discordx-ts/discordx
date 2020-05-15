import { Message } from "discord.js";
import {
  Commandable,
  Rule
} from "../..";

export class CommandMessage extends Message {
  args: string[];

  static create(
    message: Message,
    rules: Commandable
  ) {
    const command = message as CommandMessage;

    command.args = message.content.split(Rule(rules.argsSeparator).regex);

    return command;
  }
}
