/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/samarmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
import type { APIUser, Guild, User } from "discord.js";
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
import type { ArgsOf, Awaitable, Client, GuardFunction } from "discordx";
import { SimpleCommandMessage } from "discordx";

export type IsGuildUserArg =
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
  | SimpleCommandMessage;

export type IsGuardUserCallback<T extends Client = Client> = (options: {
  arg: IsGuildUserArg;
  client: T;
  guild: Guild | null;
  user: User | APIUser | null;
}) => Awaitable<boolean>;

/**
 * A multi purpose guard for user
 *
 * @param arg
 * @param client
 * @param next
 */
export const IsGuildUser =
  <T extends Client>(
    callback: IsGuardUserCallback<T>,
  ): GuardFunction<IsGuildUserArg> =>
  async (arg, client, next) => {
    let guild: Guild | null = null;
    let user: User | APIUser | null = null;

    const argItem = arg instanceof Array ? arg[0] : arg;

    switch (true) {
      case argItem instanceof CommandInteraction:
        guild = argItem.guild;
        user = argItem.user;
        break;
      case argItem instanceof MessageReaction:
        guild = argItem.message.guild;
        user = argItem.message.author;
        break;
      case argItem instanceof VoiceState:
        guild = argItem.guild;
        user = argItem.member?.user ?? null;
        break;
      case argItem instanceof Message:
        guild = argItem.guild;
        user = argItem.author;
        break;
      case argItem instanceof SimpleCommandMessage:
        guild = argItem.message.guild;
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
        if (argItem.member) {
          user = argItem.member.user;
        } else if (argItem.message) {
          user = argItem.message.author;
        }
        break;
    }

    const isNext = await callback({ arg, client: client as T, guild, user });
    if (isNext) {
      await next();
    }
  };
