/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */

import type {
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";

import type { Client, DReaction } from "../../index.js";

export class ReactionManager {
  constructor(private client: Client) {}

  async executeReaction(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
  ): Promise<unknown> {
    const action = this.parseReaction(reaction);
    if (!action) {
      return null;
    }

    if (!action.isBotAllowed(this.client.botId)) {
      return null;
    }

    if (!(await action.isGuildAllowed(this.client, reaction.message.guildId))) {
      return null;
    }

    if (!action.directMessage && !reaction.message.guild) {
      return null;
    }

    if (!action.partial && reaction.partial) {
      reaction = await reaction.fetch();
    }

    if (!action.partial && user.partial) {
      user = await user.fetch();
    }

    if (action.remove) {
      await reaction.users.remove(user.id);
    }

    return action.execute(this.client.guards, reaction, user, this.client);
  }

  parseReaction(
    message: MessageReaction | PartialMessageReaction,
  ): DReaction | undefined {
    const reaction = this.client.reactions.find((react) => {
      const validNames = [react.emoji, ...react.aliases];
      const { emoji } = message;

      return (
        (emoji.id ? validNames.includes(emoji.id) : false) ||
        (emoji.name ? validNames.includes(emoji.name) : false)
      );
    });

    return reaction;
  }
}
