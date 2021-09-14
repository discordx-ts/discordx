import { ArgsOf, GuardFunction, SimpleCommandMessage } from "../../../src";
import {
  CommandInteraction,
  Interaction,
  Message,
  MessageReaction,
  VoiceState,
} from "discord.js";

// Example by @AndyClausen
// Modified @oceanroleplay

export const NotBot: GuardFunction<
  | ArgsOf<"messageCreate" | "messageReactionAdd" | "voiceStateUpdate">
  | Interaction
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
      : argObj instanceof Interaction
      ? argObj.member?.user
      : argObj.message.author;
  if (!user?.bot) {
    await next();
  }
};
