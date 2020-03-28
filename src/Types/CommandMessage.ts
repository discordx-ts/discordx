import { Message } from "discord.js";

export interface CommandMessage extends Message {
  params: string[];
  command: string;
  commandWithPrefix: string;
  originalCommand: string;
  originalCommandWithPrefix: string;
  prefix: string;
}
