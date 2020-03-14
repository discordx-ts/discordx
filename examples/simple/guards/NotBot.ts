import { Client, Message } from "discord.js";

export function NotBot() {
  return (message: Message, client: Client) => {
    return client.user.id !== message.author.id;
  };
}
