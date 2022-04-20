import type {
  CommandInteraction,
  ContextMenuInteraction,
  MessageEmbed,
} from "discord.js";
import type { SimpleCommandMessage } from "discordx";

export type PermissionHandlerInteraction =
  | CommandInteraction
  | SimpleCommandMessage
  | ContextMenuInteraction;

export type PermissionGuardOptions = {
  content?: string | MessageEmbed;
  ephemeral?: boolean;
};
