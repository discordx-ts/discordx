import { Message } from "discord.js";

export interface CommandMessage extends Message {
  commandName: string;
  commandArgString: string;
}
