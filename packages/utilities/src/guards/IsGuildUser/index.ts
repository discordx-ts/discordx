/*
 * -------------------------------------------------------------------------------------------------------
 * Copyright (c) Vijay Meena <vijayymmeena@gmail.com> (https://github.com/vijayymmeena). All rights reserved.
 * Licensed under the Apache License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------------------
 */
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
  type APIUser,
  type Events,
  type Guild,
  type User,
} from "discord.js";
import {
  SimpleCommandMessage,
  type ArgsOf,
  type Awaitable,
  type Client,
  type GuardFunction,
} from "discordx";

export type IsGuildUserArg =
  | ArgsOf<
      Events.MessageCreate | Events.MessageReactionAdd | Events.VoiceStateUpdate
    >
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
        user = argItem.member?.user ?? argItem.message?.author ?? null;
        guild = argItem.guild;
        break;
    }

    const isNext = await callback({ arg, client: client as T, guild, user });
    if (isNext) {
      await next();
    }
  };
