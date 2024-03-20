/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See LICENSE in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { MessageReaction, User } from "discord.js";
import { Discord, Reaction } from "discordx";

@Discord()
export class Example {
  @Reaction({ emoji: "⭐", remove: true })
  async starReaction(reaction: MessageReaction, user: User): Promise<void> {
    await reaction.message.reply(`Received a ${reaction.emoji} from ${user}`);
  }

  @Reaction({ aliases: ["📍", "custom_emoji"], emoji: "📌" })
  async pin(reaction: MessageReaction): Promise<void> {
    await reaction.message.pin();
  }
}
