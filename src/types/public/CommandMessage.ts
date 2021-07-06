import { Message } from "discord.js";
import { DCommand } from "../../decorators/classes/DCommand";

export interface CommandMessage extends Message {
  command: {
    prefix: string;
    object: DCommand;
    name: string;
    argString: string;
  };
}
