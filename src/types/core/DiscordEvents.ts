import { ClientEvents } from "discord.js";
import { CommandMessage } from "..";

export type DiscordEvents = keyof ClientEvents | keyof {
  commandMessage: [CommandMessage];
};
