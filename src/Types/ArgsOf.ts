import { ClientEvents } from "discord.js";
import { CommandMessage } from "./CommandMessage";

type DiscordEvents = ClientEvents & { commandMessage: [CommandMessage] };

/**
 * Type the arguments of an event
 */
export type ArgsOf<K extends keyof DiscordEvents> = DiscordEvents[K];
