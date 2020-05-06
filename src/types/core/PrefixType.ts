import { Client } from "../..";
import { Message } from "discord.js";

export type PrefixType = string | ((params: Message, client: Client) => Promise<string> | string);
