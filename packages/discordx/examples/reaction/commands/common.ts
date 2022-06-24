import type { MessageReaction, User } from "discord.js";

import { Discord, Reaction } from "../../../src/index.js";

@Discord()
export class Example {
  @Reaction("⭐", { remove: false })
  async starReaction(reaction: MessageReaction, user: User): Promise<void> {
    await reaction.message.reply(`Received a ${reaction.emoji} from ${user}`);
  }

  @Reaction("📌", { aliases: ["📍", "custom_emoji"] })
  async pin(reaction: MessageReaction): Promise<void> {
    await reaction.message.pin();
  }
}
