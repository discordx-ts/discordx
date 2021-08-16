import { Message } from "discord.js";
import { DSimpleCommand } from "../decorators";

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
}
