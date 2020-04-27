import { Message } from "discord.js";
import { PrefixType } from ".";

export interface CommandMessage extends Message {
  params: string[];
  command: string;
  commandWithPrefix: string;
  originalCommand: string;
  originalCommandWithPrefix: string;
  prefix: PrefixType;
}
