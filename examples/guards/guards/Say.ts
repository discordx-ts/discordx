import { CommandInteraction, MessageReaction, VoiceState } from "discord.js";
import { ArgsOf, GuardFunction } from "../../../src";

export const NotBot: GuardFunction<
  | ArgsOf<"messageCreate" | "messageReactionAdd" | "voiceStateUpdate">
  | CommandInteraction
> = async (arg, client, next) => {
  const argObj = arg instanceof Array ? arg[0] : arg;
  const user =
    argObj instanceof CommandInteraction
      ? argObj.user
      : argObj instanceof MessageReaction
      ? argObj.message.author
      : argObj instanceof VoiceState
      ? argObj.member.user
      : argObj.author;
  if (!user?.bot) {
    await next();
  }
};
