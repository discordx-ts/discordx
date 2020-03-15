import { Client } from "../../../src";
import { Message } from "discord.js";

export function NotBot(message: Message, client: Client) {
  return client.user.id !== message.author.id;
}
