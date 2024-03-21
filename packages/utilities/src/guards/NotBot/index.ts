/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { APIUser, User } from "discord.js";
import {
  ButtonInteraction,
  ChannelSelectMenuInteraction,
  CommandInteraction,
  ContextMenuCommandInteraction,
  MentionableSelectMenuInteraction,
  Message,
  MessageReaction,
  ModalSubmitInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
  UserSelectMenuInteraction,
  VoiceState,
} from "discord.js";
import type { ArgsOf, GuardFunction } from "discordx";
import { SimpleCommandMessage } from "discordx";

/**
 * Guard to prevent bot from executing discordx methods
 *
 * @param arg
 * @param client
 * @param next
 */
export const NotBot: GuardFunction<
  | ArgsOf<"messageCreate" | "messageReactionAdd" | "voiceStateUpdate">
  | ButtonInteraction
  | ChannelSelectMenuInteraction
  | CommandInteraction
  | ContextMenuCommandInteraction
  | MentionableSelectMenuInteraction
  | ModalSubmitInteraction
  | RoleSelectMenuInteraction
  | StringSelectMenuInteraction
  | UserSelectMenuInteraction
  | SimpleCommandMessage
> = async (arg, client, next) => {
  const argItem = arg instanceof Array ? arg[0] : arg;

  let user: User | APIUser | null = null;

  switch (true) {
    case argItem instanceof CommandInteraction:
      user = argItem.user;
      break;
    case argItem instanceof MessageReaction:
      user = argItem.message.author;
      break;
    case argItem instanceof VoiceState:
      user = argItem.member?.user ?? null;
      break;
    case argItem instanceof Message:
      user = argItem.author;
      break;
    case argItem instanceof SimpleCommandMessage:
      user = argItem.message.author;
      break;
    case argItem instanceof ButtonInteraction ||
      argItem instanceof ChannelSelectMenuInteraction ||
      argItem instanceof CommandInteraction ||
      argItem instanceof ContextMenuCommandInteraction ||
      argItem instanceof MentionableSelectMenuInteraction ||
      argItem instanceof ModalSubmitInteraction ||
      argItem instanceof RoleSelectMenuInteraction ||
      argItem instanceof StringSelectMenuInteraction ||
      argItem instanceof UserSelectMenuInteraction:
      user = argItem.member?.user ?? argItem.message?.author ?? null;
      break;
  }

  if (!user?.bot) {
    await next();
  }
};
