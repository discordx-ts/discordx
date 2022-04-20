import type { CommandInteraction, ContextMenuInteraction } from "discord.js";
import type { SimpleCommandMessage } from "discordx";

export type PermissionHandlerInteraction =
  | CommandInteraction
  | SimpleCommandMessage
  | ContextMenuInteraction;
