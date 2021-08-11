import { Message } from "discord.js";
import { DSimpleCommand } from "../../decorators/classes/DSimpleCommand";

export interface CommandMessage extends Message {
  command: {
    prefix: string;
    object: DSimpleCommand;
    name: string;
    argString: string;
  };
}
