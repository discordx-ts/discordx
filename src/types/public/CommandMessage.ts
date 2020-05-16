import { Message } from "discord.js";
import {
  Commandable,
  Rule
} from "../..";

export class CommandMessage extends Message {
  args: string[];

  static create(
    message: Message
  ) {
    const command = message as CommandMessage;

    return command;
  }
}
