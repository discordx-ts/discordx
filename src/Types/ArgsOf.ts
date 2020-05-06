import { ClientEvents } from "discord.js";

/**
 * Type the arguments of an event
 */
export type ArgsOf<K extends keyof ClientEvents> = ClientEvents[K];
