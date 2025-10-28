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
  type Events,
  MentionableSelectMenuInteraction,
  Message,
  MessageReaction,
  ModalSubmitInteraction,
  RoleSelectMenuInteraction,
  StringSelectMenuInteraction,
  UserSelectMenuInteraction,
  VoiceState,
} from "discord.js";
import {
  type ArgsOf,
  type GuardFunction,
  SimpleCommandMessage,
} from "discordx";

/**
 * Guard to prevent bot from executing discordx methods
 *
 * @param arg
 * @param client
 * @param next
 */
export const NotBot: GuardFunction<
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
  | SimpleCommandMessage
> = async (arg, _client, next, guardData) => {
  const argObj = Array.isArray(arg) ? arg[0] : arg;
  const user =
    argObj instanceof CommandInteraction
      ? argObj.user
      : argObj instanceof MessageReaction
        ? argObj.message.author
        : argObj instanceof VoiceState
          ? argObj.member?.user
          : argObj instanceof Message
            ? argObj.author
            : argObj instanceof SimpleCommandMessage
              ? argObj.message.author
              : argObj instanceof ButtonInteraction ||
                  argObj instanceof ChannelSelectMenuInteraction ||
                  argObj instanceof CommandInteraction ||
                  argObj instanceof ContextMenuCommandInteraction ||
                  argObj instanceof MentionableSelectMenuInteraction ||
                  argObj instanceof ModalSubmitInteraction ||
                  argObj instanceof RoleSelectMenuInteraction ||
                  argObj instanceof StringSelectMenuInteraction ||
                  argObj instanceof UserSelectMenuInteraction
                ? argObj.member?.user
                : argObj.message.author;

  if (!user?.bot) {
    guardData.message = "the NotBot guard passed";
    await next();
  }
};
