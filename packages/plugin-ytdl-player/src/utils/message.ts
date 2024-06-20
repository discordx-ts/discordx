import type { Message } from "discord.js";

export async function deleteMessage(message: Message): Promise<Message | null> {
  if (!message.deletable) {
    return null;
  }

  return await message.delete().catch(() => null);
}
