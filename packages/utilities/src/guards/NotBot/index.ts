import {
  ButtonInteraction,
  CommandInteraction,
  ContextMenuCommandInteraction,
  Message,
  MessageReaction,
  SelectMenuInteraction,
  VoiceState,
} from "discord.js";
import type { ArgsOf, GuardFunction } from "discordx";
import { SimpleCommandMessage } from "discordx";

export const NotBot: GuardFunction<
  | ArgsOf<"messageCreate" | "messageReactionAdd" | "voiceStateUpdate">
  | CommandInteraction
  | ContextMenuCommandInteraction
  | SelectMenuInteraction
  | ButtonInteraction
  | SimpleCommandMessage
> = async (arg, client, next) => {
  const argObj = arg instanceof Array ? arg[0] : arg;
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
      : argObj instanceof CommandInteraction ||
        argObj instanceof ContextMenuCommandInteraction ||
        argObj instanceof SelectMenuInteraction ||
        argObj instanceof ButtonInteraction
      ? argObj.member?.user
      : argObj.message.author;
  if (!user?.bot) {
    await next();
  }
};
